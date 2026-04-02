import { describe, expect, it } from 'vitest';
import { buildTrendCandles, createCandle } from './helpers.js';
import {
  detectBullishEngulfing,
  detectDoublePinBottom,
  detectLongUpperShadow,
  detectLotusFromWater,
  detectWBottom
} from '../src/services/patterns/patternService.js';

describe('patternService', () => {
  it('detects long upper shadow', () => {
    const candles = [
      ...buildTrendCandles([100, 102, 103]),
      createCandle(104, 4, { open: 103.8, close: 104, high: 111, low: 103.2 })
    ];

    expect(detectLongUpperShadow(candles)).toBe(true);
  });

  it('detects bullish engulfing', () => {
    const candles = [
      createCandle(100, 0, { open: 103, close: 100, high: 104, low: 99 }),
      createCandle(105, 1, { open: 99, close: 105, high: 106, low: 98 })
    ];

    expect(detectBullishEngulfing(candles)).toBe(true);
  });

  it('detects W bottom', () => {
    const closes = [110, 106, 102, 100, 103, 106, 109, 105, 102, 101, 104, 107, 111, 114];
    const candles = closes.map((close, index) =>
      createCandle(close, index, {
        low: close - (index === 3 ? 3 : index === 9 ? 2 : 1),
        high: close + 2
      })
    );

    expect(detectWBottom(candles)).toBe(true);
  });

  it('detects lotus from water when candle body covers major ma lines', () => {
    const candles = [
      ...buildTrendCandles([100, 100, 99, 99, 98, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111]),
      createCandle(118, 20, { open: 103, close: 118, high: 119, low: 102 })
    ];
    const maSeries = {
      MA5: Array(candles.length).fill(Number.NaN).map((_, index) => (index === candles.length - 1 ? 109 : Number.NaN)),
      MA10: Array(candles.length).fill(Number.NaN).map((_, index) => (index === candles.length - 1 ? 107 : Number.NaN)),
      MA20: Array(candles.length).fill(Number.NaN).map((_, index) => (index === candles.length - 1 ? 104 : Number.NaN))
    };

    expect(detectLotusFromWater(candles, maSeries)).toBe(true);
  });

  it('detects double pin bottom', () => {
    const candles = [
      createCandle(100, 0, { open: 101, close: 100, high: 102, low: 94 }),
      createCandle(101, 1, { open: 102, close: 101, high: 103, low: 95 }),
      createCandle(103, 2, { open: 102.5, close: 103, high: 104, low: 100 })
    ];

    expect(detectDoublePinBottom(candles)).toBe(true);
  });
});
