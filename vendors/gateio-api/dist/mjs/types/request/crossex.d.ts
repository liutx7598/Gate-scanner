/**==========================================================================================================================
 * CROSSEX
 * ==========================================================================================================================
 */
export interface GetCrossExSymbolsReq {
    symbols?: string;
}
export interface GetCrossExRiskLimitsReq {
    symbols: string;
}
export interface GetCrossExTransferCoinsReq {
    coin?: string;
}
export interface CreateCrossExTransferReq {
    coin: string;
    amount: string;
    from: string;
    to: string;
    text?: string;
}
export interface GetCrossExTransferHistoryReq {
    coin?: string;
    order_id?: string;
    from?: number;
    to?: number;
    page?: number;
    limit?: number;
}
export interface CreateCrossExOrderReq {
    text?: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    type?: 'LIMIT' | 'MARKET';
    time_in_force?: 'GTC' | 'IOC' | 'FOK' | 'POC';
    qty?: string;
    price?: string;
    quote_qty?: string;
    reduce_only?: 'true' | 'false';
    position_side?: 'LONG' | 'SHORT' | 'NONE';
}
export interface ModifyCrossExOrderReq {
    qty?: string;
    price?: string;
}
export interface CreateCrossExConvertQuoteReq {
    exchange_type: string;
    from_coin: string;
    to_coin: string;
    from_amount: string;
}
export interface CreateCrossExConvertOrderReq {
    quote_id: string;
}
export interface UpdateCrossExAccountReq {
    position_mode?: string;
    account_mode?: string;
    exchange_type?: string;
}
export interface GetCrossExAccountsReq {
    exchange_type?: string;
}
export interface SetCrossExPositionLeverageReq {
    symbol: string;
    leverage: string;
}
export interface GetCrossExPositionLeverageReq {
    symbols?: string;
}
export interface SetCrossExMarginPositionLeverageReq {
    symbol: string;
    leverage: string;
}
export interface GetCrossExMarginPositionLeverageReq {
    symbols?: string;
}
export interface CloseCrossExPositionReq {
    symbol: string;
    position_side?: string;
}
export interface GetCrossExInterestRateReq {
    coin?: string;
    exchange_type?: string;
}
export interface GetCrossExPositionsReq {
    symbol?: string;
    exchange_type?: string;
}
export interface GetCrossExMarginPositionsReq {
    symbol?: string;
    exchange_type?: string;
}
export interface GetCrossExAdlRankReq {
    symbol: string;
}
export interface GetCrossExOpenOrdersReq {
    symbol?: string;
    exchange_type?: string;
    business_type?: string;
}
export interface GetCrossExHistoryOrdersReq {
    page?: number;
    limit?: number;
    symbol?: string;
    from?: number;
    to?: number;
}
export interface GetCrossExHistoryPositionsReq {
    page?: number;
    limit?: number;
    symbol?: string;
    from?: number;
    to?: number;
}
export interface GetCrossExHistoryMarginPositionsReq {
    page?: number;
    limit?: number;
    symbol?: string;
    from?: number;
    to?: number;
}
export interface GetCrossExHistoryMarginInterestsReq {
    symbol?: string;
    from?: number;
    to?: number;
    page?: number;
    limit?: number;
    exchange_type?: string;
}
export interface GetCrossExHistoryTradesReq {
    page?: number;
    limit?: number;
    symbol?: string;
    from?: number;
    to?: number;
}
export interface GetCrossExAccountBookReq {
    page?: number;
    limit?: number;
    coin?: string;
    from?: number;
    to?: number;
}
export interface GetCrossExCoinDiscountRateReq {
    coin?: string;
    exchange_type?: string;
}
