import { z } from 'zod';

const slopeRangeSchema = z.enum(['ANY', '0_45', '45_90']);
const directionSchema = z.enum(['ANY', 'UP', 'DOWN']);
const klineRelationSchema = z.enum(['ANY', 'CROSS_UP', 'CROSS_DOWN', 'ABOVE_MA', 'BELOW_MA']);
const maPairRelationSchema = z.enum(['ANY', 'CROSS_UP', 'CROSS_DOWN', 'OPPOSITE', 'CONVERGE']);
const indicatorCrossSchema = z.enum(['ANY', 'GOLDEN_CROSS', 'DEAD_CROSS']);
const macdLineSchema = z.enum(['DIF', 'DEA', 'HISTOGRAM']);
const kdjLineSchema = z.enum(['K', 'D', 'J']);
const bollPositionSchema = z.enum(['ANY', 'ABOVE_MID', 'BELOW_MID', 'BREAK_UPPER', 'BREAK_LOWER']);
const volumeRatioBaselineSchema = z.enum(['MA5', 'MA20']);
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

const numericRangeSchema = z.object({
  enabled: z.boolean().default(false),
  min: z.number().optional(),
  max: z.number().optional()
});

const changeRuleSchema = z
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
        ctx.addIssue({ code: 'custom', message: 'BETWEEN 需要同时提供 min 和 max' });
      }
      return;
    }

    if (typeof value.value !== 'number') {
      ctx.addIssue({ code: 'custom', message: 'GT / LT 需要提供 value' });
    }
  });

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
  maConvergence: z
    .object({
      enabled: z.boolean().default(false),
      periods: z.array(z.number().int().positive().max(250)).default([5, 10, 20]),
      thresholdPct: z.number().positive().max(20).default(0.8)
    })
    .default({
      enabled: false,
      periods: [5, 10, 20],
      thresholdPct: 0.8
    }),
  entityCrossAboveMa5: z.boolean().default(false),
  macdSignal: indicatorCrossSchema.default('ANY'),
  rsiRule: z
    .object({
      ...numericRangeSchema.shape,
      period: z.union([z.literal(6), z.literal(14), z.literal(24)]).default(14)
    })
    .default({
      enabled: false,
      period: 14
    }),
  macdRule: z
    .object({
      ...numericRangeSchema.shape,
      line: macdLineSchema.default('HISTOGRAM'),
      cross: indicatorCrossSchema.default('ANY')
    })
    .default({
      enabled: false,
      line: 'HISTOGRAM',
      cross: 'ANY'
    }),
  kdjRule: z
    .object({
      ...numericRangeSchema.shape,
      line: kdjLineSchema.default('K'),
      cross: indicatorCrossSchema.default('ANY')
    })
    .default({
      enabled: false,
      line: 'K',
      cross: 'ANY'
    }),
  bollRule: z
    .object({
      ...numericRangeSchema.shape,
      position: bollPositionSchema.default('ANY')
    })
    .default({
      enabled: false,
      position: 'ANY'
    }),
  biasRule: z
    .object({
      ...numericRangeSchema.shape,
      period: z.union([z.literal(5), z.literal(10), z.literal(20)]).default(5)
    })
    .default({
      enabled: false,
      period: 5
    }),
  volumeRatioRule: z
    .object({
      ...numericRangeSchema.shape,
      baseline: volumeRatioBaselineSchema.default('MA5')
    })
    .default({
      enabled: false,
      baseline: 'MA5'
    }),
  changeRules: z.array(changeRuleSchema).default([]),
  patterns: z.array(patternTypeSchema).default([])
});

export const saveStrategySchema = z.object({
  name: z.string().min(1).max(60),
  request: scanRequestSchema
});
