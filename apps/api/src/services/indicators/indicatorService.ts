import type {
  BiasRule,
  BollPosition,
  Candle,
  ChangeRule,
  Direction,
  IndicatorCross,
  KLineRelation,
  KdjLine,
  MacdLine,
  MacdSignal,
  MaPairRelation,
  ScanTimeframe,
  SlopeRange,
  VolumeRatioBaseline
} from '@gate-screener/shared-types';
import { CONVERGE_THRESHOLD, SLOPE_45_THRESHOLD } from '../../utils/constants.js';
import { findBaseCandleIndex } from '../../utils/timeframe.js';

type TrendDirection = 'UP' | 'DOWN' | 'FLAT';
type CrossSignal = Exclude<MaPairRelation, 'ANY' | 'OPPOSITE' | 'CONVERGE'> | 'NONE';
type IndicatorCrossSignal = Exclude<IndicatorCross, 'ANY'> | 'NONE';

export interface MacdSeries {
  macdLine: number[];
  signalLine: number[];
  histogram: number[];
}

export interface BollSeries {
  upper: number[];
  middle: number[];
  lower: number[];
}

export interface KdjSeries {
  k: number[];
  d: number[];
  j: number[];
}

const isFiniteNumber = (value: number | null | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const getLastTwoValidValues = (series: number[]): [number, number] | null => {
  const validValues = series.filter(isFiniteNumber);
  if (validValues.length < 2) {
    return null;
  }

  const previous = validValues[validValues.length - 2];
  const current = validValues[validValues.length - 1];
  if (!isFiniteNumber(previous) || !isFiniteNumber(current)) {
    return null;
  }

  return [previous, current];
};

const getLastTwoAlignedPairs = (left: number[], right: number[]): [[number, number], [number, number]] | null => {
  const pairs: Array<[number, number]> = [];

  for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
    const leftValue = left[index];
    const rightValue = right[index];
    if (!isFiniteNumber(leftValue) || !isFiniteNumber(rightValue)) {
      continue;
    }

    pairs.push([leftValue, rightValue]);
  }

  if (pairs.length < 2) {
    return null;
  }

  const previous = pairs[pairs.length - 2];
  const current = pairs[pairs.length - 1];
  if (!previous || !current) {
    return null;
  }

  return [previous, current];
};

export const getLatestFiniteValue = (series: number[], offset = 0): number | null => {
  for (let index = series.length - 1 - offset; index >= 0; index -= 1) {
    const value = series[index];
    if (isFiniteNumber(value)) {
      return value;
    }
  }

  return null;
};

export const calcSMA = (candles: Candle[] | number[], period: number): number[] => {
  const values = typeof candles[0] === 'number' ? (candles as number[]) : (candles as Candle[]).map((candle) => candle.close);
  const result = Array.from({ length: values.length }, () => Number.NaN);
  let rollingSum = 0;

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!isFiniteNumber(value)) {
      continue;
    }

    rollingSum += value;

    if (index >= period) {
      rollingSum -= values[index - period] ?? 0;
    }

    if (index >= period - 1) {
      result[index] = rollingSum / period;
    }
  }

  return result;
};

export const calcEMA = (values: number[], period: number): number[] => {
  const result = Array.from({ length: values.length }, () => Number.NaN);
  const multiplier = 2 / (period + 1);

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!isFiniteNumber(value)) {
      continue;
    }

    if (index === 0) {
      result[index] = value;
      continue;
    }

    const previous = result[index - 1];
    result[index] = isFiniteNumber(previous) ? (value - previous) * multiplier + previous : value;
  }

  return result;
};

export const calcMACD = (candles: Candle[]): MacdSeries => {
  const closes = candles.map((candle) => candle.close);
  const shortEma = calcEMA(closes, 12);
  const longEma = calcEMA(closes, 26);
  const macdLine = closes.map((_, index) => {
    const shortValue = shortEma[index];
    const longValue = longEma[index];
    return isFiniteNumber(shortValue) && isFiniteNumber(longValue) ? shortValue - longValue : Number.NaN;
  });
  const signalLine = calcEMA(
    macdLine.map((value) => (isFiniteNumber(value) ? value : 0)),
    9
  );
  const histogram = macdLine.map((value, index) => {
    const signalValue = signalLine[index];
    return isFiniteNumber(value) && isFiniteNumber(signalValue) ? (value - signalValue) * 2 : Number.NaN;
  });

  return {
    macdLine,
    signalLine,
    histogram
  };
};

export const calcRSI = (candles: Candle[], period: number): number[] => {
  const closes = candles.map((candle) => candle.close);
  const result = Array.from({ length: closes.length }, () => Number.NaN);
  let gainSum = 0;
  let lossSum = 0;

  for (let index = 1; index < closes.length; index += 1) {
    const delta = closes[index]! - closes[index - 1]!;
    gainSum += Math.max(delta, 0);
    lossSum += Math.max(-delta, 0);

    if (index > period) {
      const previousDelta = closes[index - period]! - closes[index - period - 1]!;
      gainSum -= Math.max(previousDelta, 0);
      lossSum -= Math.max(-previousDelta, 0);
    }

    if (index >= period) {
      result[index] = lossSum === 0 ? 100 : 100 - 100 / (1 + gainSum / lossSum);
    }
  }

  return result;
};

export const calcStdDev = (values: number[], period: number): number[] => {
  const result = Array.from({ length: values.length }, () => Number.NaN);

  for (let index = period - 1; index < values.length; index += 1) {
    const window = values.slice(index - period + 1, index + 1);
    const mean = window.reduce((sum, value) => sum + value, 0) / period;
    const variance = window.reduce((sum, value) => sum + (value - mean) ** 2, 0) / period;
    result[index] = Math.sqrt(variance);
  }

  return result;
};

export const calcBoll = (candles: Candle[], period = 20, deviation = 2): BollSeries => {
  const closes = candles.map((candle) => candle.close);
  const middle = calcSMA(closes, period);
  const stdSeries = calcStdDev(closes, period);

  return {
    middle,
    upper: middle.map((value, index) => (isFiniteNumber(value) && isFiniteNumber(stdSeries[index]) ? value + deviation * stdSeries[index]! : Number.NaN)),
    lower: middle.map((value, index) => (isFiniteNumber(value) && isFiniteNumber(stdSeries[index]) ? value - deviation * stdSeries[index]! : Number.NaN))
  };
};

export const calcKDJ = (candles: Candle[], period = 9): KdjSeries => {
  const k = Array.from({ length: candles.length }, () => Number.NaN);
  const d = Array.from({ length: candles.length }, () => Number.NaN);
  const j = Array.from({ length: candles.length }, () => Number.NaN);
  let previousK = 50;
  let previousD = 50;

  for (let index = period - 1; index < candles.length; index += 1) {
    const window = candles.slice(index - period + 1, index + 1);
    const lowest = Math.min(...window.map((item) => item.low));
    const highest = Math.max(...window.map((item) => item.high));
    const denominator = highest - lowest;
    const rsv = denominator === 0 ? 50 : ((candles[index]!.close - lowest) / denominator) * 100;
    const nextK = (2 * previousK + rsv) / 3;
    const nextD = (2 * previousD + nextK) / 3;
    const nextJ = 3 * nextK - 2 * nextD;

    k[index] = nextK;
    d[index] = nextD;
    j[index] = nextJ;
    previousK = nextK;
    previousD = nextD;
  }

  return { k, d, j };
};

export const calcBias = (candles: Candle[], period: BiasRule['period']): number[] => {
  const closes = candles.map((candle) => candle.close);
  const movingAverage = calcSMA(closes, period);

  return movingAverage.map((value, index) =>
    !isFiniteNumber(value) || value === 0 ? Number.NaN : ((closes[index]! - value) / value) * 100
  );
};

export const calcVolumeMovingAverage = (candles: Candle[], baseline: VolumeRatioBaseline): number[] =>
  calcSMA(
    candles.map((candle) => candle.volume),
    baseline === 'MA20' ? 20 : 5
  );

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

export const compareRange = (
  value: number | null | undefined,
  min?: number,
  max?: number
): boolean => {
  if (!isFiniteNumber(value)) {
    return false;
  }

  if (typeof min === 'number' && value < min) {
    return false;
  }

  if (typeof max === 'number' && value > max) {
    return false;
  }

  return true;
};

export const detectKLineRelation = (candle: Candle, maValue: number): Exclude<KLineRelation, 'ANY'> | 'NONE' => {
  if (!isFiniteNumber(maValue)) {
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

export const hasEntityCrossAboveMa = (candle: Candle, maValue: number): boolean =>
  isFiniteNumber(maValue) && candle.close > candle.open && candle.open < maValue && candle.close > maValue;

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
  const pair = getLastTwoAlignedPairs(maA, maB);
  if (!pair) {
    return 'NONE';
  }

  const [[prevA, prevB], [currA, currB]] = pair;
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

export const detectIndicatorCross = (left: number[], right: number[]): IndicatorCrossSignal => {
  const pair = getLastTwoAlignedPairs(left, right);
  if (!pair) {
    return 'NONE';
  }

  const [[previousLeft, previousRight], [currentLeft, currentRight]] = pair;
  const previousDiff = previousLeft - previousRight;
  const currentDiff = currentLeft - currentRight;

  if (previousDiff <= 0 && currentDiff > 0) {
    return 'GOLDEN_CROSS';
  }

  if (previousDiff >= 0 && currentDiff < 0) {
    return 'DEAD_CROSS';
  }

  return 'NONE';
};

export const detectMacdSignal = (macdLine: number[], signalLine: number[]): IndicatorCrossSignal =>
  detectIndicatorCross(macdLine, signalLine);

export const detectKdjCross = (k: number[], d: number[]): IndicatorCrossSignal =>
  detectIndicatorCross(k, d);

export const matchesMacdSignal = (
  ruleSignal: MacdSignal,
  actualSignal: ReturnType<typeof detectMacdSignal>
): boolean => {
  if (ruleSignal === 'ANY') {
    return true;
  }

  return ruleSignal === actualSignal;
};

export const matchesIndicatorCross = (
  ruleSignal: IndicatorCross,
  actualSignal: IndicatorCrossSignal
): boolean => {
  if (ruleSignal === 'ANY') {
    return true;
  }

  return ruleSignal === actualSignal;
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

  const validValues = maValues.filter(isFiniteNumber);
  if (validValues.length < 2) {
    return false;
  }

  const spread = (Math.max(...validValues) - Math.min(...validValues)) / close;
  return spread <= threshold;
};

export const resolveMacdValue = (series: MacdSeries, line: MacdLine): number | null => {
  if (line === 'DIF') {
    return getLatestFiniteValue(series.macdLine);
  }

  if (line === 'DEA') {
    return getLatestFiniteValue(series.signalLine);
  }

  return getLatestFiniteValue(series.histogram);
};

export const resolveKdjValue = (series: KdjSeries, line: KdjLine): number | null => {
  if (line === 'K') {
    return getLatestFiniteValue(series.k);
  }

  if (line === 'D') {
    return getLatestFiniteValue(series.d);
  }

  return getLatestFiniteValue(series.j);
};

export const evaluateBollPosition = (
  position: BollPosition,
  price: number,
  series: BollSeries
): boolean => {
  const upper = getLatestFiniteValue(series.upper);
  const middle = getLatestFiniteValue(series.middle);
  const lower = getLatestFiniteValue(series.lower);

  if (!isFiniteNumber(upper) || !isFiniteNumber(middle) || !isFiniteNumber(lower)) {
    return false;
  }

  if (position === 'BREAK_UPPER') {
    return price > upper;
  }

  if (position === 'BREAK_LOWER') {
    return price < lower;
  }

  if (position === 'BELOW_MID') {
    return price < middle;
  }

  if (position === 'ABOVE_MID') {
    return price >= middle;
  }

  return true;
};

export const calcBollBandwidthPct = (series: BollSeries): number | null => {
  const upper = getLatestFiniteValue(series.upper);
  const middle = getLatestFiniteValue(series.middle);
  const lower = getLatestFiniteValue(series.lower);

  if (!isFiniteNumber(upper) || !isFiniteNumber(middle) || !isFiniteNumber(lower) || middle === 0) {
    return null;
  }

  return ((upper - lower) / middle) * 100;
};

export const resolveVolumeRatio = (candles: Candle[], baseline: VolumeRatioBaseline): number | null => {
  const currentVolume = candles[candles.length - 1]?.volume;
  const averageSeries = calcVolumeMovingAverage(candles, baseline);
  const averageVolume = getLatestFiniteValue(averageSeries);

  if (!isFiniteNumber(currentVolume) || !isFiniteNumber(averageVolume) || averageVolume === 0) {
    return null;
  }

  return currentVolume / averageVolume;
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
  const currentClose = candles[candles.length - 1]?.close;

  if (!isFiniteNumber(currentClose) || currentClose === 0) {
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
