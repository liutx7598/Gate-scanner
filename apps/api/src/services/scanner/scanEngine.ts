import { randomUUID } from 'node:crypto';
import pLimit from 'p-limit';
import type {
  BiasRule,
  BollRule,
  ChartAnnotation,
  KdjRule,
  MacdRule,
  MaPairRelation,
  MaRule,
  RsiRule,
  ScanRequest,
  ScanResponse,
  ScanResult,
  VolumeRatioRule
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
  calcBias,
  calcBoll,
  calcBollBandwidthPct,
  calcChangePct,
  calcKDJ,
  calcMACD,
  calcRSI,
  calcSMA,
  calcVolatility,
  compareRange,
  detectDirection,
  detectIndicatorCross,
  detectKLineRelation,
  detectMaConverge,
  detectMaCross,
  detectMaOpposite,
  detectMacdSignal,
  detectSlopeRange,
  evaluateBollPosition,
  evaluateChangeRule,
  getLatestFiniteValue,
  hasEntityCrossAboveMa,
  matchesDirection,
  matchesIndicatorCross,
  matchesKLineRelation,
  matchesMacdSignal,
  matchesSlopeRange,
  resolveKdjValue,
  resolveMacdValue,
  resolveVolumeRatio
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
      return `MA${maA}/MA${maB} 方向相反`;
    case 'CONVERGE':
      return `MA${maA}/MA${maB} 收敛`;
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
    hits.push(`MA${rule.period} 斜率 ${slopeRange === '0_45' ? '平缓' : '陡峭'}`);
  }
  if (rule.klineRelation !== 'ANY') {
    const relationLabel = {
      CROSS_UP: 'K 线上穿',
      CROSS_DOWN: 'K 线下穿',
      ABOVE_MA: 'K 线在均线上',
      BELOW_MA: 'K 线在均线下',
      NONE: '无明确关系'
    } as const;
    hits.push(`MA${rule.period} ${relationLabel[relation]}`);
  }
  return hits;
};

const buildMacdCrossLabel = (signal: ScanRequest['macdSignal']): string =>
  signal === 'DEAD_CROSS' ? 'MACD 死叉' : 'MACD 金叉';

const buildMacdRuleHit = (rule: MacdRule): string[] => {
  const hits: string[] = [];
  if (rule.cross !== 'ANY') {
    hits.push(rule.cross === 'DEAD_CROSS' ? 'MACD 死叉' : 'MACD 金叉');
  }
  if (typeof rule.min === 'number' || typeof rule.max === 'number') {
    hits.push(`MACD ${rule.line} 数值区间`);
  }
  return hits;
};

const buildRsiHit = (rule: RsiRule, value: number): string => `RSI${rule.period} ${value.toFixed(2)}`;
const buildKdjHit = (rule: KdjRule, value: number | null): string[] => {
  const hits: string[] = [];
  if (rule.cross !== 'ANY') {
    hits.push(rule.cross === 'DEAD_CROSS' ? 'KDJ 死叉' : 'KDJ 金叉');
  }
  if (typeof rule.min === 'number' || typeof rule.max === 'number') {
    hits.push(`KDJ ${rule.line} ${value?.toFixed(2) ?? ''}`.trim());
  }
  return hits;
};
const buildBollHit = (rule: BollRule): string[] => {
  const hits: string[] = [];
  if (rule.position !== 'ANY') {
    const label = {
      ABOVE_MID: 'BOLL 中轨上方',
      BELOW_MID: 'BOLL 中轨下方',
      BREAK_UPPER: 'BOLL 上破上轨',
      BREAK_LOWER: 'BOLL 下破下轨',
      ANY: 'BOLL'
    } as const;
    hits.push(label[rule.position]);
  }
  if (typeof rule.min === 'number' || typeof rule.max === 'number') {
    hits.push('BOLL 带宽');
  }
  return hits;
};
const buildBiasHit = (rule: BiasRule, value: number): string => `BIAS${rule.period} ${value.toFixed(2)}%`;
const buildVolumeRatioHit = (rule: VolumeRatioRule, value: number): string =>
  `量比 ${rule.baseline} ${value.toFixed(2)}`;

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
      ...request.maPairRules.flatMap((rule) => [rule.maA, rule.maB]),
      ...(request.maConvergence.enabled ? request.maConvergence.periods : [])
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
      if (typeof currentMaValue !== 'number') {
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

      const maACurrent = getLatestFiniteValue(maA);
      const maBCurrent = getLatestFiniteValue(maB);
      if (maACurrent === null || maBCurrent === null) {
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

    if (request.maConvergence.enabled) {
      const currentValues = request.maConvergence.periods
        .map((period) => getLatestFiniteValue(maSeries[`MA${period}`] ?? []))
        .filter((value): value is number => value !== null);

      if (
        currentValues.length < 2 ||
        !detectMaConverge(currentValues, currentClose, request.maConvergence.thresholdPct / 100)
      ) {
        return null;
      }

      hits.push(`均线收敛 <= ${request.maConvergence.thresholdPct}%`);
    }

    if (request.entityCrossAboveMa5) {
      const ma5 = getLatestFiniteValue(maSeries.MA5 ?? []);
      if (ma5 === null || !hasEntityCrossAboveMa(currentCandle, ma5)) {
        return null;
      }

      hits.push('实体上穿 MA5');
    }

    for (const changeRule of request.changeRules) {
      const evaluation = evaluateChangeRule(candles, request.timeframe, changeRule);
      if (!evaluation.matched) {
        return null;
      }

      hits.push(`${changeRule.timeframe} 涨跌幅 ${evaluation.changePct.toFixed(2)}%`);
    }

    if (request.macdSignal !== 'ANY') {
      const macdSeries = calcMACD(candles);
      const signal = detectMacdSignal(macdSeries.macdLine, macdSeries.signalLine);
      if (!matchesMacdSignal(request.macdSignal, signal)) {
        return null;
      }

      hits.push(buildMacdCrossLabel(request.macdSignal));
    }

    if (request.rsiRule.enabled) {
      const rsiSeries = calcRSI(candles, request.rsiRule.period);
      const rsiValue = getLatestFiniteValue(rsiSeries);
      if (!compareRange(rsiValue, request.rsiRule.min, request.rsiRule.max)) {
        return null;
      }

      hits.push(buildRsiHit(request.rsiRule, rsiValue!));
    }

    if (request.macdRule.enabled) {
      const macdSeries = calcMACD(candles);
      const macdCross = detectMacdSignal(macdSeries.macdLine, macdSeries.signalLine);
      const macdValue = resolveMacdValue(macdSeries, request.macdRule.line);

      if (!matchesIndicatorCross(request.macdRule.cross, macdCross)) {
        return null;
      }

      if ((typeof request.macdRule.min === 'number' || typeof request.macdRule.max === 'number') &&
        !compareRange(macdValue, request.macdRule.min, request.macdRule.max)) {
        return null;
      }

      hits.push(...buildMacdRuleHit(request.macdRule));
    }

    if (request.kdjRule.enabled) {
      const kdjSeries = calcKDJ(candles);
      const kdjCross = detectIndicatorCross(kdjSeries.k, kdjSeries.d);
      const kdjValue = resolveKdjValue(kdjSeries, request.kdjRule.line);

      if (!matchesIndicatorCross(request.kdjRule.cross, kdjCross)) {
        return null;
      }

      if ((typeof request.kdjRule.min === 'number' || typeof request.kdjRule.max === 'number') &&
        !compareRange(kdjValue, request.kdjRule.min, request.kdjRule.max)) {
        return null;
      }

      hits.push(...buildKdjHit(request.kdjRule, kdjValue));
    }

    if (request.bollRule.enabled) {
      const bollSeries = calcBoll(candles);

      if (request.bollRule.position !== 'ANY' && !evaluateBollPosition(request.bollRule.position, currentClose, bollSeries)) {
        return null;
      }

      if ((typeof request.bollRule.min === 'number' || typeof request.bollRule.max === 'number') &&
        !compareRange(calcBollBandwidthPct(bollSeries), request.bollRule.min, request.bollRule.max)) {
        return null;
      }

      hits.push(...buildBollHit(request.bollRule));
    }

    if (request.biasRule.enabled) {
      const biasSeries = calcBias(candles, request.biasRule.period);
      const biasValue = getLatestFiniteValue(biasSeries);
      if (!compareRange(biasValue, request.biasRule.min, request.biasRule.max)) {
        return null;
      }

      hits.push(buildBiasHit(request.biasRule, biasValue!));
    }

    if (request.volumeRatioRule.enabled) {
      const volumeRatio = resolveVolumeRatio(candles, request.volumeRatioRule.baseline);
      if (!compareRange(volumeRatio, request.volumeRatioRule.min, request.volumeRatioRule.max)) {
        return null;
      }

      hits.push(buildVolumeRatioHit(request.volumeRatioRule, volumeRatio!));
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
      hits: hits.length > 0 ? hits : ['基础市场筛选通过'],
      hitPatterns: patternResult.matched,
      candles,
      maSeries,
      annotations
    };
  }
}
