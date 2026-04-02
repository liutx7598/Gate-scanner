import type { PatternType, ScanTimeframe } from '@gate-screener/shared-types';

export const CACHE_TTL_MS = 15_000;
export const RETRY_COUNT = 3;
export const RETRY_DELAY_MS = 350;
export const SLOPE_45_THRESHOLD = 0.01;
export const CONVERGE_THRESHOLD = 0.005;
export const DEFAULT_CANDLE_LIMIT = 60;
export const EXTENDED_CANDLE_LIMIT = 120;
export const MAX_CANDIDATE_UNIVERSE = 80;
export const MAX_RESULTS = 200;
export const DEFAULT_RESULT_LIMIT = 50;
export const DEFAULT_CONCURRENCY = 10;
export const DEFAULT_STRATEGY_FILE = 'data/strategies.json';

export const EXTENDED_PATTERN_SET = new Set<PatternType>(['W_BOTTOM', 'ROUND_BOTTOM', 'FLAG_BREAKOUT']);

export const TIMEFRAME_SECONDS: Record<ScanTimeframe, number> = {
  '1m': 60,
  '5m': 300,
  '10m': 600,
  '15m': 900,
  '30m': 1800,
  '1h': 3600,
  '2h': 7200,
  '3h': 10800,
  '4h': 14400,
  '8h': 28800,
  '12h': 43200,
  '1d': 86400,
  '2d': 172800,
  '3d': 259200
};

export const CHANGE_RULE_SECONDS = {
  '1m': 60,
  '5m': 300,
  '1h': 3600,
  '4h': 14400
} as const;
