import { z } from 'zod';

const slopeRangeSchema = z.enum(['ANY', '0_45', '45_90']);
const directionSchema = z.enum(['ANY', 'UP', 'DOWN']);
const klineRelationSchema = z.enum(['ANY', 'CROSS_UP', 'CROSS_DOWN', 'ABOVE_MA', 'BELOW_MA']);
const maPairRelationSchema = z.enum(['ANY', 'CROSS_UP', 'CROSS_DOWN', 'OPPOSITE', 'CONVERGE']);
const patternTypeSchema = z.enum([
  'LONG_UPPER_SHADOW',
  'LONG_LOWER_SHADOW',
  'BULLISH_ENGULFING',
  'BEARISH_ENGULFING',
  'W_BOTTOM',
  'LOTUS_FROM_WATER',
  'GUILLOTINE',
  'ROUND_BOTTOM',
  'FLAG_BREAKOUT',
  'DOUBLE_PIN_BOTTOM',
  'THREE_INCENSE'
]);

export const scanRequestSchema = z.object({
  settle: z.literal('usdt'),
  timeframe: z.enum(['1m', '5m', '10m', '15m', '30m', '1h', '2h', '3h', '4h', '8h', '12h', '1d', '2d', '3d']),
  minVolume: z.number().nonnegative().optional(),
  minTurnover: z.number().nonnegative().optional(),
  limit: z.number().int().positive().max(200).optional(),
  sortBy: z.enum(['change', 'volume', 'volatility', 'funding']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  maRules: z
    .array(
      z.object({
        id: z.string().min(1),
        period: z.number().int().positive().max(250),
        direction: directionSchema,
        slopeRange: slopeRangeSchema,
        klineRelation: klineRelationSchema
      })
    )
    .default([]),
  maPairRules: z
    .array(
      z.object({
        maA: z.number().int().positive().max(250),
        maB: z.number().int().positive().max(250),
        relation: maPairRelationSchema
      })
    )
    .default([]),
  changeRules: z
    .array(
      z
        .object({
          timeframe: z.enum(['1m', '5m', '1h', '4h', 'today']),
          operator: z.enum(['GT', 'LT', 'BETWEEN']),
          value: z.number().optional(),
          min: z.number().optional(),
          max: z.number().optional()
        })
        .superRefine((value, ctx) => {
          if (value.operator === 'BETWEEN') {
            if (typeof value.min !== 'number' || typeof value.max !== 'number') {
              ctx.addIssue({ code: 'custom', message: 'BETWEEN 需要 min 和 max' });
            }
            return;
          }

          if (typeof value.value !== 'number') {
            ctx.addIssue({ code: 'custom', message: 'GT/LT 需要 value' });
          }
        })
    )
    .default([]),
  patterns: z.array(patternTypeSchema).default([])
});

export const saveStrategySchema = z.object({
  name: z.string().min(1).max(60),
  request: scanRequestSchema
});
