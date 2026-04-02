/**==========================================================================================================================
 * ALPHA
 * ==========================================================================================================================
 */
export interface AlphaAccount {
    currency: string;
    available: string;
    locked: string;
    token_address: string;
    chain: string;
}
export interface AlphaAccountBook {
    id: number;
    time: number;
    currency: string;
    change: string;
    balance: string;
}
export interface CreateAlphaQuoteResp {
    quote_id: string;
    min_amount: string;
    max_amount: string;
    price: string;
    slippage: string;
    estimate_gas_fee_amount_usdt: string;
    order_fee: string;
    target_token_min_amount: string;
    target_token_max_amount: string;
    error_type: number;
}
export interface CreateAlphaOrderResp {
    order_id: string;
    status: number;
    side: string;
    gas_mode: string;
    create_time: number;
    amount: string;
    token_address: string;
    chain: string;
}
export interface AlphaOrder {
    order_id: string;
    tx_hash: string;
    side: string;
    usdt_amount: string;
    currency: string;
    currency_amount: string;
    status: number;
    gas_mode: string;
    chain: string;
    gas_fee: string;
    transaction_fee: string;
    failed_reason: string;
    create_time: number;
}
export interface AlphaCurrency {
    currency: string;
    name: string;
    chain: string;
    address: string;
    amount_precision: number;
    precision: number;
    status: number;
}
export interface AlphaTicker {
    currency: string;
    last: string;
    change: string;
    volume: string;
    market_cap: string;
}
