import type {
  Candle,
  ChangeRule,
  Direction,
  KLineRelation,
  MaPairRelation,
  ScanTimeframe,
  SlopeRange
} from '@gate-screener/shared-types';
import { CONVERGE_THRESHOLD, SLOPE_45_THRESHOLD } from '../../utils/constants.js';
import { findBaseCandleIndex } from '../../utils/timeframe.js';

type TrendDirection = 'UP' | 'DOWN' | 'FLAT';
type CrossSignal = Exclude<MaPairRelation, 'ANY' | 'OPPOSITE' | 'CONVERGE'> | 'NONE';

const getLastTwoValidValues = (series: number[]): [number, number] | null => {
  const validValues = series.filter((value) => Number.isFinite(value));
  if (validValues.length < 2) {
    return null;
  }

  const previous = validValues[validValues.length - 2];
  const current = validValues[validValues.length - 1];
  if (previous === undefined || current === undefined) {
    return null;
  }

  return [previous, current];
};

export const calcSMA = (candles: Candle[], period: number): number[] =>
  candles.map((_, index) => {
    if (index + 1 < period) {
      return Number.NaN;
    }

    const window = candles.slice(index + 1 - period, index + 1);
    const total = window.reduce((sum, candle) => sum + candle.close, 0);
    return total / period;
  });

export const detectDirection = (series: number[]): TrendDirection => {
  const pair = getLastTwoValidValues(series);
  if (!pair) {
    return 'FLAT';
  }

  const [previous, current] = pair;
  if (current > previous) {
    return 'UP';
  }

  if (current < previous) {
    return 'DOWN';
  }

  return 'FLAT';
};

export const matchesDirection = (ruleDirection: Direction, actualDirection: TrendDirection): boolean => {
  if (ruleDirection === 'ANY') {
    return true;
  }

  return ruleDirection === actualDirection;
};

export const detectSlopeRange = (series: number[]): SlopeRange => {
  const pair = getLastTwoValidValues(series);
  if (!pair) {
    return 'ANY';
  }

  const [previous, current] = pair;
  if (previous === 0) {
    return 'ANY';
  }

  const absSlope = Math.abs((current - previous) / previous);
  return absSlope <= SLOPE_45_THRESHOLD ? '0_45' : '45_90';
};

export const matchesSlopeRange = (ruleRange: SlopeRange, actualRange: SlopeRange): boolean => {
  if (ruleRange === 'ANY') {
    return true;
  }

  return ruleRange === actualRange;
};

export const detectKLineRelation = (candle: Candle, maValue: number): Exclude<KLineRelation, 'ANY'> | 'NONE' => {
  if (!Number.isFinite(maValue)) {
    return 'NONE';
  }

  if (candle.open < maValue && candle.close > maValue) {
    return 'CROSS_UP';
  }

  if (candle.open > maValue && candle.close < maValue) {
    return 'CROSS_DOWN';
  }

  if (candle.open > maValue && candle.close > maValue) {
    return 'ABOVE_MA';
  }

  if (candle.open < maValue && candle.close < maValue) {
    return 'BELOW_MA';
  }

  return 'NONE';
};

export const matchesKLineRelation = (
  ruleRelation: KLineRelation,
  actualRelation: ReturnType<typeof detectKLineRelation>
): boolean => {
  if (ruleRelation === 'ANY') {
    return true;
  }

  return ruleRelation === actualRelation;
};

export const detectMaCross = (maA: number[], maB: number[]): CrossSignal => {
  const valuesA = maA.filter((value) => Number.isFinite(value));
  const valuesB = maB.filter((value) => Number.isFinite(value));

  if (valuesA.length < 2 || valuesB.length < 2) {
    return 'NONE';
  }

  const prevA = valuesA[valuesA.length - 2];
  const prevB = valuesB[valuesB.length - 2];
  const currA = valuesA[valuesA.length - 1];
  const currB = valuesB[valuesB.length - 1];
  if (prevA === undefined || prevB === undefined || currA === undefined || currB === undefined) {
    return 'NONE';
  }

  const previousDiff = prevA - prevB;
  const currentDiff = currA - currB;

  if (previousDiff <= 0 && currentDiff > 0) {
    return 'CROSS_UP';
  }

  if (previousDiff >= 0 && currentDiff < 0) {
    return 'CROSS_DOWN';
  }

  return 'NONE';
};

export const detectMaOpposite = (maA: number[], maB: number[]): boolean => {
  const directionA = detectDirection(maA);
  const directionB = detectDirection(maB);

  return (
    (directionA === 'UP' && directionB === 'DOWN') || (directionA === 'DOWN' && directionB === 'UP')
  );
};

export const detectMaConverge = (
  maValues: number[],
  close: number,
  threshold = CONVERGE_THRESHOLD
): boolean => {
  if (close <= 0 || maValues.length === 0) {
    return false;
  }

  const validValues = maValues.filter((value) => Number.isFinite(value));
  if (validValues.length < 2) {
    return false;
  }

  const spread = (Math.max(...validValues) - Math.min(...validValues)) / close;
  return spread <= threshold;
};

export const calcChangePct = (currentPrice: number, basePrice: number): number => {
  if (!Number.isFinite(basePrice) || basePrice === 0) {
    return 0;
  }

  return ((currentPrice - basePrice) / basePrice) * 100;
};

export const calcVolatility = (candles: Candle[]): number => {
  if (candles.length === 0) {
    return 0;
  }

  const highs = candles.map((candle) => candle.high);
  const lows = candles.map((candle) => candle.low);
  const lastCandle = candles[candles.length - 1];
  if (!lastCandle) {
    return 0;
  }

  const currentClose = lastCandle.close;

  if (currentClose === 0) {
    return 0;
  }

  return ((Math.max(...highs) - Math.min(...lows)) / currentClose) * 100;
};

export const evaluateChangeRule = (
  candles: Candle[],
  candleTimeframe: ScanTimeframe,
  rule: ChangeRule,
  now = new Date()
): { matched: boolean; changePct: number } => {
  if (candles.length === 0) {
    return { matched: false, changePct: 0 };
  }

  const timestamps = candles.map((candle) => candle.timestamp);
  const baseIndex = findBaseCandleIndex(timestamps, candleTimeframe, rule.timeframe, now);
  const baseCandle = candles[baseIndex];
  const lastCandle = candles[candles.length - 1];
  if (!baseCandle || !lastCandle) {
    return { matched: false, changePct: 0 };
  }

  const changePct = calcChangePct(lastCandle.close, baseCandle.close);

  if (rule.operator === 'GT') {
    return { matched: changePct > (rule.value ?? 0), changePct };
  }

  if (rule.operator === 'LT') {
    return { matched: changePct < (rule.value ?? 0), changePct };
  }

  return {
    matched: changePct >= (rule.min ?? 0) && changePct <= (rule.max ?? 0),
    changePct
  };
};
