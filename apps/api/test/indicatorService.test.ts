import { describe, expect, it } from 'vitest';
import { buildTrendCandles, createCandle } from './helpers.js';
import {
  calcBias,
  calcBoll,
  calcBollBandwidthPct,
  calcKDJ,
  calcMACD,
  calcRSI,
  calcSMA,
  detectDirection,
  detectIndicatorCross,
  detectKLineRelation,
  detectMacdSignal,
  detectMaConverge,
  detectMaCross,
  detectSlopeRange,
  evaluateChangeRule,
  hasEntityCrossAboveMa,
  resolveVolumeRatio
} from '../src/services/indicators/indicatorService.js';

describe('indicatorService', () => {
  it('calculates SMA for a rolling window', () => {
    const candles = buildTrendCandles([1, 2, 3, 4, 5]);
    const ma = calcSMA(candles, 3);

    expect(ma[0]).toBeNaN();
    expect(ma[1]).toBeNaN();
    expect(ma[4]).toBeCloseTo(4);
  });

  it('detects upward direction', () => {
    expect(detectDirection([Number.NaN, 1, 2])).toBe('UP');
  });

  it('maps slope to configured ranges', () => {
    expect(detectSlopeRange([100, 100.4])).toBe('0_45');
    expect(detectSlopeRange([100, 102])).toBe('45_90');
  });

  it('detects kline crossing above ma', () => {
    const candle = createCandle(105, 0, { open: 99, close: 101, high: 106, low: 95 });
    expect(detectKLineRelation(candle, 100)).toBe('CROSS_UP');
  });

  it('detects ma crossovers', () => {
    expect(detectMaCross([1, 2], [2, 1])).toBe('CROSS_UP');
    expect(detectMaCross([2, 1], [1, 2])).toBe('CROSS_DOWN');
  });

  it('detects ma convergence', () => {
    expect(detectMaConverge([100, 100.2, 99.9], 100)).toBe(true);
    expect(detectMaConverge([100, 103], 100)).toBe(false);
  });

  it('builds MACD series with finite values after warmup', () => {
    const candles = buildTrendCandles(Array.from({ length: 50 }, (_, index) => 100 + index));
    const macd = calcMACD(candles);

    expect(Number.isFinite(macd.macdLine.at(-1))).toBe(true);
    expect(Number.isFinite(macd.signalLine.at(-1))).toBe(true);
    expect(Number.isFinite(macd.histogram.at(-1))).toBe(true);
  });

  it('detects MACD golden and dead crosses', () => {
    expect(detectMacdSignal([Number.NaN, 0.1, 0.3], [Number.NaN, 0.2, 0.2])).toBe('GOLDEN_CROSS');
    expect(detectMacdSignal([Number.NaN, 0.3, 0.1], [Number.NaN, 0.2, 0.2])).toBe('DEAD_CROSS');
  });

  it('calculates RSI, BOLL, KDJ and BIAS values', () => {
    const candles = buildTrendCandles(Array.from({ length: 40 }, (_, index) => 100 + index * 0.8));

    expect(Number.isFinite(calcRSI(candles, 14).at(-1))).toBe(true);
    expect(Number.isFinite(calcBoll(candles).middle.at(-1))).toBe(true);
    expect(Number.isFinite(calcKDJ(candles).k.at(-1))).toBe(true);
    expect(Number.isFinite(calcBias(candles, 5).at(-1))).toBe(true);
  });

  it('detects KDJ cross, entity cross and volume ratio', () => {
    expect(detectIndicatorCross([Number.NaN, 20, 40], [Number.NaN, 30, 30])).toBe('GOLDEN_CROSS');

    const crossCandle = createCandle(100, 0, { open: 98, close: 102, high: 103, low: 97 });
    expect(hasEntityCrossAboveMa(crossCandle, 100)).toBe(true);

    const candles = [
      ...buildTrendCandles([10, 11, 12, 13]),
      createCandle(14, 4, { volume: 4000, turnover: 56000 })
    ];
    expect(resolveVolumeRatio(candles, 'MA5')).toBeGreaterThan(1);
  });

  it('computes boll bandwidth percent', () => {
    const candles = buildTrendCandles(Array.from({ length: 30 }, (_, index) => 100 + Math.sin(index) * 3));
    expect(calcBollBandwidthPct(calcBoll(candles))).not.toBeNull();
  });

  it('evaluates greater-than change rules', () => {
    const candles = buildTrendCandles([100, 101, 102, 104, 106]);
    const result = evaluateChangeRule(candles, '1h', { timeframe: '4h', operator: 'GT', value: 4 });

    expect(result.matched).toBe(true);
    expect(result.changePct).toBeGreaterThan(4);
  });
});
