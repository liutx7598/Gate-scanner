export type SlopeRange = 'ANY' | '0_45' | '45_90';
export type Direction = 'ANY' | 'UP' | 'DOWN';
export type KLineRelation = 'ANY' | 'CROSS_UP' | 'CROSS_DOWN' | 'ABOVE_MA' | 'BELOW_MA';
export type MaPairRelation = 'ANY' | 'CROSS_UP' | 'CROSS_DOWN' | 'OPPOSITE' | 'CONVERGE';
export type PatternType =
  | 'LONG_UPPER_SHADOW'
  | 'LONG_LOWER_SHADOW'
  | 'BULLISH_ENGULFING'
  | 'BEARISH_ENGULFING'
  | 'W_BOTTOM'
  | 'LOTUS_FROM_WATER'
  | 'GUILLOTINE'
  | 'ROUND_BOTTOM'
  | 'FLAG_BREAKOUT'
  | 'DOUBLE_PIN_BOTTOM'
  | 'THREE_INCENSE';

export type ScanTimeframe =
  | '1m'
  | '5m'
  | '10m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '3h'
  | '4h'
  | '8h'
  | '12h'
  | '1d'
  | '2d'
  | '3d';

export interface MaRule {
  id: string;
  period: number;
  direction: Direction;
  slopeRange: SlopeRange;
  klineRelation: KLineRelation;
}

export interface MaPairRule {
  maA: number;
  maB: number;
  relation: MaPairRelation;
}

export interface ChangeRule {
  timeframe: '1m' | '5m' | '1h' | '4h' | 'today';
  operator: 'GT' | 'LT' | 'BETWEEN';
  value?: number;
  min?: number;
  max?: number;
}

export interface ScanRequest {
  settle: 'usdt';
  timeframe: ScanTimeframe;
  minVolume?: number;
  minTurnover?: number;
  limit?: number;
  sortBy?: 'change' | 'volume' | 'volatility' | 'funding';
  sortDirection?: 'asc' | 'desc';
  maRules: MaRule[];
  maPairRules: MaPairRule[];
  changeRules: ChangeRule[];
  patterns: PatternType[];
}

export interface ContractMeta {
  name: string;
  settle: 'usdt' | 'btc';
  quantoMultiplier?: number;
  markType?: string;
  type?: string;
}

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  turnover?: number;
}

export interface ChartAnnotation {
  type: 'PATTERN' | 'MA_CROSS';
  label: string;
  timestamp: number;
  price: number;
}

export interface ScanResult {
  contract: string;
  latestPrice: number;
  changePct: number;
  volume: number;
  turnover: number;
  fundingRate?: number;
  volatility: number;
  hits: string[];
  hitPatterns: PatternType[];
  candles: Candle[];
  maSeries: Record<string, number[]>;
  annotations: ChartAnnotation[];
}

export interface ScanResponse {
  requestId: string;
  durationMs: number;
  totalContracts: number;
  candidates: number;
  matched: number;
  results: ScanResult[];
}

export interface StrategyRecord {
  id: string;
  name: string;
  request: ScanRequest;
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const DEFAULT_MA_RULES: MaRule[] = [
  { id: 'ma-5', period: 5, direction: 'ANY', slopeRange: 'ANY', klineRelation: 'ANY' },
  { id: 'ma-10', period: 10, direction: 'ANY', slopeRange: 'ANY', klineRelation: 'ANY' },
  { id: 'ma-20', period: 20, direction: 'ANY', slopeRange: 'ANY', klineRelation: 'ANY' }
];

export const PATTERN_LABELS: Record<PatternType, string> = {
  LONG_UPPER_SHADOW: '长上影线',
  LONG_LOWER_SHADOW: '长下影线',
  BULLISH_ENGULFING: '阳线反包',
  BEARISH_ENGULFING: '阴线反包',
  W_BOTTOM: 'W底',
  LOTUS_FROM_WATER: '出水芙蓉',
  GUILLOTINE: '断头铡',
  ROUND_BOTTOM: '圆弧底',
  FLAG_BREAKOUT: '旗形突破',
  DOUBLE_PIN_BOTTOM: '双针探底',
  THREE_INCENSE: '三炷香'
};

export const TIMEFRAME_OPTIONS: ScanTimeframe[] = [
  '1m',
  '5m',
  '10m',
  '15m',
  '30m',
  '1h',
  '2h',
  '3h',
  '4h',
  '8h',
  '12h',
  '1d',
  '2d',
  '3d'
];
