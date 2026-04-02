import {
  DEFAULT_MA_RULES,
  PATTERN_LABELS,
  TIMEFRAME_OPTIONS,
  type ChangeRule,
  type MaPairRule,
  type MaRule,
  type PatternType,
  type ScanRequest
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
  changeRules: [],
  patterns: []
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
