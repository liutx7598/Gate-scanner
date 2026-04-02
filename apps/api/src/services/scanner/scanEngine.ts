import { randomUUID } from 'node:crypto';
import pLimit from 'p-limit';
import type {
  ChartAnnotation,
  MaPairRelation,
  MaRule,
  ScanRequest,
  ScanResponse,
  ScanResult
} from '@gate-screener/shared-types';
import { uniqueNumbers } from '@gate-screener/shared-utils';
import type { FastifyBaseLogger } from 'fastify';
import {
  DEFAULT_CONCURRENCY,
  DEFAULT_RESULT_LIMIT,
  MAX_CANDIDATE_UNIVERSE,
  MAX_RESULTS
} from '../../utils/constants.js';
import { getRequiredCandleLimit } from '../../utils/timeframe.js';
import type { MarketDataService, NormalizedTicker } from '../../types/internal.js';
import {
  calcChangePct,
  calcSMA,
  calcVolatility,
  detectDirection,
  detectKLineRelation,
  detectMaConverge,
  detectMaCross,
  detectMaOpposite,
  detectSlopeRange,
  evaluateChangeRule,
  matchesDirection,
  matchesKLineRelation,
  matchesSlopeRange
} from '../indicators/indicatorService.js';
import { detectPatterns } from '../patterns/patternService.js';

const isActiveMaRule = (rule: MaRule): boolean =>
  rule.direction !== 'ANY' || rule.slopeRange !== 'ANY' || rule.klineRelation !== 'ANY';

const isActivePairRule = (relation: MaPairRelation): boolean => relation !== 'ANY';

const sortTickers = (tickers: NormalizedTicker[], request: ScanRequest): NormalizedTicker[] => {
  const direction = request.sortDirection ?? 'desc';
  const factor = direction === 'asc' ? 1 : -1;
  const sorter = request.sortBy ?? 'volume';

  return [...tickers].sort((left, right) => {
    const leftValue =
      sorter === 'change'
        ? left.changePct
        : sorter === 'volatility'
          ? calcChangePct(left.high24h, left.low24h)
          : sorter === 'funding'
            ? left.fundingRate
            : left.turnover || left.volume;
    const rightValue =
      sorter === 'change'
        ? right.changePct
        : sorter === 'volatility'
          ? calcChangePct(right.high24h, right.low24h)
          : sorter === 'funding'
            ? right.fundingRate
            : right.turnover || right.volume;

    return (leftValue - rightValue) * factor;
  });
};

const buildPairHitLabel = (maA: number, maB: number, relation: MaPairRelation): string => {
  switch (relation) {
    case 'CROSS_UP':
      return `MA${maA}/MA${maB} 金叉`;
    case 'CROSS_DOWN':
      return `MA${maA}/MA${maB} 死叉`;
    case 'OPPOSITE':
      return `MA${maA}/MA${maB} 相悖`;
    case 'CONVERGE':
      return `MA${maA}/MA${maB} 收拢`;
    default:
      return `MA${maA}/MA${maB}`;
  }
};

const buildMaRuleHits = (
  rule: MaRule,
  direction: ReturnType<typeof detectDirection>,
  slopeRange: ReturnType<typeof detectSlopeRange>,
  relation: ReturnType<typeof detectKLineRelation>
): string[] => {
  const hits: string[] = [];
  if (rule.direction !== 'ANY') {
    hits.push(`MA${rule.period} ${direction === 'UP' ? '向上' : direction === 'DOWN' ? '向下' : '走平'}`);
  }
  if (rule.slopeRange !== 'ANY') {
    hits.push(`MA${rule.period} 斜率 ${slopeRange === '0_45' ? '0-45°' : slopeRange === '45_90' ? '45-90°' : '不限'}`);
  }
  if (rule.klineRelation !== 'ANY') {
    const relationLabel = {
      CROSS_UP: 'K线向上穿过',
      CROSS_DOWN: 'K线向下穿过',
      ABOVE_MA: 'K线在均线上',
      BELOW_MA: 'K线在均线下',
      NONE: '无明确关系'
    } as const;
    hits.push(`MA${rule.period} ${relationLabel[relation]}`);
  }
  return hits;
};

const sortResults = (results: ScanResult[], request: ScanRequest): ScanResult[] => {
  const direction = request.sortDirection ?? 'desc';
  const factor = direction === 'asc' ? 1 : -1;
  const sortBy = request.sortBy ?? 'volume';

  return [...results].sort((left, right) => {
    const leftValue =
      sortBy === 'change'
        ? left.changePct
        : sortBy === 'volatility'
          ? left.volatility
          : sortBy === 'funding'
            ? left.fundingRate ?? 0
            : left.turnover || left.volume;
    const rightValue =
      sortBy === 'change'
        ? right.changePct
        : sortBy === 'volatility'
          ? right.volatility
          : sortBy === 'funding'
            ? right.fundingRate ?? 0
            : right.turnover || right.volume;

    return (leftValue - rightValue) * factor;
  });
};

export class ScanEngine {
  constructor(
    private readonly marketDataService: MarketDataService,
    private readonly logger: FastifyBaseLogger
  ) {}

  async scan(request: ScanRequest): Promise<ScanResponse> {
    const startedAt = Date.now();
    const requestId = randomUUID();
    const resultLimit = Math.min(request.limit ?? DEFAULT_RESULT_LIMIT, MAX_RESULTS);
    const candleLimit = getRequiredCandleLimit(request);

    this.logger.info({ requestId, request }, 'scan requested');

    const [contracts, tickers] = await Promise.all([
      this.marketDataService.getContracts(request.settle),
      this.marketDataService.getTickers(request.settle)
    ]);

    const contractNames = new Set(contracts.map((contract) => contract.name));
    const filteredTickers = tickers.filter((ticker) => {
      if (!contractNames.has(ticker.contract)) {
        return false;
      }

      if (request.minVolume && ticker.volume < request.minVolume) {
        return false;
      }

      if (request.minTurnover && ticker.turnover < request.minTurnover) {
        return false;
      }

      return true;
    });

    const candidateUniverse = sortTickers(filteredTickers, request).slice(
      0,
      Math.min(Math.max(resultLimit * 2, MAX_CANDIDATE_UNIVERSE), MAX_RESULTS)
    );

    if (candidateUniverse.length === 0) {
      return {
        requestId,
        durationMs: Date.now() - startedAt,
        totalContracts: contracts.length,
        candidates: 0,
        matched: 0,
        results: []
      };
    }

    const limit = pLimit(DEFAULT_CONCURRENCY);
    const results = await Promise.all(
      candidateUniverse.map((ticker) => limit(() => this.evaluateContract(ticker, request, candleLimit)))
    );

    const matchedResults = results.filter((result): result is ScanResult => Boolean(result));
    const sortedResults = sortResults(matchedResults, request).slice(0, resultLimit);
    const durationMs = Date.now() - startedAt;

    this.logger.info(
      {
        requestId,
        totalContracts: contracts.length,
        candidates: candidateUniverse.length,
        matched: sortedResults.length,
        durationMs
      },
      'scan completed'
    );

    return {
      requestId,
      durationMs,
      totalContracts: contracts.length,
      candidates: candidateUniverse.length,
      matched: sortedResults.length,
      results: sortedResults
    };
  }

  private async evaluateContract(
    ticker: NormalizedTicker,
    request: ScanRequest,
    candleLimit: number
  ): Promise<ScanResult | null> {
    const candles = await this.marketDataService.getCandles({
      settle: request.settle,
      contract: ticker.contract,
      timeframe: request.timeframe,
      limit: candleLimit
    });

    if (candles.length < 10) {
      return null;
    }

    const periods = uniqueNumbers([
      5,
      10,
      20,
      ...request.maRules.map((rule) => rule.period),
      ...request.maPairRules.flatMap((rule) => [rule.maA, rule.maB])
    ]);

    const maSeries = Object.fromEntries(periods.map((period) => [`MA${period}`, calcSMA(candles, period)]));
    const currentCandle = candles[candles.length - 1];
    if (!currentCandle) {
      return null;
    }

    const currentClose = currentCandle.close;
    const hits: string[] = [];
    const annotations: ChartAnnotation[] = [];

    for (const rule of request.maRules.filter(isActiveMaRule)) {
      const series = maSeries[`MA${rule.period}`];
      if (!series) {
        return null;
      }

      const direction = detectDirection(series);
      const slopeRange = detectSlopeRange(series);
      const currentMaValue = series[series.length - 1];
      if (currentMaValue === undefined) {
        return null;
      }

      const relation = detectKLineRelation(currentCandle, currentMaValue);

      const matched =
        matchesDirection(rule.direction, direction) &&
        matchesSlopeRange(rule.slopeRange, slopeRange) &&
        matchesKLineRelation(rule.klineRelation, relation);

      if (!matched) {
        return null;
      }

      hits.push(...buildMaRuleHits(rule, direction, slopeRange, relation));
    }

    for (const pairRule of request.maPairRules.filter((rule) => isActivePairRule(rule.relation))) {
      const maA = maSeries[`MA${pairRule.maA}`];
      const maB = maSeries[`MA${pairRule.maB}`];
      if (!maA || !maB) {
        return null;
      }

      const maACurrent = maA[maA.length - 1];
      const maBCurrent = maB[maB.length - 1];
      if (maACurrent === undefined || maBCurrent === undefined) {
        return null;
      }

      const relationMatched =
        pairRule.relation === 'CROSS_UP'
          ? detectMaCross(maA, maB) === 'CROSS_UP'
          : pairRule.relation === 'CROSS_DOWN'
            ? detectMaCross(maA, maB) === 'CROSS_DOWN'
            : pairRule.relation === 'OPPOSITE'
              ? detectMaOpposite(maA, maB)
              : detectMaConverge([maACurrent, maBCurrent], currentClose);

      if (!relationMatched) {
        return null;
      }

      hits.push(buildPairHitLabel(pairRule.maA, pairRule.maB, pairRule.relation));

      if (pairRule.relation === 'CROSS_UP' || pairRule.relation === 'CROSS_DOWN') {
        annotations.push({
          type: 'MA_CROSS',
          label: buildPairHitLabel(pairRule.maA, pairRule.maB, pairRule.relation),
          timestamp: currentCandle.timestamp,
          price: currentClose
        });
      }
    }

    for (const changeRule of request.changeRules) {
      const evaluation = evaluateChangeRule(candles, request.timeframe, changeRule);
      if (!evaluation.matched) {
        return null;
      }

      hits.push(`${changeRule.timeframe} 涨跌幅 ${evaluation.changePct.toFixed(2)}%`);
    }

    const patternResult = detectPatterns(candles, maSeries, request.patterns);
    if (request.patterns.length > 0 && patternResult.matched.length === 0) {
      return null;
    }

    hits.push(...patternResult.hits);
    annotations.push(...patternResult.annotations);

    return {
      contract: ticker.contract,
      latestPrice: ticker.latestPrice,
      changePct: ticker.changePct,
      volume: ticker.volume,
      turnover: ticker.turnover,
      fundingRate: ticker.fundingRate,
      volatility: calcVolatility(candles.slice(-20)),
      hits: hits.length > 0 ? hits : ['基础市场初筛通过'],
      hitPatterns: patternResult.matched,
      candles,
      maSeries,
      annotations
    };
  }
}
