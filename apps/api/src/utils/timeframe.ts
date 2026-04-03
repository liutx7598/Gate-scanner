import type { ChangeRule, ScanRequest, ScanTimeframe } from '@gate-screener/shared-types';
import {
  CHANGE_RULE_SECONDS,
  DEFAULT_CANDLE_LIMIT,
  EXTENDED_CANDLE_LIMIT,
  EXTENDED_PATTERN_SET,
  TIMEFRAME_SECONDS
} from './constants.js';

const ceilDivide = (a: number, b: number): number => Math.max(1, Math.ceil(a / b));

export const getRequiredCandleLimit = (request: ScanRequest): number => {
  const maxMaPeriod = Math.max(
    20,
    ...request.maRules.map((rule) => rule.period),
    ...request.maPairRules.flatMap((rule) => [rule.maA, rule.maB]),
    ...(request.maConvergence.enabled ? request.maConvergence.periods : [])
  );
  const indicatorRequirement = Math.max(
    request.macdSignal === 'ANY' && !request.macdRule.enabled ? 0 : 35,
    request.rsiRule.enabled ? request.rsiRule.period + 2 : 0,
    request.kdjRule.enabled ? 12 : 0,
    request.bollRule.enabled ? 24 : 0,
    request.biasRule.enabled ? request.biasRule.period + 2 : 0,
    request.volumeRatioRule.enabled ? (request.volumeRatioRule.baseline === 'MA20' ? 24 : 10) : 0,
    request.entityCrossAboveMa5 ? 8 : 0
  );

  const patternRequirement = request.patterns.some((pattern) => EXTENDED_PATTERN_SET.has(pattern))
    ? EXTENDED_CANDLE_LIMIT
    : DEFAULT_CANDLE_LIMIT;

  const changeRequirement = Math.max(
    0,
    ...request.changeRules.map((rule) => getChangeRuleLookback(rule, request.timeframe))
  );
  return Math.max(
    DEFAULT_CANDLE_LIMIT,
    maxMaPeriod + 5,
    indicatorRequirement,
    patternRequirement,
    changeRequirement + 5
  );
};

const getChangeRuleLookback = (rule: ChangeRule, candleTimeframe: ScanTimeframe): number => {
  if (rule.timeframe === 'today') {
    return ceilDivide(24 * 60 * 60, TIMEFRAME_SECONDS[candleTimeframe]);
  }

  return ceilDivide(CHANGE_RULE_SECONDS[rule.timeframe], TIMEFRAME_SECONDS[candleTimeframe]) + 1;
};

export const findBaseCandleIndex = (
  timestamps: number[],
  candleTimeframe: ScanTimeframe,
  changeTimeframe: ChangeRule['timeframe'],
  now = new Date()
): number => {
  if (timestamps.length === 0) {
    return 0;
  }

  const lastTimestamp = timestamps.at(-1);
  if (lastTimestamp === undefined) {
    return 0;
  }

  if (changeTimeframe === 'today') {
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const startMs = startOfDay.getTime();
    const todayIndex = timestamps.findIndex((timestamp) => timestamp >= startMs);
    return todayIndex >= 0 ? todayIndex : 0;
  }

  const seconds = CHANGE_RULE_SECONDS[changeTimeframe];
  const targetTime = lastTimestamp - seconds * 1000;
  const foundIndex = timestamps.findIndex((timestamp) => timestamp >= targetTime);
  if (foundIndex >= 0) {
    return foundIndex;
  }

  return Math.max(0, timestamps.length - 1 - ceilDivide(seconds, TIMEFRAME_SECONDS[candleTimeframe]));
};
