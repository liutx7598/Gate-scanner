import { describe, expect, it } from 'vitest';
import { buildTrendCandles, createCandle } from './helpers.js';
import {
  calcSMA,
  detectDirection,
  detectKLineRelation,
  detectMaConverge,
  detectMaCross,
  detectSlopeRange,
  evaluateChangeRule
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

  it('evaluates greater-than change rules', () => {
    const candles = buildTrendCandles([100, 101, 102, 104, 106]);
    const result = evaluateChangeRule(candles, '1h', { timeframe: '4h', operator: 'GT', value: 4 });

    expect(result.matched).toBe(true);
    expect(result.changePct).toBeGreaterThan(4);
  });
});
