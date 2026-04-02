/**==========================================================================================================================
 * OTC
 * ==========================================================================================================================
 */
export interface CreateOTCQuoteReq {
    side: 'PAY' | 'GET';
    pay_coin: string;
    get_coin: string;
    pay_amount?: string;
    get_amount?: string;
    create_quote_token?: string;
    promotion_code?: string;
}
export interface CreateOTCFiatOrderReq {
    type: 'BUY' | 'SELL';
    side: string;
    crypto_currency: string;
    fiat_currency: string;
    crypto_amount: string;
    fiat_amount: string;
    promotion_code?: string;
    quote_token: string;
    bank_id: string;
}
export interface CreateOTCStablecoinOrderReq {
    pay_coin?: string;
    get_coin?: string;
    pay_amount?: string;
    get_amount?: string;
    side?: string;
    promotion_code?: string;
    quote_token?: string;
}
export interface MarkOTCOrderAsPaidReq {
    order_id: string;
}
export interface CancelOTCOrderReq {
    order_id: string;
}
export interface GetOTCFiatOrderListReq {
    type?: 'BUY' | 'SELL';
    fiat_currency?: string;
    crypto_currency?: string;
    start_time?: string;
    end_time?: string;
    status?: string;
    pn?: string;
    ps?: string;
}
export interface GetOTCStablecoinOrderListReq {
    page_size?: string;
    page_number?: string;
    coin_name?: string;
    start_time?: string;
    end_time?: string;
    status?: string;
}
export interface GetOTCFiatOrderDetailReq {
    order_id: string;
}
