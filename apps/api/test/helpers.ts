import type { Candle } from '@gate-screener/shared-types';

export const createCandle = (
  close: number,
  index: number,
  overrides: Partial<Candle> = {}
): Candle => ({
  timestamp: 1_700_000_000_000 + index * 60_000,
  open: close - 0.5,
  high: close + 1,
  low: close - 1,
  close,
  volume: 1000 + index * 10,
  turnover: (1000 + index * 10) * close,
  ...overrides
});

export const buildTrendCandles = (values: number[]): Candle[] =>
  values.map((value, index) => createCandle(value, index));
