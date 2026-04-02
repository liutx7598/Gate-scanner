/** P2P Merchant API response types */

export interface P2PMerchantApiResp<T> {
  timestamp: number;
  method: string;
  code: number;
  message: string;
  data: T;
  version: string;
}

export interface P2PMerchantUserInfo {
  is_self?: boolean;
  user_timest?: string;
  counterparties_num?: number;
  email_verified?: string;
  verified?: string;
  has_phone?: string;
  user_name?: string;
  user_note?: string;
  complete_transactions?: string;
  paid_transactions?: string;
  accepted_transactions?: string;
  transactions_used_time?: string;
  cancelled_used_time_month?: string;
  complete_transactions_month?: string;
  complete_rate_month?: number;
  orders_buy_rate_month?: number;
  is_black?: number;
  is_follow?: number;
  have_traded?: number;
  biz_uid?: string;
  blue_vip?: number;
  work_status?: number;
  registration_days?: number;
  first_trade_days?: number;
  need_replenish?: number;
  merchant_info?: { type?: string; market?: string };
  online_status?: number;
  work_hours?: Record<string, unknown> | null;
  transactions_month?: number;
  transactions_all?: number;
  trade_versatile?: boolean;
  [key: string]: unknown;
}

export interface P2PMerchantCounterpartyUserInfo {
  user_timest?: string;
  email_verified?: string;
  verified?: string;
  has_phone?: string;
  user_name?: string;
  user_note?: string;
  complete_transactions?: string;
  paid_transactions?: string;
  accepted_transactions?: string;
  transactions_used_time?: string;
  cancelled_used_time_month?: string;
  complete_transactions_month?: string;
  complete_rate_month?: number;
  is_follow?: number;
  have_traded?: number;
  biz_uid?: string;
  registration_days?: number;
  first_trade_days?: number;
  trade_versatile?: boolean;
  [key: string]: unknown;
}

export interface P2PMerchantPaymentMethod {
  pay_type: string;
  pay_name: string;
  ids: number[];
  list: Record<string, unknown>[];
}

export interface P2PMerchantTransactionListItem {
  type_buy?: number;
  timest?: string;
  timest_expire?: string;
  type?: string;
  trade_type?: string;
  timestamp?: number;
  rate?: string;
  amount?: string;
  total?: string;
  txid?: number;
  status?: string;
  order_status?: string;
  [key: string]: unknown;
}

export interface P2PMerchantTransactionListData {
  list: P2PMerchantTransactionListItem[];
  trans_time?: { od_time?: number }[];
  count: number;
  exported_num: number;
}

export interface P2PMerchantTransactionDetails {
  is_sell?: number;
  txid?: number;
  orderid?: number;
  timest?: number;
  last_pay_time?: number;
  remain_pay_time?: number;
  currencyType?: string;
  want_type?: string;
  rate?: string;
  amount?: string;
  total?: string;
  status?: string;
  state?: string;
  its_uid?: string;
  its_nickname?: string;
  its_realname?: string;
  [key: string]: unknown;
}

export interface P2PMerchantAdsDetail {
  rate?: string;
  type?: string;
  amount?: string;
  min_amount?: string;
  max_amount?: string;
  total?: string;
  orderid?: number;
  timestamp?: number;
  currencyType?: string;
  want_type?: string;
  status?: string;
  [key: string]: unknown;
}

export interface P2PMerchantMyAdsListItem {
  type?: string;
  rate?: string;
  amount?: string;
  total?: string;
  id?: string;
  status?: string;
  currencyType?: string;
  want_type?: string;
  [key: string]: unknown;
}

export interface P2PMerchantMyAdsListData {
  lists: P2PMerchantMyAdsListItem[];
}

export interface P2PMerchantAdsListItem {
  index?: number;
  asset?: string;
  fiat_unit?: string;
  adv_no?: number;
  price?: string;
  max_single_trans_amount?: string;
  min_single_trans_amount?: string;
  nick_name?: string;
}

export interface P2PMerchantChatMessage {
  is_sell?: number;
  msg_type?: number;
  msg?: string;
  username?: string;
  uid?: string;
  timest?: number;
  type?: number;
  pic?: string;
  file_key?: string;
  file_type?: string;
  width?: string;
  height?: string;
  msg_obj?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface P2PMerchantChatsListData {
  messages: P2PMerchantChatMessage[];
  has_history?: boolean;
  txid?: number;
  SRVTM?: number;
  order_status?: string;
  memo?: string;
}
