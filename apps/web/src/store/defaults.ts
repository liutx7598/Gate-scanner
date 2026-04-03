import {
  DEFAULT_MA_RULES,
  PATTERN_LABELS,
  TIMEFRAME_OPTIONS,
  type BiasRule,
  type BollRule,
  type ChangeRule,
  type KdjRule,
  type MaConvergenceRule,
  type MaPairRule,
  type MaRule,
  type MacdRule,
  type PatternType,
  type RsiRule,
  type ScanRequest,
  type VolumeRatioRule
} from '@gate-screener/shared-types';

export const SORT_OPTIONS = [
  { value: 'change:desc', label: '涨幅' },
  { value: 'change:asc', label: '跌幅' },
  { value: 'volume:desc', label: '成交量' },
  { value: 'volatility:desc', label: '波动率' },
  { value: 'funding:desc', label: '资金费率' }
] as const;

export const MARKET_OPTIONS = [
  { value: 'usdt', label: 'USDT 永续', enabled: true },
  { value: 'btc', label: 'BTC 永续（预留）', enabled: false }
] as const;

export const PATTERN_OPTIONS = Object.entries(PATTERN_LABELS).map(([value, label]) => ({
  value: value as PatternType,
  label
}));

export const createMaRule = (period = 30): MaRule => ({
  id: crypto.randomUUID(),
  period,
  direction: 'ANY',
  slopeRange: 'ANY',
  klineRelation: 'ANY'
});

export const createMaPairRule = (): MaPairRule => ({
  maA: 5,
  maB: 10,
  relation: 'ANY'
});

export const createMaConvergenceRule = (): MaConvergenceRule => ({
  enabled: false,
  periods: [5, 10, 20],
  thresholdPct: 0.8
});

export const createRsiRule = (): RsiRule => ({
  enabled: false,
  period: 14,
  min: 45,
  max: 65
});

export const createMacdRule = (): MacdRule => ({
  enabled: false,
  line: 'HISTOGRAM',
  cross: 'ANY',
  min: undefined,
  max: undefined
});

export const createKdjRule = (): KdjRule => ({
  enabled: false,
  line: 'K',
  cross: 'ANY',
  min: undefined,
  max: undefined
});

export const createBollRule = (): BollRule => ({
  enabled: false,
  position: 'ANY',
  min: undefined,
  max: undefined
});

export const createBiasRule = (): BiasRule => ({
  enabled: false,
  period: 5,
  min: undefined,
  max: undefined
});

export const createVolumeRatioRule = (): VolumeRatioRule => ({
  enabled: false,
  baseline: 'MA5',
  min: 1.5,
  max: undefined
});

export const createChangeRule = (): ChangeRule => ({
  timeframe: '1h',
  operator: 'GT',
  value: 0
});

export const createDefaultRequest = (): ScanRequest => ({
  settle: 'usdt',
  timeframe: '15m',
  minVolume: undefined,
  minTurnover: undefined,
  limit: 50,
  sortBy: 'volume',
  sortDirection: 'desc',
  maRules: DEFAULT_MA_RULES.map((rule) => ({ ...rule })),
  maPairRules: [createMaPairRule()],
  maConvergence: createMaConvergenceRule(),
  entityCrossAboveMa5: false,
  macdSignal: 'ANY',
  rsiRule: createRsiRule(),
  macdRule: createMacdRule(),
  kdjRule: createKdjRule(),
  bollRule: createBollRule(),
  biasRule: createBiasRule(),
  volumeRatioRule: createVolumeRatioRule(),
  changeRules: [],
  patterns: []
});

type LegacyRequest = Partial<ScanRequest> & {
  macdSignal?: ScanRequest['macdSignal'];
};

export const normalizeRequest = (request: LegacyRequest): ScanRequest => {
  const defaults = createDefaultRequest();
  const normalizedMacdRule =
    request.macdRule ??
    (request.macdSignal && request.macdSignal !== 'ANY'
      ? {
          ...defaults.macdRule,
          enabled: true,
          cross: request.macdSignal
        }
      : defaults.macdRule);

  return {
    ...defaults,
    ...request,
    maRules: Array.isArray(request.maRules) ? request.maRules.map((rule) => ({ ...rule })) : defaults.maRules,
    maPairRules: Array.isArray(request.maPairRules)
      ? request.maPairRules.map((rule) => ({ ...rule }))
      : defaults.maPairRules,
    maConvergence: request.maConvergence
      ? {
          ...defaults.maConvergence,
          ...request.maConvergence,
          periods: Array.isArray(request.maConvergence.periods)
            ? [...request.maConvergence.periods]
            : defaults.maConvergence.periods
        }
      : defaults.maConvergence,
    entityCrossAboveMa5: request.entityCrossAboveMa5 ?? defaults.entityCrossAboveMa5,
    macdSignal: request.macdSignal ?? defaults.macdSignal,
    rsiRule: request.rsiRule ? { ...defaults.rsiRule, ...request.rsiRule } : defaults.rsiRule,
    macdRule: { ...defaults.macdRule, ...normalizedMacdRule },
    kdjRule: request.kdjRule ? { ...defaults.kdjRule, ...request.kdjRule } : defaults.kdjRule,
    bollRule: request.bollRule ? { ...defaults.bollRule, ...request.bollRule } : defaults.bollRule,
    biasRule: request.biasRule ? { ...defaults.biasRule, ...request.biasRule } : defaults.biasRule,
    volumeRatioRule: request.volumeRatioRule
      ? { ...defaults.volumeRatioRule, ...request.volumeRatioRule }
      : defaults.volumeRatioRule,
    changeRules: Array.isArray(request.changeRules)
      ? request.changeRules.map((rule) => ({ ...rule }))
      : defaults.changeRules,
    patterns: Array.isArray(request.patterns) ? [...request.patterns] : defaults.patterns
  };
};

export const applyCommonTrendPreset = (request: ScanRequest): ScanRequest => ({
  ...request,
  maRules: [5, 20].map((period) => {
    const existingRule = request.maRules.find((rule) => rule.period === period);

    return {
      id: existingRule?.id ?? crypto.randomUUID(),
      period,
      direction: 'UP',
      slopeRange: '0_45',
      klineRelation: 'ANY'
    };
  }),
  maPairRules: [],
  maConvergence: {
    ...request.maConvergence,
    enabled: false
  },
  entityCrossAboveMa5: false,
  macdSignal: 'ANY',
  macdRule: {
    ...request.macdRule,
    enabled: true,
    cross: 'GOLDEN_CROSS',
    line: 'HISTOGRAM',
    min: undefined,
    max: undefined
  }
});

export const parseSortPreset = (value: string): Pick<ScanRequest, 'sortBy' | 'sortDirection'> => {
  const [sortBy, sortDirection] = value.split(':');
  return {
    sortBy: (sortBy as ScanRequest['sortBy']) ?? 'volume',
    sortDirection: (sortDirection as ScanRequest['sortDirection']) ?? 'desc'
  };
};

export const buildSortPreset = (request: ScanRequest): string =>
  `${request.sortBy ?? 'volume'}:${request.sortDirection ?? 'desc'}`;

export const TIMEFRAME_LABELS = TIMEFRAME_OPTIONS;
