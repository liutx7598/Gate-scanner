/**==========================================================================================================================
 * ALPHA
 * ==========================================================================================================================
 */
export interface GetAlphaAccountBookReq {
    from: number;
    to?: number;
    page?: number;
    limit?: number;
}
export interface CreateAlphaQuoteReq {
    currency: string;
    side: 'buy' | 'sell';
    amount: string;
    gas_mode: 'speed' | 'custom';
    slippage?: string;
}
export interface CreateAlphaOrderReq {
    currency: string;
    side: 'buy' | 'sell';
    amount: string;
    gas_mode: 'speed' | 'custom';
    slippage?: string;
    quote_id: string;
}
export interface GetAlphaOrdersReq {
    currency: string;
    side: 'buy' | 'sell';
    status: number;
    from?: number;
    to?: number;
    limit?: number;
    page?: number;
}
export interface GetAlphaOrderReq {
    order_id: string;
}
export interface GetAlphaCurrenciesReq {
    currency?: string;
    limit?: number;
    page?: number;
}
export interface GetAlphaTickersReq {
    currency?: string;
    limit?: number;
    page?: number;
}
