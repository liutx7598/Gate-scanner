import type { Candle, ChartAnnotation, ContractMeta, PatternType, ScanRequest } from '@gate-screener/shared-types';

export interface NormalizedTicker {
  contract: string;
  latestPrice: number;
  changePct: number;
  volume: number;
  turnover: number;
  fundingRate: number;
  high24h: number;
  low24h: number;
}

export interface MarketDataService {
  getContracts(settle: ScanRequest['settle']): Promise<ContractMeta[]>;
  getTickers(settle: ScanRequest['settle']): Promise<NormalizedTicker[]>;
  getCandles(params: {
    settle: ScanRequest['settle'];
    contract: string;
    timeframe: ScanRequest['timeframe'];
    limit: number;
  }): Promise<Candle[]>;
}

export interface PatternMatchResult {
  matched: PatternType[];
  hits: string[];
  annotations: ChartAnnotation[];
}
