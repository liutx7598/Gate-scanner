/**==========================================================================================================================
 * OTC
 * ==========================================================================================================================
 */
export interface CreateOTCQuoteResp {
    code: number;
    message: string;
    data: {
        type: string;
        pay_coin: string;
        get_coin: string;
        pay_amount: string;
        get_amount: string;
        rate: string;
        rate_reci: string;
        promotion_code: string;
        side: string;
        order_type: string;
        quote_token: string;
        validity_period?: string;
        ex_rate?: string;
        usdc_rate?: string;
        refresh_limit?: number;
        refresh_limit_msg?: string;
    };
    timestamp: number;
}
export interface CreateOTCFiatOrderResp {
    code: number;
    message: string;
    timestamp: number;
}
export interface CreateOTCStablecoinOrderResp {
    code: number;
    message: string;
}
export interface OTCBankInfo {
    id: string;
    bank_account_name: string;
    bank_name: string;
    bank_country: string;
    bank_address: string;
    bank_code: string;
    branch_code: string;
}
export interface GetOTCUserDefaultBankResp {
    code: number;
    message: string;
    data: OTCBankInfo;
    timestamp: number;
}
export interface MarkOTCOrderAsPaidResp {
    code: number;
    message: string;
    timestamp: number;
}
export interface CancelOTCOrderResp {
    code: number;
    message: string;
    timestamp: number;
}
export interface OTCFiatOrderListItem {
    time: string;
    timestamp: number;
    order_id: string;
    trade_no: string;
    type: string;
    status: string;
    db_status: string;
    fiat_currency: string;
    fiat_currency_info: {
        name: string;
        icon: string;
    };
    fiat_amount: string;
    crypto_currency: string;
    crypto_currency_info: {
        name: string;
        icon: string;
    };
    crypto_amount: string;
    rate: string;
    transfer_remark: string;
    gate_bank_account_iban: string;
    promotion_code: string;
}
export interface GetOTCFiatOrderListResp {
    code: number;
    message: string;
    data: {
        pn: number;
        ps: number;
        total_pn: number;
        count: number;
        list: OTCFiatOrderListItem[];
    };
}
export interface OTCStablecoinOrderListItem {
    id: number;
    trade_no: string;
    pay_coin: string;
    pay_amount: string;
    get_coin: string;
    get_amount: string;
    rate: string;
    rate_reci: string;
    status: string;
    create_timest: number;
    create_time: string;
}
export interface GetOTCStablecoinOrderListResp {
    code: number;
    message: string;
    data: {
        total: number;
        page_size: number;
        page_number: number;
        total_page: number;
        list: OTCStablecoinOrderListItem[];
    };
}
export interface OTCFiatOrderDetail {
    order_id: string;
    uid: string;
    type: string;
    fiat_currency: string;
    fiat_amount: string;
    crypto_currency: string;
    crypto_amount: string;
    rate: string;
    transfer_remark: string;
    status: string;
    db_status: string;
    create_time: string;
    memo: string;
    side: string;
    promotion_code: string;
    trade_no: string;
}
export interface GetOTCFiatOrderDetailResp {
    message: string;
    code: number;
    data: OTCFiatOrderDetail;
}
