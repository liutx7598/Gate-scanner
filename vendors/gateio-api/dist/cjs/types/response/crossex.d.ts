/**==========================================================================================================================
 * CROSSEX
 * ==========================================================================================================================
 */
export interface CrossExSymbol {
    symbol: string;
    exchange_type: string;
    business_type: string;
    state: string;
    min_size: string;
    min_notional: string;
    lot_size: string;
    tick_size: string;
    max_num_orders: string;
    max_market_size: string;
    max_limit_size: string;
    contract_size: string;
    liquidation_fee: string;
    delist_time: string;
}
export interface CrossExRiskLimitTier {
    min_risk_limit_value: string;
    max_risk_limit_value: string;
    leverage_max: string;
    maintenance_rate: string;
    tier: string;
}
export interface CrossExRiskLimit {
    symbol: string;
    tiers: CrossExRiskLimitTier[];
}
export interface CrossExTransferCoin {
    coin: string;
    min_trans_amount: number;
    est_fee: number;
    precision: number;
    is_disabled: number;
}
export interface CreateCrossExTransferResp {
    tx_id: string;
    text: string;
}
export interface CrossExTransferHistory {
    id: string;
    text: string;
    from_account_type: string;
    to_account_type: string;
    coin: string;
    amount: string;
    actual_receive: string;
    status: string;
    fail_reason: string;
    create_time: number;
    update_time: number;
}
export interface CreateCrossExOrderResp {
    order_id: number | string;
    text: string;
}
export interface CancelCrossExOrderResp {
    order_id: number;
    text: string;
}
export interface ModifyCrossExOrderResp {
    order_id: number;
    text: string;
}
export interface CrossExOrder {
    user_id: string;
    order_id: string;
    text: string;
    state: string;
    symbol: string;
    side: string;
    type: string;
    attribute: string;
    exchange_type: string;
    business_type: string;
    qty: string;
    quote_qty: string;
    price: string;
    time_in_force: string;
    executed_qty: string;
    executed_amount: string;
    executed_avg_price: string;
    fee_coin: string;
    fee: string;
    reduce_only: string;
    leverage: string;
    reason: string;
    last_executed_qty: string;
    last_executed_price: string;
    last_executed_amount: string;
    position_side: string;
    create_time: string;
    update_time: string;
}
export interface CreateCrossExConvertQuoteResp {
    quote_id: string;
    valid_ms: string;
    from_coin: string;
    to_coin: string;
    from_amount: string;
    to_amount: string;
    price: string;
}
export interface UpdateCrossExAccountResp {
    position_mode: string;
    account_mode: string;
    exchange_type: string;
}
export interface CrossExAccountAsset {
    user_id: string;
    coin: string;
    exchange_type: string;
    balance: string;
    upnl: string;
    equity: string;
    futures_initial_margin: string;
    futures_maintenance_margin: string;
    borrowing_initial_margin: string;
    borrowing_maintenance_margin: string;
    available_balance: string;
    liability: string;
}
export interface CrossExAccount {
    user_id: string;
    available_margin: string;
    margin_balance: string;
    initial_margin: string;
    maintenance_margin: string;
    initial_margin_rate: string;
    maintenance_margin_rate: string;
    position_mode: string;
    account_limit: string;
    create_time: string;
    update_time: string;
    account_mode: string;
    exchange_type: string;
    assets: CrossExAccountAsset[];
}
export interface SetCrossExPositionLeverageResp {
    symbol: string;
    leverage: string;
}
export interface CrossExPositionLeverage {
    symbol: string;
    leverage: number | string;
}
export interface SetCrossExMarginPositionLeverageResp {
    symbol: string;
    leverage: string;
}
export interface CrossExMarginPositionLeverage {
    symbol: string;
    leverage: number | string;
}
export interface CloseCrossExPositionResp {
    order_id: string;
    text: string;
}
export interface CrossExInterestRate {
    coin: string;
    exchange_type: string;
    hour_interest_rate: string;
    time: string;
}
export interface CrossExSpecialFee {
    symbol: string;
    taker_fee_rate: string;
    maker_fee_rate: string;
}
export interface CrossExFeeRate {
    spot_maker_fee: string;
    spot_taker_fee: string;
    future_maker_fee: string;
    future_taker_fee: string;
    special_fee_list: CrossExSpecialFee[];
}
export interface CrossExPosition {
    user_id: string;
    position_id: string;
    symbol: string;
    position_side: string;
    initial_margin: string;
    maintenance_margin: string;
    position_qty: string;
    position_value: string;
    upnl: string;
    upnl_rate: string;
    entry_price: string;
    mark_price: string;
    leverage: string;
    max_leverage: string;
    risk_limit: string;
    fee: string;
    funding_fee: string;
    funding_time: string;
    create_time: string;
    update_time: string;
    closed_pnl: string;
}
export interface CrossExMarginPosition {
    user_id: string;
    position_id: string;
    symbol: string;
    position_side: string;
    initial_margin: string;
    maintenance_margin: string;
    asset_qty: string;
    asset_coin: string;
    position_value: string;
    liability: string;
    liability_coin: string;
    interest: string;
    max_position_qty: string;
    entry_price: string;
    index_price: string;
    upnl: string;
    upnl_rate: string;
    leverage: string;
    max_leverage: string;
    create_time: string;
    update_time: string;
}
export interface CrossExAdlRank {
    user_id: string;
    symbol: string;
    crossex_adl_rank: string;
    exchange_adl_rank: string;
}
export interface CrossExHistoryPosition {
    position_id: string;
    user_id: string;
    symbol: string;
    closed_type: string;
    closed_pnl: string;
    closed_pnl_rate: string;
    open_avg_price: string;
    closed_avg_price: string;
    max_position_qty: string;
    closed_qty: string;
    closed_value: string;
    fee: string;
    liq_fee: string;
    funding_fee: string;
    position_side: string;
    position_mode: string;
    leverage: string;
    business_type: string;
    create_time: string;
    update_time: string;
}
export interface CrossExHistoryMarginPosition {
    position_id: string;
    user_id: string;
    symbol: string;
    closed_type: string;
    closed_pnl: string;
    closed_pnl_rate: string;
    open_avg_price: string;
    closed_avg_price: string;
    max_position_qty: string;
    closed_qty: string;
    closed_value: string;
    liq_fee: string;
    position_side: string;
    leverage: string;
    interest: string;
    business_type: string;
    create_time: string;
    update_time: string;
}
export interface CrossExHistoryMarginInterest {
    userId: string;
    symbol: string;
    interest_id: string;
    liability_id: string;
    liability: string;
    liability_coin: string;
    interest: string;
    interest_rate: string;
    interest_type: string;
    create_time: string;
    exchange_type: string;
}
export interface CrossExHistoryTrade {
    user_id: string;
    transaction_id: string;
    order_id: string;
    text: string;
    symbol: string;
    exchange_type: string;
    business_type: string;
    side: string;
    qty: string;
    price: string;
    fee: string;
    fee_coin: string;
    fee_rate: string;
    match_role: string;
    rpnl: string;
    position_mode: string;
    position_side: string;
    create_time: string;
}
export interface CrossExAccountBook {
    id: string;
    user_id: string;
    business_id: string;
    type: string;
    exchange_type: string;
    coin: string;
    change: string;
    balance: string;
    create_time: string;
}
export interface CrossExCoinDiscountRate {
    coin: string;
    exchange_type: string;
    tier: string;
    min_value: string;
    max_value: string;
    discount_rate: string;
}
