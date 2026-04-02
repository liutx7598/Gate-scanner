import type { Candle, ChartAnnotation, PatternType } from '@gate-screener/shared-types';
import { PATTERN_LABELS } from '@gate-screener/shared-types';
import type { PatternMatchResult } from '../../types/internal.js';

const last = <T>(items: T[]): T | undefined => items[items.length - 1];

const candleStats = (candle: Candle) => {
  const body = Math.abs(candle.close - candle.open);
  const upperShadow = candle.high - Math.max(candle.open, candle.close);
  const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
  const isBull = candle.close > candle.open;
  const isBear = candle.close < candle.open;

  return {
    body,
    upperShadow,
    lowerShadow,
    isBull,
    isBear
  };
};

const buildAnnotation = (label: string, candle: Candle, type: ChartAnnotation['type'] = 'PATTERN'): ChartAnnotation => ({
  type,
  label,
  timestamp: candle.timestamp,
  price: candle.close
});

export const detectLongUpperShadow = (candles: Candle[]): boolean => {
  const current = last(candles);
  if (!current) {
    return false;
  }

  const stats = candleStats(current);
  const recentHigh = Math.max(...candles.slice(-10).map((candle) => candle.high));
  return stats.upperShadow >= Math.max(stats.body * 2, current.close * 0.005) && current.high >= recentHigh * 0.995;
};

export const detectLongLowerShadow = (candles: Candle[]): boolean => {
  const current = last(candles);
  if (!current) {
    return false;
  }

  const stats = candleStats(current);
  const recentLow = Math.min(...candles.slice(-10).map((candle) => candle.low));
  return stats.lowerShadow >= Math.max(stats.body * 2, current.close * 0.005) && current.low <= recentLow * 1.005;
};

export const detectBullishEngulfing = (candles: Candle[]): boolean => {
  const previous = candles[candles.length - 2];
  const current = candles[candles.length - 1];
  if (!previous || !current) {
    return false;
  }

  const prevStats = candleStats(previous);
  const currentStats = candleStats(current);
  return (
    prevStats.isBear &&
    currentStats.isBull &&
    currentStats.body > prevStats.body &&
    current.open <= previous.close &&
    current.close >= previous.open
  );
};

export const detectBearishEngulfing = (candles: Candle[]): boolean => {
  const previous = candles[candles.length - 2];
  const current = candles[candles.length - 1];
  if (!previous || !current) {
    return false;
  }

  const prevStats = candleStats(previous);
  const currentStats = candleStats(current);
  return (
    prevStats.isBull &&
    currentStats.isBear &&
    currentStats.body > prevStats.body &&
    current.open >= previous.close &&
    current.close <= previous.open
  );
};

const findLocalLowIndices = (candles: Candle[]): number[] =>
  candles
    .map((_, index) => index)
    .slice(1, -1)
    .filter((index) => {
      const current = candles[index];
      const previous = candles[index - 1];
      const next = candles[index + 1];
      return Boolean(current && previous && next && current.low <= previous.low && current.low <= next.low);
    });

export const detectWBottom = (candles: Candle[]): boolean => {
  const window = candles.slice(-40);
  if (window.length < 12) {
    return false;
  }

  const localLows = findLocalLowIndices(window);
  if (localLows.length < 2) {
    return false;
  }

  const leftIndex = localLows[0];
  const rightIndex = localLows[localLows.length - 1];
  if (leftIndex === undefined || rightIndex === undefined) {
    return false;
  }

  if (rightIndex - leftIndex < 4) {
    return false;
  }

  const leftCandle = window[leftIndex];
  const rightCandle = window[rightIndex];
  if (!leftCandle || !rightCandle) {
    return false;
  }

  const leftLow = leftCandle.low;
  const rightLow = rightCandle.low;
  const neckline = Math.max(...window.slice(leftIndex, rightIndex + 1).map((candle) => candle.high));
  const current = last(window)!;

  return rightLow >= leftLow * 0.98 && neckline >= leftLow * 1.01 && current.close >= neckline * 0.995;
};

export const detectLotusFromWater = (candles: Candle[], maSeries: Record<string, number[]>): boolean => {
  const current = last(candles);
  if (!current) {
    return false;
  }

  const maValues = ['MA5', 'MA10', 'MA20'].map((key) => maSeries[key]?.[maSeries[key].length - 1] ?? Number.NaN);
  if (maValues.some((value) => !Number.isFinite(value))) {
    return false;
  }

  const stats = candleStats(current);
  const bodyLow = Math.min(current.open, current.close);
  const bodyHigh = Math.max(current.open, current.close);

  return stats.isBull && maValues.every((value) => value >= bodyLow && value <= bodyHigh);
};

export const detectGuillotine = (candles: Candle[], maSeries: Record<string, number[]>): boolean => {
  const current = last(candles);
  if (!current) {
    return false;
  }

  const maValues = ['MA5', 'MA10', 'MA20'].map((key) => maSeries[key]?.[maSeries[key].length - 1] ?? Number.NaN);
  if (maValues.some((value) => !Number.isFinite(value))) {
    return false;
  }

  const stats = candleStats(current);
  const bodyLow = Math.min(current.open, current.close);
  const bodyHigh = Math.max(current.open, current.close);

  return stats.isBear && maValues.every((value) => value >= bodyLow && value <= bodyHigh);
};

const average = (values: number[]): number => values.reduce((sum, value) => sum + value, 0) / values.length;

export const detectRoundBottom = (candles: Candle[]): boolean => {
  const window = candles.slice(-20);
  if (window.length < 15) {
    return false;
  }

  const closes = window.map((candle) => candle.close);
  const minValue = Math.min(...closes);
  const minIndex = closes.indexOf(minValue);
  const normalizedIndex = minIndex / (closes.length - 1);

  if (normalizedIndex < 0.3 || normalizedIndex > 0.7) {
    return false;
  }

  const left = closes.slice(0, minIndex + 1);
  const right = closes.slice(minIndex);
  const leftFirst = left[0];
  const leftLast = left[left.length - 1];
  const rightFirst = right[0];
  const rightLast = right[right.length - 1];
  if (leftFirst === undefined || leftLast === undefined || rightFirst === undefined || rightLast === undefined) {
    return false;
  }

  const leftSlope = leftLast - leftFirst;
  const rightSlope = rightLast - rightFirst;

  return leftSlope < 0 && rightSlope > 0 && average(right) > average(left) * 0.98;
};

export const detectFlagBreakout = (candles: Candle[]): boolean => {
  const window = candles.slice(-30);
  if (window.length < 12) {
    return false;
  }

  const runup = window.slice(0, 10);
  const consolidation = window.slice(10, -1);
  const current = window[window.length - 1];
  const runupStart = runup[0];
  const runupEnd = runup[runup.length - 1];
  if (!runupStart || !runupEnd || !current) {
    return false;
  }

  const runupPct = ((runupEnd.close - runupStart.close) / runupStart.close) * 100;
  const consolidationHigh = Math.max(...consolidation.map((candle) => candle.high));
  const consolidationLow = Math.min(...consolidation.map((candle) => candle.low));
  const consolidationRangePct = ((consolidationHigh - consolidationLow) / consolidationHigh) * 100;

  return runupPct > 5 && consolidationRangePct < 4 && current.close > consolidationHigh * 1.002;
};

export const detectDoublePinBottom = (candles: Candle[]): boolean => {
  const window = candles.slice(-3);
  if (window.length < 2) {
    return false;
  }

  const strongPins = window.filter((candle) => {
    const stats = candleStats(candle);
    return stats.lowerShadow >= stats.body * 2 && stats.lowerShadow >= candle.close * 0.005;
  });

  return strongPins.length >= 2;
};

export const detectThreeIncense = (candles: Candle[]): boolean => {
  const window = candles.slice(-3);
  if (window.length < 3) {
    return false;
  }

  const upperShadowCandles = window.filter((candle) => {
    const stats = candleStats(candle);
    return stats.upperShadow >= stats.body * 2 && stats.upperShadow >= candle.close * 0.005;
  });

  return upperShadowCandles.length >= 1;
};

export const detectPatterns = (
  candles: Candle[],
  maSeries: Record<string, number[]>,
  requestedPatterns: PatternType[]
): PatternMatchResult => {
  const current = last(candles);
  if (!current || requestedPatterns.length === 0) {
    return { matched: [], hits: [], annotations: [] };
  }

  const detectors: Record<PatternType, () => boolean> = {
    LONG_UPPER_SHADOW: () => detectLongUpperShadow(candles),
    LONG_LOWER_SHADOW: () => detectLongLowerShadow(candles),
    BULLISH_ENGULFING: () => detectBullishEngulfing(candles),
    BEARISH_ENGULFING: () => detectBearishEngulfing(candles),
    W_BOTTOM: () => detectWBottom(candles),
    LOTUS_FROM_WATER: () => detectLotusFromWater(candles, maSeries),
    GUILLOTINE: () => detectGuillotine(candles, maSeries),
    ROUND_BOTTOM: () => detectRoundBottom(candles),
    FLAG_BREAKOUT: () => detectFlagBreakout(candles),
    DOUBLE_PIN_BOTTOM: () => detectDoublePinBottom(candles),
    THREE_INCENSE: () => detectThreeIncense(candles)
  };

  const matched = requestedPatterns.filter((pattern) => detectors[pattern]());
  return {
    matched,
    hits: matched.map((pattern) => `命中 ${PATTERN_LABELS[pattern]}`),
    annotations: matched.map((pattern) => buildAnnotation(PATTERN_LABELS[pattern], current))
  };
};
