import { RestClient } from 'gateio-api';
import { LRUCache } from 'lru-cache';
import type { Candle, ContractMeta, ScanRequest } from '@gate-screener/shared-types';
import { CACHE_TTL_MS, RETRY_COUNT, RETRY_DELAY_MS } from '../../utils/constants.js';
import type { MarketDataService, NormalizedTicker } from '../../types/internal.js';

type CacheValue = ContractMeta[] | NormalizedTicker[] | Candle[];

const toNumber = (value: string | number | undefined): number => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export class GateMarketService implements MarketDataService {
  private readonly client = new RestClient({});
  private readonly cache = new LRUCache<string, CacheValue>({
    max: 512,
    ttl: CACHE_TTL_MS
  });

  async getContracts(settle: ScanRequest['settle']): Promise<ContractMeta[]> {
    const cacheKey = `contracts:${settle}`;

    return this.fromCache(cacheKey, async () => {
      const contracts = await this.withRetry(() => this.client.getFuturesContracts({ settle }));

      return contracts
        .filter((contract) => contract.name)
        .map((contract) => ({
          name: contract.name!,
          settle,
          quantoMultiplier: toNumber(contract.quanto_multiplier),
          markType: contract.mark_type,
          type: contract.type
        }));
    });
  }

  async getTickers(settle: ScanRequest['settle']): Promise<NormalizedTicker[]> {
    const cacheKey = `tickers:${settle}`;

    return this.fromCache(cacheKey, async () => {
      const tickers = await this.withRetry(() => this.client.getFuturesTickers({ settle }));

      return tickers.map((ticker) => ({
        contract: ticker.contract,
        latestPrice: toNumber(ticker.last),
        changePct: toNumber(ticker.change_percentage),
        volume: toNumber(ticker.volume_24h_base || ticker.volume_24h),
        turnover: toNumber(ticker.volume_24h_quote || ticker.volume_24h_usd),
        fundingRate: toNumber(ticker.funding_rate),
        high24h: toNumber(ticker.high_24h),
        low24h: toNumber(ticker.low_24h)
      }));
    });
  }

  async getCandles(params: {
    settle: ScanRequest['settle'];
    contract: string;
    timeframe: ScanRequest['timeframe'];
    limit: number;
  }): Promise<Candle[]> {
    const { contract, limit, settle, timeframe } = params;
    const cacheKey = `candles:${settle}:${contract}:${timeframe}:${limit}`;

    return this.fromCache(cacheKey, async () => {
      const candles = await this.withRetry(() =>
        this.client.getFuturesCandles({
          settle,
          contract,
          interval: timeframe,
          limit
        })
      );

      return candles
        .map((candle) => ({
          timestamp: candle.t * 1000,
          open: toNumber(candle.o),
          high: toNumber(candle.h),
          low: toNumber(candle.l),
          close: toNumber(candle.c),
          volume: toNumber(candle.v),
          turnover: toNumber(candle.sum)
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
    });
  }

  private async fromCache<T extends CacheValue>(cacheKey: string, loader: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached as T;
    }

    const value = await loader();
    this.cache.set(cacheKey, value);
    return value;
  }

  private async withRetry<T>(loader: () => Promise<T>): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt < RETRY_COUNT; attempt += 1) {
      try {
        return await loader();
      } catch (error) {
        lastError = error;
        if (attempt < RETRY_COUNT - 1) {
          await wait(RETRY_DELAY_MS * (attempt + 1));
        }
      }
    }

    throw lastError;
  }
}
