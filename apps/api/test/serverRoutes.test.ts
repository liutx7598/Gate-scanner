import path from 'node:path';
import os from 'node:os';
import { mkdtemp } from 'node:fs/promises';
import { beforeEach, describe, expect, it } from 'vitest';
import type { MarketDataService } from '../src/types/internal.js';
import { buildServer } from '../src/server.js';
import { StrategyRepository } from '../src/services/strategy/strategyRepository.js';
import { buildTrendCandles } from './helpers.js';

const marketDataService: MarketDataService = {
  async getContracts() {
    return [
      { name: 'BTC_USDT', settle: 'usdt' },
      { name: 'ETH_USDT', settle: 'usdt' }
    ];
  },
  async getTickers() {
    return [
      {
        contract: 'BTC_USDT',
        latestPrice: 120,
        changePct: 5.2,
        volume: 2_000_000,
        turnover: 10_000_000,
        fundingRate: 0.0005,
        high24h: 121,
        low24h: 100
      },
      {
        contract: 'ETH_USDT',
        latestPrice: 80,
        changePct: -1.5,
        volume: 800_000,
        turnover: 2_000_000,
        fundingRate: -0.0001,
        high24h: 84,
        low24h: 78
      }
    ];
  },
  async getCandles(params) {
    if (params.contract === 'BTC_USDT') {
      return buildTrendCandles([100, 101, 102, 103, 104, 105, 106, 108, 110, 112, 115, 118, 120]);
    }

    return buildTrendCandles([90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78]);
  }
};

describe('server routes', () => {
  let strategyRepository: StrategyRepository;

  beforeEach(async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'gate-screener-'));
    strategyRepository = new StrategyRepository(path.join(tempDir, 'strategies.json'));
  });

  it('returns scan results for matching contracts', async () => {
    const { app } = await buildServer({ marketDataService, strategyRepository });

    const response = await app.inject({
      method: 'POST',
      url: '/api/scan',
      payload: {
        settle: 'usdt',
        timeframe: '1h',
        minVolume: 500000,
        sortBy: 'change',
        sortDirection: 'desc',
        limit: 20,
        maRules: [{ id: 'ma5', period: 5, direction: 'UP', slopeRange: 'ANY', klineRelation: 'ANY' }],
        maPairRules: [],
        changeRules: [],
        patterns: []
      }
    });

    expect(response.statusCode).toBe(200);
    const payload = response.json();
    expect(payload.matched).toBe(1);
    expect(payload.results[0].contract).toBe('BTC_USDT');
  });

  it('supports strategy save and delete', async () => {
    const { app } = await buildServer({ marketDataService, strategyRepository });

    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/strategies',
      payload: {
        name: '趋势策略',
        request: {
          settle: 'usdt',
          timeframe: '1h',
          maRules: [],
          maPairRules: [],
          changeRules: [],
          patterns: []
        }
      }
    });

    expect(createResponse.statusCode).toBe(201);
    const strategyId = createResponse.json().data.id as string;

    const listResponse = await app.inject({
      method: 'GET',
      url: '/api/strategies'
    });

    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.json().data).toHaveLength(1);

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/api/strategies/${strategyId}`
    });

    expect(deleteResponse.statusCode).toBe(204);
  });
});
