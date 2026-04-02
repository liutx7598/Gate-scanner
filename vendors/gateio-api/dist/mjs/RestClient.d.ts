import { AxiosRequestConfig } from 'axios';
import { BaseRestClient, RestClientType } from './lib/BaseRestClient.js';
import { RestClientOptions } from './lib/requestUtils.js';
import { CreateStpGroupReq } from './types/request/account.js';
import { CreateAlphaOrderReq, CreateAlphaQuoteReq, GetAlphaAccountBookReq, GetAlphaCurrenciesReq, GetAlphaOrderReq, GetAlphaOrdersReq, GetAlphaTickersReq } from './types/request/alpha.js';
import { CloseCrossExPositionReq, CreateCrossExConvertOrderReq, CreateCrossExConvertQuoteReq, CreateCrossExOrderReq, CreateCrossExTransferReq, GetCrossExAccountBookReq, GetCrossExAccountsReq, GetCrossExAdlRankReq, GetCrossExCoinDiscountRateReq, GetCrossExHistoryMarginInterestsReq, GetCrossExHistoryMarginPositionsReq, GetCrossExHistoryOrdersReq, GetCrossExHistoryPositionsReq, GetCrossExHistoryTradesReq, GetCrossExInterestRateReq, GetCrossExMarginPositionLeverageReq, GetCrossExMarginPositionsReq, GetCrossExOpenOrdersReq, GetCrossExPositionLeverageReq, GetCrossExPositionsReq, GetCrossExRiskLimitsReq, GetCrossExSymbolsReq, GetCrossExTransferCoinsReq, GetCrossExTransferHistoryReq, ModifyCrossExOrderReq, SetCrossExMarginPositionLeverageReq, SetCrossExPositionLeverageReq, UpdateCrossExAccountReq } from './types/request/crossex.js';
import { GetDeliveryAutoOrdersReq, GetDeliveryBookReq, GetDeliveryCandlesReq, GetDeliveryClosedPositionsReq, GetDeliveryLiquidationHistoryReq, GetDeliveryOrderBookReq, GetDeliveryOrdersReq, GetDeliverySettlementHistoryReq, GetDeliveryTradesReq, GetDeliveryTradingHistoryReq, SubmitDeliveryFuturesOrderReq } from './types/request/delivery.js';
import { GetStructuredProductListReq, GetStructuredProductOrdersReq, PlaceDualInvestmentOrderParams } from './types/request/earn.js';
import { GetLendingInterestRecordsReq, GetLendingOrdersReq, GetLendingRecordsReq, SubmitLendOrRedeemReq } from './types/request/earnuni.js';
import { GetFlashSwapOrdersReq, SubmitFlashSwapOrderPreviewReq, SubmitFlashSwapOrderReq } from './types/request/flashswap.js';
import { BatchAmendOrderReq, BatchFundingRatesReq, BatchTerminateTrailOrdersReq, CreateTrailOrderReq, DeleteAllFuturesOrdersReq, GetFundingRatesReq, GetFuturesAccountBookReq, GetFuturesAutoOrdersReq, GetFuturesCandlesReq, GetFuturesInsuranceReq, GetFuturesLiquidationHistoryReq, GetFuturesOrderBookReq, GetFuturesOrdersByTimeRangeReq, GetFuturesOrdersReq, GetFuturesPositionCloseHistoryReq, GetFuturesPositionHistoryReq, GetFuturesPositionsReq, GetFuturesStatsReq, GetFuturesTradesReq, GetFuturesTradingHistoryByTimeRangeReq, GetFuturesTradingHistoryReq, GetLiquidationHistoryReq, GetRiskLimitTableReq, GetRiskLimitTiersReq, GetTrailOrderChangeLogReq, GetTrailOrderDetailReq, GetTrailOrderListReq, SubmitFuturesOrderReq, SubmitFuturesTriggeredOrderReq, TerminateTrailOrderReq, UpdateDualModePositionLeverageReq, UpdateDualModePositionMarginReq, UpdateFuturesOrderReq, UpdateFuturesPriceTriggeredOrderReq, UpdateTrailOrderReq } from './types/request/futures.js';
import { GetCrossMarginAccountHistoryReq, GetCrossMarginBorrowHistoryReq, GetCrossMarginInterestRecordsReq, GetCrossMarginRepaymentsReq, GetMarginBalanceHistoryReq, SubmitCrossMarginBorrowLoanReq } from './types/request/margin.js';
import { GetMarginUNIInterestRecordsReq, GetMarginUNILoanRecordsReq, GetMarginUNILoansReq, GetMarginUNIMaxBorrowReq } from './types/request/marginuni.js';
import { GetMultiLoanAdjustmentRecordsReq, GetMultiLoanOrdersReq, GetMultiLoanRepayRecordsReq, RepayMultiLoanReq, SubmitMultiLoanOrderReq, UpdateMultiLoanReq } from './types/request/multicollateralLoan.js';
import { GetOptionsAccountChangeReq, GetOptionsCandlesReq, GetOptionsMySettlementsReq, GetOptionsOrderBookReq, GetOptionsOrdersReq, GetOptionsPersonalHistoryReq, GetOptionsSettlementHistoryReq, GetOptionsTradesReq, GetOptionsUnderlyingCandlesReq, OptionsMMPSettingsReq, SubmitOptionsOrderReq } from './types/request/options.js';
import { CancelOTCOrderReq, CreateOTCFiatOrderReq, CreateOTCQuoteReq, CreateOTCStablecoinOrderReq, GetOTCFiatOrderDetailReq, GetOTCFiatOrderListReq, GetOTCStablecoinOrderListReq, MarkOTCOrderAsPaidReq } from './types/request/otc.js';
import { P2PMerchantAdsDetailReq, P2PMerchantAdsUpdateStatusReq, P2PMerchantCancelTransactionReq, P2PMerchantConfirmPaymentReq, P2PMerchantConfirmReceiptReq, P2PMerchantGetAdsListReq, P2PMerchantGetChatsListReq, P2PMerchantGetCompletedTransactionListReq, P2PMerchantGetCounterpartyUserInfoReq, P2PMerchantGetMyselfPaymentReq, P2PMerchantGetPendingTransactionListReq, P2PMerchantGetTransactionDetailsReq, P2PMerchantMyAdsListReq, P2PMerchantPlaceBizPushOrderReq, P2PMerchantSendChatMessageReq, P2PMerchantUploadChatFileReq } from './types/request/p2pMerchant.js';
import { GetAgencyCommissionHistoryReq, GetAgencyTransactionHistoryReq, GetBrokerCommissionHistoryReq, GetBrokerTransactionHistoryReq, GetPartnerSubordinateListReq, PartnerTransactionReq } from './types/request/rebate.js';
import { CancelSpotBatchOrdersReq, DeleteSpotOrderReq, GetSpotAccountBookReq, GetSpotAutoOrdersReq, GetSpotCandlesReq, GetSpotInsuranceHistoryReq, GetSpotOrderBookReq, GetSpotOrderReq, GetSpotOrdersReq, GetSpotTradesReq, GetSpotTradingHistoryReq, SubmitSpotClosePosCrossDisabledReq, SubmitSpotOrderReq, UpdateSpotBatchOrdersReq, UpdateSpotOrderReq } from './types/request/spot.js';
import { CreateSubAccountApiKeyReq, CreateSubAccountReq, UpdateSubAccountApiKeyReq } from './types/request/subaccount.js';
import { TradFiClosePositionReq, TradFiCreateOrderReq, TradFiCreateTransactionReq, TradFiGetKlinesParams, TradFiGetOrderHistoryParams, TradFiGetPositionHistoryParams, TradFiGetSymbolDetailParams, TradFiGetTransactionsParams, TradFiModifyOrderReq, TradFiModifyPositionReq } from './types/request/tradfi.js';
import { GetUnifiedHistoryLendingRateReq, GetUnifiedInterestRecordsReq, GetUnifiedLoanRecordsReq, GetUnifiedLoansReq, PortfolioMarginCalculatorReq, SetUnifiedAccountModeReq, SubmitUnifiedBorrowOrRepayReq, SubmitUnifiedLoanRepayReq } from './types/request/unified.js';
import { GetMainSubTransfersReq, GetSavedAddressReq, GetSmallBalanceHistoryReq, GetWithdrawalDepositRecordsReq, ListPushOrdersReq, SubmitMainSubTransferReq, SubmitSubToSubTransferReq, SubmitTransferReq } from './types/request/wallet.js';
import { SubmitWithdrawalReq } from './types/request/withdrawal.js';
import { AccountDetail, AccountMainKey, AccountRateLimit, StpGroup, StpGroupUser } from './types/response/account.js';
import { AlphaAccount, AlphaAccountBook, AlphaCurrency, AlphaOrder, AlphaTicker, CreateAlphaOrderResp, CreateAlphaQuoteResp } from './types/response/alpha.js';
import { CancelCrossExOrderResp, CloseCrossExPositionResp, CreateCrossExConvertQuoteResp, CreateCrossExOrderResp, CreateCrossExTransferResp, CrossExAccount, CrossExAccountBook, CrossExAdlRank, CrossExCoinDiscountRate, CrossExFeeRate, CrossExHistoryMarginInterest, CrossExHistoryMarginPosition, CrossExHistoryPosition, CrossExHistoryTrade, CrossExInterestRate, CrossExMarginPosition, CrossExMarginPositionLeverage, CrossExOrder, CrossExPosition, CrossExPositionLeverage, CrossExRiskLimit, CrossExSymbol, CrossExTransferCoin, CrossExTransferHistory, ModifyCrossExOrderResp, SetCrossExMarginPositionLeverageResp, SetCrossExPositionLeverageResp, UpdateCrossExAccountResp } from './types/response/crossex.js';
import { DeliveryAccount, DeliveryBook, DeliveryCandle, DeliveryClosedPosition, DeliveryLiquidationHistoryRecord, DeliveryOrderBook, DeliverySettlementHistoryRecord, DeliveryTicker, DeliveryTrade, DeliveryTradingHistoryRecord } from './types/response/delivery.js';
import { DualInvestmentOrder, DualInvestmentProduct, StructuredProduct, StructuredProductOrder } from './types/response/earn.js';
import { LendingCurrency, LendingInterestRecord, LendingOrder, LendingRecord } from './types/response/earnuni.js';
import { FlashSwapCurrencyPair, FlashSwapOrder, SubmitFlashSwapOrderPreviewResp } from './types/response/flashswap.js';
import { BatchAmendOrderResp, BatchFundingRatesResponse, DeleteFuturesBatchOrdersResp, FuturesAccount, FuturesAccountBookRecord, FuturesAutoDeleveragingHistoryRecord, FuturesCandle, FuturesContract, FuturesDeliveryContract, FuturesInsuranceHistory, FuturesLiquidationHistoryRecord, FuturesOrder, FuturesOrderBook, FuturesPosition, FuturesPositionHistoryRecord, FuturesPriceTriggeredOrder, FuturesStats, FuturesTicker, FuturesTrade, FuturesTradingHistoryRecord, IndexConstituents, LiquidationHistoryRecord, PremiumIndexKLine, RiskLimitTableTier, RiskLimitTier, TrailChangeLog, TrailOrder } from './types/response/futures.js';
import { CrossMarginAccount, CrossMarginAccountHistoryRecord, CrossMarginCurrency, CrossMarginMorrowLoanRecord, MarginAccount, MarginBalanceHistoryRecord, MarginUserAccount } from './types/response/margin.js';
import { LendingMarket, MarginUNIInterestRecord, MarginUNILoan, MarginUNILoanRecord, MarginUNIMaxBorrowable } from './types/response/marginuni.js';
import { MultiLoanAdjustmentRecord, MultiLoanCurrencyQuota, MultiLoanFixedRate, MultiLoanOrder, MultiLoanRatio, MultiLoanRepayRecord, MultiLoanSupportedCurrencies, RepayMultiLoanResp, UpdateMultiLoanResp } from './types/response/multicollateralLoan.js';
import { GetOptionsLiquidationResp, OptionsAccount, OptionsAccountChangeRecord, OptionsCandle, OptionsContract, OptionsMMPSettings, OptionsOrderBook, OptionsPositionsUnderlying, OptionsSettlementHistoryRecord, OptionsTicker, OptionsTrade, OptionsUnderlyingCandle, OptionsUserHistoryRecord, OptionsUserSettlement, SubmitOptionsOrderResp } from './types/response/options.js';
import { CancelOTCOrderResp, CreateOTCFiatOrderResp, CreateOTCQuoteResp, CreateOTCStablecoinOrderResp, GetOTCFiatOrderDetailResp, GetOTCFiatOrderListResp, GetOTCStablecoinOrderListResp, GetOTCUserDefaultBankResp, MarkOTCOrderAsPaidResp } from './types/response/otc.js';
import { P2PMerchantAdsDetail, P2PMerchantAdsListItem, P2PMerchantApiResp, P2PMerchantChatsListData, P2PMerchantCounterpartyUserInfo, P2PMerchantMyAdsListData, P2PMerchantPaymentMethod, P2PMerchantTransactionDetails, P2PMerchantTransactionListData, P2PMerchantUserInfo } from './types/response/p2pMerchant.js';
import { AgencyCommissionHistoryRecord, AgencyTransactionHistoryRecord, BrokerCommissionHistoryRecord, BrokerTransactionHistoryRecord, PartnerCommission, PartnerSubordinate, PartnerTransaction } from './types/response/rebate.js';
import { DeleteSpotBatchOrdersResp, GetSpotOpenOrdersResp, SpotAccount, SpotAccountBook, SpotCandle, SpotCurrency, SpotFeeRates, SpotHistoricTradeRecord, SpotInsuranceHistory, SpotOrder, SpotOrderBook, SpotPriceTriggeredOrder, SpotTicker, SpotTrade, SubmitSpotBatchOrdersResp } from './types/response/spot.js';
import { CreatedSubAccountAPIKey, SubAccount, SubAccountAPIKey, SubAccountMode } from './types/response/subaccount.js';
import { TradFiApiResp, TradFiAssets, TradFiCategoryItem, TradFiCreateOrderResult, TradFiCreateUserResult, TradFiKlineItem, TradFiListData, TradFiModifyOrderResult, TradFiMT5Account, TradFiOrderHistoryItem, TradFiOrderItem, TradFiPositionHistoryItem, TradFiPositionItem, TradFiSymbolDetailItem, TradFiSymbolItem, TradFiTicker, TradFiTransactionListData } from './types/response/tradfi.js';
import { MarginTier, PortfolioMarginCalculation, UnifiedAccountInfo, UnifiedCurrencyDiscountTiers, UnifiedHistoryLendingRate, UnifiedInterestRecord, UnifiedLoan, UnifiedLoanCurrency, UnifiedLoanRecord, UnifiedRiskUnitDetails, UserCurrencyLeverageConfig } from './types/response/unified.js';
import { CreateDepositAddressResp, CurrencyChain, DepositRecord, GetBalancesResp, PushOrder, SavedAddress, SmallBalanceHistoryRecord, SmallBalanceRecord, SubAccountCrossMarginBalancesResp, SubAccountFuturesBalancesResp, SubAccountMarginBalance, SubAccountTransferRecord, TradingFees, WithdrawalStatus } from './types/response/wallet.js';
import { WithdrawalRecord } from './types/response/withdrawal.js';
import { CurrencyPair, FromToPageLimit } from './types/shared.js';
/**
 * Unified REST API client for all of Gate's REST APIs
 */
export declare class RestClient extends BaseRestClient {
    constructor(restClientOptions?: RestClientOptions, requestOptions?: AxiosRequestConfig);
    /**
     *
     * Custom SDK functions
     *
     */
    /**
     * This method is used to get the latency and time sync between the client and the server.
     * This is not official API endpoint and is only used for internal testing purposes.
     * Use this method to check the latency and time sync between the client and the server.
     * Final values might vary slightly, but it should be within few ms difference.
     * If you have any suggestions or improvements to this measurement, please create an issue or pull request on GitHub.
     */
    fetchLatencySummary(): Promise<any>;
    /**
     *
     * Gate.io misc endpoints
     *
     */
    getClientType(): RestClientType;
    getSystemMaintenanceStatus(): Promise<any>;
    /**================================================================================================================================
     * WITHDRAW
     * ==========================================================================================================================
     */
    /**
     * Withdraw
     *
     * Withdrawals to Gate addresses do not incur transaction fees.
     *
     * @param params Withdrawal parameters
     * @returns Promise<Withdraw>
     */
    submitWithdrawal(params: SubmitWithdrawalReq): Promise<WithdrawalRecord>;
    /**
     * Transfer between spot main accounts
     *
     * Both parties cannot be sub-accounts.
     *
     * @param params Transfer parameters
     * @returns Promise<{
     *   id: number;
     * }>
     */
    submitSpotMainAccountTransfer(params: {
        receive_uid: number;
        currency: string;
        amount: string;
    }): Promise<{
        id: number;
    }>;
    /**
     * Cancel withdrawal with specified ID
     *
     * @param params Parameters containing the withdrawal ID
     * @returns Promise<WithdrawalRecord>
     */
    cancelWithdrawal(params: {
        withdrawal_id: string;
    }): Promise<WithdrawalRecord>;
    /**==========================================================================================================================
     * WALLET
     * ==========================================================================================================================
     */
    /**
     * List chains supported for specified currency
     *
     * @param params Parameters containing the currency name
     * @returns Promise<CurrencyChain[]>
     */
    getCurrencyChains(params: {
        currency: string;
    }): Promise<CurrencyChain[]>;
    /**
     * Generate currency deposit address
     *
     * @param params Parameters containing the currency name
     * @returns Promise<CreateDepositAddressResp>
     */
    createDepositAddress(params: {
        currency: string;
    }): Promise<CreateDepositAddressResp>;
    /**
     * Retrieve withdrawal records
     *
     * Record time range cannot exceed 30 days
     *
     * @param params Parameters for filtering withdrawal records
     * @returns Promise<Withdraw[]>
     */
    getWithdrawalRecords(params?: GetWithdrawalDepositRecordsReq): Promise<WithdrawalRecord[]>;
    /**
     * Retrieve deposit records
     *
     * Record time range cannot exceed 30 days
     *
     * @param params Parameters for filtering deposit records
     * @returns Promise<DepositRecord[]>
     */
    getDepositRecords(params?: GetWithdrawalDepositRecordsReq): Promise<DepositRecord[]>;
    /**
     * Transfer between trading accounts
     *
     * Transfer between different accounts. Currently support transfers between the following:
     * - spot - margin
     * - spot - futures(perpetual)
     * - spot - delivery
     * - spot - cross margin
     * - spot - options
     *
     * @param params Transfer parameters
     * @returns Promise<TransferResponse>
     */
    submitTransfer(params: SubmitTransferReq): Promise<{
        tx_id: number;
    }>;
    /**
     * Transfer between main and sub accounts
     *
     * Support transferring with sub user's spot or futures account. Note that only main user's spot account is used no matter which sub user's account is operated.
     *
     * @param params Transfer parameters
     * @returns Promise<any>
     */
    submitMainSubTransfer(params: SubmitMainSubTransferReq): Promise<any>;
    /**
     * Retrieve transfer records between main and sub accounts
     *
     * Record time range cannot exceed 30 days
     *
     * Note: only records after 2020-04-10 can be retrieved
     *
     * @param params Parameters for filtering transfer records
     * @returns Promise<SubAccountTransferRecordResp[]>
     */
    getMainSubTransfers(params?: GetMainSubTransfersReq): Promise<SubAccountTransferRecord[]>;
    /**
     * Sub-account transfers to sub-account
     *
     * It is possible to perform balance transfers between two sub-accounts under the same main account. You can use either the API Key of the main account or the API Key of the sub-account to initiate the transfer.
     *
     * @param params Transfer parameters
     * @returns Promise<any>
     */
    submitSubToSubTransfer(params: SubmitSubToSubTransferReq): Promise<any>;
    /**
     * Query transfer status based on client_order_id or tx_id
     *
     * @param params Parameters for querying transfer status
     * @returns Promise<{
     *   tx_id: string;
     *   status: 'PENDING' | 'SUCCESS' | 'FAIL' | 'PARTIAL_SUCCESS';
     * }>
     */
    getTransferStatus(params: {
        client_order_id?: string;
        tx_id?: string;
    }): Promise<{
        tx_id: string;
        status: 'PENDING' | 'SUCCESS' | 'FAIL' | 'PARTIAL_SUCCESS';
    }>;
    /**
     * Retrieve withdrawal status
     *
     * @param params Parameters for retrieving withdrawal status
     * @returns Promise<WithdrawalStatus[]>
     */
    getWithdrawalStatus(params?: {
        currency?: string;
    }): Promise<WithdrawalStatus[]>;
    /**
     * Retrieve sub account balances
     *
     * @param params Parameters for retrieving sub account balances
     * @returns Promise<{
          uid: string;
          available: { [key: string]: string };
        }[]>
     */
    getSubBalance(params?: {
        sub_uid?: string;
    }): Promise<{
        uid: string;
        available: {
            [key: string]: string;
        };
    }[]>;
    /**
     * Query sub accounts' margin balances
     *
     * @param params Parameters for querying sub accounts' margin balances
     * @returns Promise<SubAccountMarginBalancesResp[]>
     */
    getSubMarginBalances(params?: {
        sub_uid?: string;
    }): Promise<{
        uid: string;
        available: SubAccountMarginBalance[];
    }>;
    /**
     * Query sub accounts' futures account balances
     *
     * @param params Parameters for querying sub accounts' futures account balances
     * @returns Promise<SubAccountFuturesBalancesResp[]>
     */
    getSubFuturesBalances(params?: {
        sub_uid?: string;
        settle?: string;
    }): Promise<SubAccountFuturesBalancesResp[]>;
    /**
     * Query subaccount's cross_margin account info
     *
     * @param params Parameters for querying subaccount's cross_margin account info
     * @returns Promise<SubAccountCrossMarginBalancesResp[]>
     */
    getSubCrossMarginBalances(params?: {
        sub_uid?: string;
    }): Promise<SubAccountCrossMarginBalancesResp[]>;
    /**
     * Query saved addresses
     *
     * @param params Parameters for querying saved address
     * @returns Promise<GetSavedAddressResp[]>
     */
    getSavedAddresses(params: GetSavedAddressReq): Promise<SavedAddress[]>;
    /**
     * Retrieve personal trading fee
     *
     * @param params Parameters for retrieving personal trading fee
     * @returns Promise<GetTradingFeesResp>
     */
    getTradingFees(params?: {
        currency_pair?: string;
        settle?: 'BTC' | 'USDT' | 'USD';
    }): Promise<TradingFees>;
    /**
     * Retrieve user's total balances
     *
     * This endpoint returns an approximate sum of exchanged amount from all currencies to input currency for each account.
     * The exchange rate and account balance could have been cached for at most 1 minute. It is not recommended to use its result for any trading calculation.
     *
     * For trading calculation, use the corresponding account query endpoint for each account type. For example:
     * - GET /spot/accounts to query spot account balance
     * - GET /margin/accounts to query margin account balance
     * - GET /futures/{settle}/accounts to query futures account balance
     *
     * @param params Parameters for retrieving total balances
     * @returns Promise<GetBalancesResp>
     */
    getBalances(params?: {
        currency?: string;
    }): Promise<GetBalancesResp>;
    /**
     * List small balance
     *
     * @returns Promise<GetSmallBalancesResp>
     */
    getSmallBalances(): Promise<SmallBalanceRecord>;
    /**
     * Convert small balance
     *
     * @param params Parameters for converting small balance
     * @returns Promise<any>
     */
    convertSmallBalance(params?: {
        currency?: string[];
        is_all?: boolean;
    }): Promise<any>;
    /**
     * List small balance history
     *
     * @param params Parameters for listing small balance history
     * @returns Promise<GetSmallBalanceHistoryResp[]>
     */
    getSmallBalanceHistory(params?: GetSmallBalanceHistoryReq): Promise<SmallBalanceHistoryRecord[]>;
    /**
     * List push orders
     *
     * @param params Parameters for listing push orders
     * @returns Promise<PushOrder[]>
     */
    getPushOrders(params?: ListPushOrdersReq): Promise<PushOrder[]>;
    /**
     * Retrieve the list of low-liquidity or low-cap tokens
     *
     * @returns Promise<string[]>
     */
    getLowCapExchangeList(): Promise<string[]>;
    /**==========================================================================================================================
     * SUBACCOUNT
     * ==========================================================================================================================
     */
    /**
     * Create a new sub-account
     *
     * @param params Parameters for creating a new sub-account
     * @returns Promise<CreateSubAccountResp>
     */
    createSubAccount(params: CreateSubAccountReq): Promise<SubAccount>;
    /**
     * List sub-accounts
     *
     * @param params Parameters for listing sub-accounts
     * @returns Promise<GetSubAccountsResp[]>
     */
    getSubAccounts(params?: {
        type?: string;
    }): Promise<SubAccount[]>;
    /**
     * Get the sub-account
     *
     * @param params Parameters containing the sub-account user ID
     * @returns Promise<SubAccountResp>
     */
    getSubAccount(params: {
        user_id: number;
    }): Promise<SubAccount>;
    /**
     * Create API Key of the sub-account
     *
     * @param params Parameters for creating API Key of the sub-account
     * @returns Promise<CreateSubAccountApiKeyResp>
     */
    createSubAccountApiKey(params: CreateSubAccountApiKeyReq): Promise<CreatedSubAccountAPIKey>;
    /**
     * List all API Key of the sub-account
     *
     * @param params Parameters containing the sub-account user ID
     * @returns Promise<SubAccountKey[]>
     */
    getSubAccountApiKeys(params: {
        user_id: number;
    }): Promise<SubAccountAPIKey[]>;
    /**
     * Update API key of the sub-account
     *
     * Note: This interface cannot modify the mode account type attribute
     *
     * @param params Parameters for updating API key of the sub-account
     * @returns Promise<any>
     */
    updateSubAccountApiKey(params: UpdateSubAccountApiKeyReq): Promise<any>;
    /**
     * Delete API key of the sub-account
     *
     * @param params Parameters for deleting API key of the sub-account
     * @returns Promise<any>
     */
    deleteSubAccountApiKey(params: {
        user_id: number;
        key: string;
    }): Promise<any>;
    /**
     * Get the API Key of the sub-account
     *
     * @param params Parameters containing the sub-account user ID and API key
     * @returns Promise<SubAccountKey>
     */
    getSubAccountApiKey(params: {
        user_id: number;
        key: string;
    }): Promise<SubAccountAPIKey>;
    /**
     * Lock the sub-account
     *
     * @param params Parameters containing the sub-account user ID
     * @returns Promise<any>
     */
    lockSubAccount(params: {
        user_id: number;
    }): Promise<any>;
    /**
     * Unlock the sub-account
     *
     * @param params Parameters containing the sub-account user ID
     * @returns Promise<any>
     */
    unlockSubAccount(params: {
        user_id: number;
    }): Promise<any>;
    /**
     * Get sub-account mode
     *
     * Unified account mode:
     * - classic: Classic account mode
     * - multi_currency: Multi-currency margin mode
     * - portfolio: Portfolio margin mode
     *
     * @returns Promise<SubAccountMode>
     */
    getSubAccountMode(): Promise<SubAccountMode>;
    /**==========================================================================================================================
     * UNIFIED
     * ==========================================================================================================================
     */
    /**
     * Get unified account information
     *
     * The assets of each currency in the account will be adjusted according to their liquidity, defined by corresponding adjustment coefficients, and then uniformly converted to USD to calculate the total asset value and position value of the account.
     *
     * For specific formulas, please refer to Margin Formula
     *
     * @param params Parameters for retrieving unified account information
     * @returns Promise<UnifiedAccountInfo>
     */
    getUnifiedAccountInfo(params?: {
        currency?: string;
        sub_uid?: string;
    }): Promise<UnifiedAccountInfo>;
    /**
     * Query about the maximum borrowing for the unified account
     *
     * @param params Parameters for querying the maximum borrowing for the unified account
     * @returns Promise<{
     *   currency: string;
     *   amount: string;
     * }>
     */
    getUnifiedMaxBorrow(params: {
        currency: string;
    }): Promise<{
        currency: string;
        amount: string;
    }>;
    /**
     * Query about the maximum transferable for the unified account
     *
     * @param params Parameters for querying the maximum transferable for the unified account
     * @returns Promise<{
     *   currency: string;
     *   amount: string;
     * }>
     */
    getUnifiedMaxTransferable(params: {
        currency: string;
    }): Promise<{
        currency: string;
        amount: string;
    }>;
    /**
     * Batch query maximum transferable amounts for unified accounts
     *
     * After withdrawing currency, the transferable amount will change.
     *
     * @param params Parameters containing currencies to query (up to 100 at once)
     * @returns Promise with array of currency and maximum transferable amount
     */
    getUnifiedMaxTransferables(params: {
        currencies: string;
    }): Promise<{
        currency: string;
        amount: string;
    }[]>;
    getUnifiedBatchMaxBorrowable(params: {
        currencies: string[];
    }): Promise<any>;
    /**
     * Borrow or repay
     *
     * When borrowing, it is essential to ensure that the borrowed amount is not below the minimum borrowing threshold for the specific cryptocurrency and does not exceed the maximum borrowing limit set by the platform and the user.
     *
     * The interest on the loan will be automatically deducted from the account at regular intervals. It is the user's responsibility to manage the repayment of the borrowed amount.
     *
     * For repayment, the option to repay the entire borrowed amount is available by setting the parameter repaid_all=true
     *
     * @param params Parameters for borrowing or repaying
     * @returns Promise<any>
     */
    submitUnifiedBorrowOrRepay(params: SubmitUnifiedBorrowOrRepayReq): Promise<any>;
    /**
     * List loans
     *
     * @param params Parameters for listing loans
     * @returns Promise<GetUnifiedLoansResp[]>
     */
    getUnifiedLoans(params?: GetUnifiedLoansReq): Promise<UnifiedLoan[]>;
    /**
     * Get loan records
     *
     * @param params Parameters for getting loan records
     * @returns Promise<GetUnifiedLoanRecordsResp[]>
     */
    getUnifiedLoanRecords(params?: GetUnifiedLoanRecordsReq): Promise<UnifiedLoanRecord[]>;
    /**
     * List interest records
     *
     * @param params Parameters for listing interest records
     * @returns Promise<GetUnifiedInterestRecordsResp[]>
     */
    getUnifiedInterestRecords(params?: GetUnifiedInterestRecordsReq): Promise<UnifiedInterestRecord[]>;
    /**
     * Retrieve user risk unit details, only valid in portfolio margin mode
     *
     * @returns Promise<GetUnifiedRiskUnitDetailsResp>
     */
    getUnifiedRiskUnitDetails(): Promise<UnifiedRiskUnitDetails>;
    /**
     * Set mode of the unified account
     *
     * Switching between different account modes requires only passing the parameters corresponding to the target account mode. It also supports opening or closing configuration switches for the corresponding account mode when switching.
     *
     * @param params Parameters for setting the mode of the unified account
     * @returns Promise<any>
     */
    setUnifiedAccountMode(params: SetUnifiedAccountModeReq): Promise<any>;
    /**
     * Query mode of the unified account
     *
     * @returns Promise<SetUnifiedAccountModeReq>
     */
    getUnifiedAccountMode(): Promise<SetUnifiedAccountModeReq>;
    /**
     * Get unified estimate rate
     *
     * Due to fluctuations in lending depth, hourly interest rates may vary, and thus, I cannot provide exact rates. When a currency is not supported, the interest rate returned will be an empty string.
     *
     * @param params Parameters for querying estimate rates
     * @returns Promise<{ [key: string]: string }>
     */
    getUnifiedEstimateRate(params: {
        currencies: string[];
    }): Promise<{
        [key: string]: string;
    }>;
    /**
     * List currency discount tiers
     *
     * @returns Promise<GetUnifiedCurrencyDiscountTiersResp[]>
     */
    getUnifiedCurrencyDiscountTiers(): Promise<UnifiedCurrencyDiscountTiers[]>;
    /**
     * List loan margin tiers
     *
     * @returns Promise<{
     *   currency: string;
     *   margin_tiers: MarginTier[];
     * }[]>
     */
    getLoanMarginTiers(): Promise<{
        currency: string;
        margin_tiers: MarginTier[];
    }[]>;
    /**
     * Portfolio margin calculator
     *
     * Portfolio Margin Calculator When inputting a simulated position portfolio, each position includes the position name and quantity held, supporting markets within the range of BTC and ETH perpetual contracts, options, and spot markets. When inputting simulated orders, each order includes the market identifier, order price, and order quantity, supporting markets within the range of BTC and ETH perpetual contracts, options, and spot markets. Market orders are not included.
     *
     * @param params Parameters for portfolio margin calculator
     * @returns Promise<PortfolioMarginCalculatorResp>
     */
    portfolioMarginCalculate(params: PortfolioMarginCalculatorReq): Promise<PortfolioMarginCalculation>;
    /**
     * Query user currency leverage configuration
     *
     * Get the maximum and minimum leverage multiples that users can set for a currency type
     *
     * @param params Parameters containing the currency
     * @returns Promise<UserCurrencyLeverageConfig>
     */
    getUserCurrencyLeverageConfig(params: {
        currency: string;
    }): Promise<UserCurrencyLeverageConfig>;
    /**
     * Get the user's currency leverage
     *
     * If currency is not passed, query all currencies.
     *
     * @param params Optional parameters containing the currency
     * @returns Promise<UserCurrencyLeverageSetting[]>
     */
    getUserCurrencyLeverageSettings(params?: {
        currency?: string;
    }): Promise<{
        currency: string;
        leverage: string;
    }[]>;
    /**
     * Set the currency leverage ratio
     *
     * @param params Parameters for setting currency leverage ratio
     * @returns Promise<any> Returns nothing on success (204 No Content)
     */
    updateUserCurrencyLeverage(params: {
        currency: string;
        leverage: string;
    }): Promise<any>;
    /**
     * List loan currencies supported by unified account
     *
     * @param params Optional parameters for filtering
     * @returns Promise with array of loan currencies
     */
    getUnifiedLoanCurrencies(params?: {
        currency?: string;
    }): Promise<UnifiedLoanCurrency[]>;
    /**
     * Get historical lending rates
     *
     * @param params Parameters for retrieving historical lending rates
     * @returns Promise<UnifiedHistoryLendingRate>
     */
    getHistoricalLendingRates(params: GetUnifiedHistoryLendingRateReq): Promise<UnifiedHistoryLendingRate>;
    submitUnifiedLoanRepay(params: SubmitUnifiedLoanRepayReq): Promise<any>;
    /**==========================================================================================================================
     * SPOT
     * ==========================================================================================================================
     */
    /**
     * List all currencies' details
     *
     * Currency has two forms:
     * - Only currency name, e.g., BTC, USDT
     * - <currency>_<chain>, e.g., HT_ETH
     *
     * The latter one occurs when one currency has multiple chains. Currency detail contains a chain field whatever the form is. To retrieve all chains of one currency, you can use all the details which have the name of the currency or name starting with <currency>_.
     *
     * @returns Promise<GetSpotCurrenciesResp[]>
     */
    getSpotCurrencies(): Promise<SpotCurrency[]>;
    /**
     * Get details of a specific currency
     *
     * @param params Parameters for retrieving details of a specific currency
     * @returns Promise<GetSpotCurrenciesResp>
     */
    getSpotCurrency(params: {
        currency: string;
    }): Promise<SpotCurrency>;
    /**
     * List all currency pairs supported
     *
     * @returns Promise<CurrencyPair[]>
     */
    getSpotCurrencyPairs(): Promise<CurrencyPair[]>;
    /**
     * Get details of a specific currency pair
     *
     * @param params Parameters for retrieving details of a specific currency pair
     * @returns Promise<CurrencyPair>
     */
    getSpotCurrencyPair(params: {
        currency_pair: string;
    }): Promise<CurrencyPair>;
    /**
     * Retrieve ticker information
     *
     * Return only related data if currency_pair is specified; otherwise return all of them.
     *
     * @param params Parameters for retrieving ticker information
     * @returns Promise<GetSpotTickerResp[]>
     */
    getSpotTicker(params?: {
        currency_pair?: string;
        timezone?: 'utc0' | 'utc8' | 'all';
    }): Promise<SpotTicker[]>;
    /**
     * Retrieve order book
     *
     * Order book will be sorted by price from high to low on bids; low to high on asks.
     *
     * @param params Parameters for retrieving order book
     * @returns Promise<GetSpotOrderBookResp>
     */
    getSpotOrderBook(params: GetSpotOrderBookReq): Promise<SpotOrderBook>;
    /**
     * Retrieve market trades
     *
     * You can use from and to to query by time range, or use last_id by scrolling page. The default behavior is by time range.
     * Scrolling query using last_id is not recommended any more. If last_id is specified, time range query parameters will be ignored.
     *
     * @param params Parameters for retrieving market trades
     * @returns Promise<GetSpotTradesResp[]>
     */
    getSpotTrades(params: GetSpotTradesReq): Promise<SpotTrade[]>;
    /**
     * Market Candles
     *
     * Maximum of 1000 points can be returned in a query. Be sure not to exceed the limit when specifying from, to and interval.
     *
     * @param params Parameters for retrieving market Candles
     * @returns Promise<GetSpotCandlesResp>
     */
    getSpotCandles(params: GetSpotCandlesReq): Promise<SpotCandle[]>;
    /**
     * Query user trading fee rates
     *
     * This API is deprecated in favour of new fee retrieving API /wallet/fee.
     *
     * @param params Parameters for querying user trading fee rates
     * @returns Promise<GetSpotFeeRatesResp>
     */
    getSpotFeeRates(params?: {
        currency_pair?: string;
    }): Promise<SpotFeeRates>;
    /**
     * Query a batch of user trading fee rates
     *
     * @param params Parameters for querying a batch of user trading fee rates
     */
    getSpotBatchFeeRates(params: {
        currency_pairs: string;
    }): Promise<Record<string, SpotFeeRates>>;
    /**
     * List spot accounts
     *
     * @param params Parameters for listing spot accounts
     * @returns Promise<GetSpotAccountsResp[]>
     */
    getSpotAccounts(params?: {
        currency?: string;
    }): Promise<SpotAccount[]>;
    /**
     * Query account book
     *
     * Record time range cannot exceed 30 days.
     *
     * @param params Parameters for querying account book
     * @returns Promise<GetSpotAccountBookResp[]>
     */
    getSpotAccountBook(params?: GetSpotAccountBookReq): Promise<SpotAccountBook[]>;
    /**
     * Create a batch of orders
     *
     * Batch orders requirements:
     * - custom order field text is required
     * - At most 4 currency pairs, maximum 10 orders each, are allowed in one request
     * - No mixture of spot orders and margin orders, i.e. account must be identical for all orders
     *
     * NOTE: The "xGateExptime" parameter will translate to the "x-gate-exptime" header.
     *
     * @param params Parameters for creating a batch of orders
     * @returns Promise<SubmitSpotBatchOrdersResp[]>
     */
    submitSpotBatchOrders(body: SpotOrder[], params?: {
        xGateExptime?: number;
    }): Promise<SubmitSpotBatchOrdersResp[]>;
    /**
     * List all open orders
     *
     * List open orders in all currency pairs.
     * Note that pagination parameters affect record number in each currency pair's open order list. No pagination is applied to the number of currency pairs returned. All currency pairs with open orders will be returned.
     * Spot, portfolio, and margin orders are returned by default. To list cross margin orders, account must be set to cross_margin.
     *
     * @param params Parameters for listing all open orders
     * @returns Promise<GetSpotOpenOrdersResp[]>
     */
    getSpotOpenOrders(params?: {
        page?: number;
        limit?: number;
        account?: 'spot' | 'margin' | 'cross_margin' | 'unified';
    }): Promise<GetSpotOpenOrdersResp[]>;
    /**
     * Close position when cross-currency is disabled
     *
     * Currently, only cross-margin accounts are supported to close position when cross currencies are disabled. Maximum buy quantity = (unpaid principal and interest - currency balance - the amount of the currency in the order book) / 0.998
     *
     * @param params Parameters for closing position when cross-currency is disabled
     * @returns Promise<Order>
     */
    submitSpotClosePosCrossDisabled(params: SubmitSpotClosePosCrossDisabledReq): Promise<SpotOrder>;
    /**
     * Create an order
     *
     * You can place orders with spot, portfolio, margin or cross margin account through setting the account field. It defaults to spot, which means spot account is used to place orders. If the user is using unified account, it defaults to the unified account.
     *
     * NOTE: The "xGateExptime" parameter will translate to the "x-gate-exptime" header.
     *
     * @param params Parameters for creating an order
     * @returns Promise<Order>
     */
    submitSpotOrder(params: SubmitSpotOrderReq): Promise<SpotOrder>;
    /**
     * List orders
     *
     * Spot, portfolio and margin orders are returned by default. If cross margin orders are needed, account must be set to cross_margin.
     *
     * @param params Parameters for listing orders
     * @returns Promise<Order[]>
     */
    getSpotOrders(params: GetSpotOrdersReq): Promise<SpotOrder[]>;
    /**
     * Cancel all open orders in specified currency pair
     *
     * If account is not set, all open orders, including spot, portfolio, margin and cross margin ones, will be cancelled.
     * You can set account to cancel only orders within the specified account.
     *
     * NOTE: The "xGateExptime" parameter will translate to the "x-gate-exptime" header.
     *
     * @param params Parameters for cancelling all open orders in specified currency pair
     * @returns Promise<Order[]>
     */
    cancelSpotOpenOrders(params: {
        currency_pair: string;
        side?: 'buy' | 'sell';
        account?: 'spot' | 'margin' | 'cross_margin' | 'unified';
        action_mode?: 'ACK' | 'RESULT' | 'FULL';
        xGateExptime?: number;
    }): Promise<SpotOrder[]>;
    /**
     * Cancel a batch of orders with an ID list
     *
     * Multiple currency pairs can be specified, but maximum 20 orders are allowed per request.
     *
     * NOTE: The "xGateExptime" parameter will translate to the "x-gate-exptime" header.
     *
     * @param params Parameters for cancelling a batch of orders
     * @returns Promise<DeleteSpotBatchOrdersResp[]>
     */
    batchCancelSpotOrders(body: CancelSpotBatchOrdersReq[], params?: {
        xGateExptime?: number;
    }): Promise<DeleteSpotBatchOrdersResp[]>;
    /**
     * Get a single order
     *
     * Spot, portfolio and margin orders are queried by default. If cross margin orders are needed or portfolio margin account are used, account must be set to cross_margin.
     *
     * @param params Parameters for getting a single order
     * @returns Promise<Order>
     */
    getSpotOrder(params: GetSpotOrderReq): Promise<SpotOrder>;
    /**
     * Amend an order
     *
     * By default, the orders of spot, portfolio and margin account are updated. If you need to modify orders of the cross-margin account, you must specify account as cross_margin. For portfolio margin account, only cross_margin account is supported.
     *
     * Currently, only supports modification of price or amount fields.
     *
     * NOTE: The "xGateExptime" parameter will translate to the "x-gate-exptime" header.
     *
     * @param params Parameters for amending an order
     * @returns Promise<Order>
     */
    updateSpotOrder(params: UpdateSpotOrderReq): Promise<SpotOrder>;
    /**
     * Cancel a single order
     *
     * Spot, portfolio and margin orders are cancelled by default. If trying to cancel cross margin orders or portfolio margin account are used, account must be set to cross_margin.
     *
     * NOTE: The "xGateExptime" parameter will translate to the "x-gate-exptime" header.
     *
     * @param params Parameters for cancelling a single order
     * @returns Promise<Order>
     */
    cancelSpotOrder(params: DeleteSpotOrderReq): Promise<SpotOrder>;
    /**
     * List personal trading history
     *
     * By default query of transaction records for spot, unified account and warehouse-by-site leverage accounts.
     *
     * The history within a specified time range can be queried by specifying from or (and) to.
     *
     * If no time parameters are specified, only data for the last 7 days can be obtained.
     * If only any parameter of from or to is specified, only 7-day data from the start (or end) of the specified time is returned.
     * The range not allowed to exceed 30 days.
     * The parameters of the time range filter are processed according to the order end time.
     *
     * The maximum number of pages when searching data using limit&page paging function is 100,0, that is, limit * (page - 1) <= 100,0.
     *
     * @param params Parameters for listing personal trading history
     * @returns Promise<GetSpotTradingHistoryResp[]>
     */
    getSpotTradingHistory(params?: GetSpotTradingHistoryReq): Promise<SpotHistoricTradeRecord[]>;
    /**
     * Get server current time
     *
     * @returns Promise<{
     *   server_time: number;
     * }>
     */
    getServerTime(): Promise<{
        server_time: number;
    }>;
    /**
     * Countdown cancel orders
     *
     * When the timeout set by the user is reached, if there is no cancel or set a new countdown, the related pending orders will be automatically cancelled. This endpoint can be called repeatedly to set a new countdown or cancel the countdown.
     *
     * @param params Parameters for setting countdown cancel orders
     * @returns Promise<{
     *   triggerTime: number;
     * }>
     */
    submitSpotCountdownOrders(params: {
        timeout: number;
        currency_pair?: string;
    }): Promise<{
        triggerTime: number;
    }>;
    /**
     * Batch modification of orders
     *
     * Default modification of orders for spot, portfolio, and margin accounts. To modify orders for a cross margin account, the account parameter must be specified as cross_margin. For portfolio margin accounts, the account parameter can only be specified as cross_margin. Currently, only modifications to price or quantity (choose one) are supported.
     *
     * NOTE: The "xGateExptime" parameter will translate to the "x-gate-exptime" header.
     *
     * @param params Parameters for batch modification of orders
     * @returns Promise<Order[]>
     */
    batchUpdateSpotOrders(body: UpdateSpotBatchOrdersReq[], params?: {
        xGateExptime?: number;
    }): Promise<SpotOrder[]>;
    /**
     * Query spot insurance fund historical data
     *
     * @param params Parameters for querying spot insurance fund history
     * @returns Promise<{
     *   currency: string;
     *   balance: string;
     *   time: number;
     * }[]>
     */
    getSpotInsuranceHistory(params: GetSpotInsuranceHistoryReq): Promise<SpotInsuranceHistory[]>;
    /**
     * Create a price-triggered order
     *
     * @param params Parameters for creating a price-triggered order
     * @returns Promise<{
     *   id: number;
     * }>
     */
    submitSpotPriceTriggerOrder(params: SpotPriceTriggeredOrder): Promise<{
        id: number;
    }>;
    /**
     * Retrieve running auto order list
     *
     * @param params Parameters for retrieving running auto order list
     * @returns Promise<SpotPriceTriggeredOrder[]>
     */
    getSpotAutoOrders(params: GetSpotAutoOrdersReq): Promise<SpotPriceTriggeredOrder[]>;
    /**
     * Cancel all open orders
     *
     * @param params Parameters for cancelling all open orders
     * @returns Promise<SpotPriceTriggeredOrder[]>
     */
    cancelAllOpenSpotOrders(params?: {
        market?: string;
        account?: 'normal' | 'margin' | 'cross_margin';
    }): Promise<SpotPriceTriggeredOrder[]>;
    /**
     * Get a price-triggered order
     *
     * @param params Parameters for getting a price-triggered order
     * @returns Promise<SpotPriceTriggeredOrder>
     */
    getPriceTriggeredOrder(params: {
        order_id: string;
    }): Promise<SpotPriceTriggeredOrder>;
    /**
     * Cancel a price-triggered order
     *
     * @param params Parameters for cancelling a price-triggered order
     * @returns Promise<SpotPriceTriggeredOrder>
     */
    cancelSpotTriggeredOrder(params: {
        order_id: string;
    }): Promise<SpotPriceTriggeredOrder>;
    /**
     * Set collateral currency
     *
     * @param params Parameters for setting collateral currency
     * @returns Promise<{
     *   is_success: boolean;
     * }>
     */
    setCollateralCurrency(params: {
        collateral_type: 0 | 1;
        enable_list?: string[];
        disable_list?: string[];
    }): Promise<{
        is_success: boolean;
    }>;
    /**==========================================================================================================================
     * MARGIN
     * ==========================================================================================================================
     */
    /**
     * Margin account list
     *
     * @param params Parameters for listing margin accounts
     * @returns Promise<GetMarginAccountsResp[]>
     */
    getMarginAccounts(params?: {
        currency_pair?: string;
    }): Promise<MarginAccount[]>;
    /**
     * List margin account balance change history
     *
     * Only transferals from and to margin account are provided for now. Time range allows 30 days at most.
     *
     * @param params Parameters for listing margin account balance change history
     * @returns Promise<GetMarginBalanceHistoryResp[]>
     */
    getMarginBalanceHistory(params?: GetMarginBalanceHistoryReq): Promise<MarginBalanceHistoryRecord[]>;
    /**
     * Funding account list
     *
     * @param params Parameters for listing funding accounts
     * @returns Promise<{
     *   currency: string;
     *   available: string;
     *   locked: string;
     *   lent: string;
     *   total_lent: string;
     * }[]>
     */
    getFundingAccounts(params?: {
        currency?: string;
    }): Promise<{
        currency: string;
        available: string;
        locked: string;
        lent: string;
        total_lent: string;
    }[]>;
    /**
     * Update user's auto repayment setting
     *
     * @param params Parameters for updating auto repayment setting
     * @returns Promise<{ status: 'on' | 'off' }>
     */
    updateAutoRepaymentSetting(params: {
        status: 'on' | 'off';
    }): Promise<{
        status: 'on' | 'off';
    }>;
    /**
     * Retrieve user auto repayment setting
     *
     * @returns Promise<{ status: 'on' | 'off' }>
     */
    getAutoRepaymentSetting(): Promise<{
        status: 'on' | 'off';
    }>;
    /**
     * Get the max transferable amount for a specific margin currency
     *
     * @param params Parameters for retrieving the max transferable amount
     * @returns Promise<{
     *   currency: string;
     *   currency_pair?: string;
     *   amount: string;
     * }>
     */
    getMarginTransferableAmount(params: {
        currency: string;
        currency_pair?: string;
    }): Promise<{
        currency: string;
        currency_pair?: string;
        amount: string;
    }>;
    /**
     * @deprecated  as of 2025-02-10
     * Currencies supported by cross margin
     *
     * @returns Promise<GetCrossMarginCurrenciesResp[]>
     */
    getCrossMarginCurrencies(): Promise<CrossMarginCurrency[]>;
    /**
     * @deprecated  as of 2025-02-10
     * Retrieve detail of one single currency supported by cross margin
     *
     * @param params Parameters containing the currency name
     * @returns Promise<GetCrossMarginCurrenciesResp>
     */
    getCrossMarginCurrency(params: {
        currency: string;
    }): Promise<CrossMarginCurrency>;
    /**
     * @deprecated  as of 2025-02-10
     * Retrieve cross margin account
     *
     * @returns Promise<GetCrossMarginAccountResp>
     */
    getCrossMarginAccount(): Promise<CrossMarginAccount>;
    /**
     * @deprecated  as of 2025-02-10
     * Retrieve cross margin account change history
     *
     * Record time range cannot exceed 30 days.
     *
     * @param params Parameters for retrieving cross margin account change history
     * @returns Promise<GetCrossMarginAccountHistoryResp[]>
     */
    getCrossMarginAccountHistory(params?: GetCrossMarginAccountHistoryReq): Promise<CrossMarginAccountHistoryRecord[]>;
    /**
     *
     * @deprecated  as of 2025-02-10
     * Create a cross margin borrow loan
     *
     * Borrow amount cannot be less than currency minimum borrow amount.
     *
     * @param params Parameters for creating a cross margin borrow loan
     * @returns Promise<SubmitCrossMarginBorrowLoanResp>
     *
     */
    submitCrossMarginBorrowLoan(params: SubmitCrossMarginBorrowLoanReq): Promise<CrossMarginMorrowLoanRecord>;
    /**
     *
     * List cross margin borrow history
     *
     * Sort by creation time in descending order by default. Set reverse=false to return ascending results.
     *
     * @param params Parameters for listing cross margin borrow history
     * @returns Promise<SubmitCrossMarginBorrowLoanResp[]>
     */
    getCrossMarginBorrowHistory(params: GetCrossMarginBorrowHistoryReq): Promise<CrossMarginMorrowLoanRecord[]>;
    /**
     * @deprecated  as of 2025-02-10
     * Retrieve single borrow loan detail
     *
     * @param params Parameters containing the borrow loan ID
     * @returns Promise<SubmitCrossMarginBorrowLoanResp>
     */
    getCrossMarginBorrowLoan(params: {
        loan_id: string;
    }): Promise<CrossMarginMorrowLoanRecord>;
    /**
     * @deprecated  as of 2025-02-10
     * Cross margin repayments
     *
     * When the liquidity of the currency is insufficient and the transaction risk is high, the currency will be disabled, and funds cannot be transferred. When the available balance of cross-margin is insufficient, the balance of the spot account can be used for repayment. Please ensure that the balance of the spot account is sufficient, and system uses cross-margin account for repayment first.
     *
     * @param params Parameters for cross margin repayments
     * @returns Promise<SubmitCrossMarginBorrowLoanResp[]>
     */
    submitCrossMarginRepayment(params: {
        currency: string;
        amount: string;
    }): Promise<CrossMarginMorrowLoanRecord[]>;
    /**
     * @deprecated  as of 2025-02-10
     * Retrieve cross margin repayments
     *
     * Sort by creation time in descending order by default. Set reverse=false to return ascending results.
     *
     * @param params Parameters for retrieving cross margin repayments
     * @returns Promise<GetCrossMarginRepaymentsResp[]>
     */
    getCrossMarginRepayments(params?: GetCrossMarginRepaymentsReq): Promise<CrossMarginAccount[]>;
    /**
     * @deprecated  as of 2025-02-10
     * Interest records for the cross margin account
     *
     * @param params Parameters for retrieving interest records
     * @returns Promise<GetCrossMarginInterestRecordsResp[]>
     */
    getCrossMarginInterestRecords(params?: GetCrossMarginInterestRecordsReq): Promise<GetCrossMarginInterestRecordsReq[]>;
    /**
     * @deprecated  as of 2025-02-10
     * Get the max transferable amount for a specific cross margin currency
     *
     * @param params Parameters for retrieving the max transferable amount
     * @returns Promise<{
     *   currency: string;
     *   amount: string;
     * }>
     */
    getCrossMarginTransferableAmount(params: {
        currency: string;
    }): Promise<{
        currency: string;
        amount: string;
    }>;
    /**
     * @deprecated  as of 2025-02-10
     * Estimated interest rates
     *
     * Please note that the interest rates are subject to change based on the borrowing and lending demand, and therefore, the provided rates may not be entirely accurate.
     *
     * @param params Parameters for retrieving estimated interest rates
     * @returns Promise<any>
     */
    getEstimatedInterestRates(params: {
        currencies: string[];
    }): Promise<any>;
    /**
     * @deprecated  as of 2025-02-10
     * Get the max borrowable amount for a specific cross margin currency
     *
     * @param params Parameters for retrieving the max borrowable amount
     * @returns Promise<{
     *   currency: string;
     *   amount: string;
     * }>
     */
    getCrossMarginBorrowableAmount(params: {
        currency: string;
    }): Promise<{
        currency: string;
        amount: string;
    }>;
    /**
     * Check the user's own leverage lending gradient in the current market
     *
     * @param params Parameters containing currency pair to query
     * @returns Promise with array of market gradient information
     */
    getMarginUserLoanTiers(params: {
        currency_pair: string;
    }): Promise<{
        tier_amount: string;
        mmr: string;
        leverage: string;
    }[]>;
    /**
     * Query the current market leverage lending gradient
     *
     * @param params Parameters containing currency pair to query
     * @returns Promise with array of market gradient information
     */
    getMarginPublicLoanTiers(params: {
        currency_pair: string;
    }): Promise<{
        tier_amount: string;
        mmr: string;
        leverage: string;
    }[]>;
    /**
     * Set the user market leverage multiple
     *
     * @param params Parameters containing currency pair and leverage value
     * @returns Promise<void> - Returns nothing on success (204 No Content)
     */
    setMarginUserLeverage(params: {
        currency_pair: string;
        leverage: string;
    }): Promise<any>;
    /**
     * Query the user's leverage account list
     *
     * Supports querying risk rate per position account and margin rate per position account
     *
     * @param params Optional parameters for filtering by currency pair
     * @returns Promise with array of margin account details
     */
    getMarginUserAccounts(params?: {
        currency_pair?: string;
    }): Promise<MarginUserAccount[]>;
    /**==========================================================================================================================
     * MARGIN UNI
     * ==========================================================================================================================
     */
    /**
     * List lending markets
     *
     * @returns Promise<GetLendingMarketsResp[]>
     */
    getLendingMarkets(): Promise<LendingMarket[]>;
    /**
     * Get detail of lending market
     *
     * @param params Parameters containing the currency pair
     * @returns Promise<{
     *   currency_pair: string;
     *   base_min_borrow_amount: string;
     *   quote_min_borrow_amount: string;
     *   leverage: string;
     * }>
     */
    getLendingMarket(params: {
        currency_pair: string;
    }): Promise<LendingMarket>;
    /**
     * Estimate interest rate
     *
     * Please note that the interest rates are subject to change based on the borrowing and lending demand, and therefore, the provided rates may not be entirely accurate.
     *
     * @param params Parameters for retrieving estimated interest rates
     * @returns Promise<any>
     */
    getEstimatedInterestRate(params: {
        currencies: string[];
    }): Promise<any>;
    /**
     * Borrow or repay
     *
     * @param params Parameters for borrowing or repaying
     * @returns Promise<any>
     */
    submitMarginUNIBorrowOrRepay(params: {
        currency: string;
        type: 'borrow' | 'repay';
        amount: string;
        currency_pair: string;
        repaid_all?: boolean;
    }): Promise<any>;
    /**
     * List loans
     *
     * @param params Parameters for listing loans
     * @returns Promise<GetMarginUNILoansResp[]>
     */
    getMarginUNILoans(params?: GetMarginUNILoansReq): Promise<MarginUNILoan[]>;
    /**
     * Get loan records
     *
     * @param params Parameters for retrieving loan records
     * @returns Promise<GetMarginUNILoanRecordsResp[]>
     */
    getMarginUNILoanRecords(params?: GetMarginUNILoanRecordsReq): Promise<MarginUNILoanRecord[]>;
    /**
     * List interest records
     *
     * @param params Parameters for listing interest records
     * @returns Promise<GetMarginUNIInterestRecordsResp[]>
     */
    getMarginUNIInterestRecords(params?: GetMarginUNIInterestRecordsReq): Promise<MarginUNIInterestRecord[]>;
    /**
     * Get maximum borrowable
     *
     * @param params Parameters for retrieving the maximum borrowable amount
     * @returns Promise<GetMarginUNIMaxBorrowResp>
     */
    getMarginUNIMaxBorrow(params: GetMarginUNIMaxBorrowReq): Promise<MarginUNIMaxBorrowable>;
    /**==========================================================================================================================
     * FLASH SWAP
     * ==========================================================================================================================
     */
    /**
     * List All Supported Currency Pairs In Flash Swap
     *
     * @param params Parameters for retrieving data of the specified currency
     * @returns Promise<GetFlashSwapCurrencyPairsResp[]>
     */
    getFlashSwapCurrencyPairs(params?: {
        currency?: string;
        page?: number;
        limit?: number;
    }): Promise<FlashSwapCurrencyPair[]>;
    /**
     * Create a flash swap order
     *
     * Initiate a flash swap preview in advance because order creation requires a preview result.
     *
     * @param params Parameters for creating a flash swap order
     * @returns Promise<SubmitFlashSwapOrderResp>
     */
    submitFlashSwapOrder(params: SubmitFlashSwapOrderReq): Promise<FlashSwapOrder>;
    /**
     * List all flash swap orders
     *
     * @param params Parameters for listing flash swap orders
     * @returns Promise<GetFlashSwapOrdersResp[]>
     */
    getFlashSwapOrders(params?: GetFlashSwapOrdersReq): Promise<FlashSwapOrder[]>;
    /**
     * Get a single flash swap order's detail
     *
     * @param params Parameters containing the flash swap order ID
     * @returns Promise<GetFlashSwapOrderResp>
     */
    getFlashSwapOrder(params: {
        order_id: number;
    }): Promise<FlashSwapOrder>;
    /**
     * Initiate a flash swap order preview
     *
     * @param params Parameters for initiating a flash swap order preview
     * @returns Promise<SubmitFlashSwapOrderPreviewResp>
     */
    submitFlashSwapOrderPreview(params: SubmitFlashSwapOrderPreviewReq): Promise<SubmitFlashSwapOrderPreviewResp>;
    /**==========================================================================================================================
     * FUTURES
     * ==========================================================================================================================
     */
    /**
     * List all futures contracts
     *
     * @param params Parameters for listing futures contracts
     * @returns Promise<Contract[]>
     */
    getFuturesContracts(params: {
        settle: 'btc' | 'usdt' | 'usd';
        limit?: number;
        offset?: number;
    }): Promise<FuturesContract[]>;
    /**
     * Get a single contract
     *
     * @param params Parameters for retrieving a single contract
     * @returns Promise<Contract>
     */
    getFuturesContract(params: {
        settle: 'btc' | 'usdt' | 'usd';
        contract: string;
    }): Promise<FuturesContract>;
    /**
     * Futures order book
     *
     * Bids will be sorted by price from high to low, while asks sorted reversely.
     *
     * @param params Parameters for retrieving the futures order book
     * @returns Promise<GetFuturesOrderBookResp>
     */
    getFuturesOrderBook(params: GetFuturesOrderBookReq): Promise<FuturesOrderBook>;
    /**
     * Futures trading history
     *
     * @param params Parameters for retrieving futures trading history
     * @returns Promise<GetFuturesTradesResp[]>
     */
    getFuturesTrades(params: GetFuturesTradesReq): Promise<FuturesTrade[]>;
    /**
     * Get futures Candles
     *
     * Return specified contract Candles. If prefix contract with mark_, the contract's mark price Candles are returned; if prefix with index_, index price Candles will be returned.
     *
     * Maximum of 2000 points are returned in one query. Be sure not to exceed the limit when specifying from, to and interval.
     *
     * @param params Parameters for retrieving futures Candles
     * @returns Promise<GetFuturesCandlesResp[]>
     */
    getFuturesCandles(params: GetFuturesCandlesReq): Promise<FuturesCandle[]>;
    /**
     * Premium Index K-Line
     *
     * Maximum of 1000 points can be returned in a query. Be sure not to exceed the limit when specifying from, to and interval.
     *
     * @param params Parameters for retrieving premium index K-Line
     * @returns Promise<GetPremiumIndexKLineResp[]>
     */
    getPremiumIndexKLines(params: GetFuturesCandlesReq): Promise<PremiumIndexKLine[]>;
    /**
     * List futures tickers
     *
     * @param params Parameters for listing futures tickers
     * @returns Promise<GetFuturesTickersResp[]>
     */
    getFuturesTickers(params: {
        settle: 'btc' | 'usdt' | 'usd';
        contract?: string;
    }): Promise<FuturesTicker[]>;
    /**
     * Funding rate history
     *
     * @param params Parameters for retrieving funding rate history
     * @returns Promise<{
     *   t: number;
     *   r: string;
     * }[]>
     */
    getFundingRates(params: GetFundingRatesReq): Promise<{
        t: number;
        r: string;
    }[]>;
    /**
     * Batch query historical funding rate data for perpetual contracts
     *
     * @param params settle and array of contract names
     * @returns Promise<BatchFundingRatesResponse[]>
     */
    getBatchFundingRates(params: BatchFundingRatesReq): Promise<BatchFundingRatesResponse[]>;
    /**
     * Futures insurance balance history
     *
     * @param params Parameters for retrieving futures insurance balance history
     * @returns Promise<{
     *   t: number;
     *   b: string;
     * }[]>
     */
    getFuturesInsuranceBalanceHistory(params: {
        settle: 'btc' | 'usdt' | 'usd';
        limit?: number;
    }): Promise<{
        t: number;
        b: string;
    }[]>;
    /**
     * Futures stats
     *
     * @param params Parameters for retrieving futures stats
     * @returns Promise<GetFuturesStatsResp[]>
     */
    getFuturesStats(params: GetFuturesStatsReq): Promise<FuturesStats[]>;
    /**
     * Get index constituents
     *
     * @param params Parameters for retrieving index constituents
     * @returns Promise<GetIndexConstituentsResp>
     */
    getIndexConstituents(params: {
        settle: 'btc' | 'usdt' | 'usd';
        index: string;
    }): Promise<IndexConstituents>;
    /**
     * Retrieve liquidation history
     *
     * Interval between from and to cannot exceed 3600. Some private fields will not be returned in public endpoints. Refer to field description for detail.
     *
     * @param params Parameters for retrieving liquidation history
     * @returns Promise<GetLiquidationHistoryResp[]>
     */
    getLiquidationHistory(params: GetLiquidationHistoryReq): Promise<LiquidationHistoryRecord[]>;
    /**
     * List risk limit tiers
     *
     * When the 'contract' parameter is not passed, the default is to query the risk limits for the top 100 markets.
     * 'Limit' and 'offset' correspond to pagination queries at the market level, not to the length of the returned array.
     * This only takes effect when the 'contract' parameter is empty.
     *
     * @param params Parameters for listing risk limit tiers
     * @returns Promise<GetRiskLimitTiersResp[]>
     */
    getRiskLimitTiers(params: GetRiskLimitTiersReq): Promise<RiskLimitTier[]>;
    /**
     * Query futures account
     *
     * Query account information for classic future account and unified account
     *
     * @param params Parameters for querying futures account
     * @returns Promise<GetFuturesAccountResp>
     */
    getFuturesAccount(params: {
        settle: 'btc' | 'usdt' | 'usd';
    }): Promise<FuturesAccount>;
    /**
     * Query account book
     *
     * If the contract field is provided, it can only filter records that include this field after 2023-10-30.
     *
     * @param params Parameters for querying account book
     * @returns Promise<GetFuturesAccountBookResp[]>
     */
    getFuturesAccountBook(params: GetFuturesAccountBookReq): Promise<FuturesAccountBookRecord[]>;
    /**
     * List all positions of a user
     *
     * @param params Parameters for listing all positions of a user
     * @returns Promise<Position[]>
     */
    getFuturesPositions(params: GetFuturesPositionsReq): Promise<FuturesPosition[]>;
    /**
     * Get single position
     *
     * Clarifies dual-position query method when holding both long and short positions in the same contract market
     *
     * @param params Parameters for retrieving a single position
     * @returns Promise<Position>
     */
    getFuturesPosition(params: {
        settle: 'btc' | 'usdt' | 'usd';
        contract: string;
    }): Promise<FuturesPosition>;
    /**
     * Update position margin
     *
     * Under the new risk limit rules, the position limit is related to the leverage you set; a lower leverage will result in a higher position limit. Please use the leverage adjustment api to adjust the position limit.
     *
     * @param params Parameters for updating position margin
     * @returns Promise<Position>
     */
    updateFuturesMargin(params: {
        settle: 'btc' | 'usdt' | 'usd';
        contract: string;
        change: string;
    }): Promise<FuturesPosition>;
    /**
     * Update position leverage
     *
     * Position Mode Switching Rules:
     * - leverage ≠ 0: Isolated Margin Mode (Regardless of whether cross_leverage_limit is filled, this parameter will be ignored)
     * - leverage = 0: Cross Margin Mode (Use cross_leverage_limit to set the leverage multiple)
     *
     * Examples:
     * - Set isolated margin with 10x leverage: leverage=10
     * - Set cross margin with 10x leverage: leverage=0&cross_leverage_limit=10
     * - leverage=5&cross_leverage_limit=10 → Result: Isolated margin with 5x leverage (cross_leverage_limit is ignored)
     *
     * Warning: Incorrect settings may cause unexpected position mode switching, affecting risk management.
     *
     * @param params Parameters for updating position leverage
     * @returns Promise<Position>
     */
    updateFuturesLeverage(params: {
        settle: 'btc' | 'usdt' | 'usd';
        contract: string;
        leverage: string;
        cross_leverage_limit?: string;
        pid?: number;
    }): Promise<FuturesPosition>;
    /**
     * Update position by store mode
     *
     * @param params Parameters for updating position by store mode
     * @returns Promise<FuturesPosition>
     */
    updateFuturesPositionMode(params: {
        settle: 'btc' | 'usdt';
        mode: 'ISOLATED' | 'CROSS';
        contract: string;
    }): Promise<FuturesPosition>;
    /**
     * Update position risk limit
     *
     * @param params Parameters for updating position risk limit
     * @returns Promise<Position>
     */
    updatePositionRiskLimit(params: {
        settle: 'btc' | 'usdt' | 'usd';
        contract: string;
        risk_limit: string;
    }): Promise<FuturesPosition>;
    /**
     * Enable or disable dual mode
     *
     * Before setting dual mode, make sure all positions are closed and no orders are open.
     *
     * @param params Parameters for enabling or disabling dual mode
     * @returns Promise<FuturesAccount>
     */
    updateFuturesDualMode(params: {
        settle: 'btc' | 'usdt' | 'usd';
        dual_mode: boolean;
    }): Promise<FuturesAccount>;
    /**
     * Retrieve position detail in dual mode
     *
     * @param params Parameters for retrieving position detail in dual mode
     * @returns Promise<Position[]>
     */
    getDualModePosition(params: {
        settle: 'btc' | 'usdt' | 'usd';
        contract: string;
    }): Promise<FuturesPosition[]>;
    /**
     * Update position margin in dual mode
     *
     * @param params Parameters for updating position margin in dual mode
     * @returns Promise<Position[]>
     */
    updateDualModePositionMargin(params: UpdateDualModePositionMarginReq): Promise<FuturesPosition[]>;
    /**
     * Update position leverage in dual mode
     *
     * @param params Parameters for updating position leverage in dual mode
     * @returns Promise<Position[]>
     */
    updateDualModePositionLeverage(params: UpdateDualModePositionLeverageReq): Promise<FuturesPosition[]>;
    /**
     * Update position risk limit in dual mode
     *
     * @param params Parameters for updating position risk limit in dual mode
     * @returns Promise<Position[]>
     */
    /**
     * Update position risk limit in dual mode
     *
     * See risk limit rules for more information
     *
     * @param params Parameters for updating position risk limit in dual mode
     * @returns Promise<FuturesPosition[]>
     */
    updateDualModePositionRiskLimit(params: {
        settle: 'btc' | 'usdt' | 'usd';
        contract: string;
        risk_limit: string;
    }): Promise<FuturesPosition[]>;
    /**
     * Create a futures order
     *
     * Creating futures orders requires size, which is the number of contracts instead of currency amount. You can use quanto_multiplier in the contract detail response to know how much currency 1 size contract represents.
     * Zero-filled order cannot be retrieved 10 minutes after order cancellation. You will get a 404 not found for such orders.
     * Set reduce_only to true to keep the position from changing side when reducing position size.
     * In single position mode, to close a position, you need to set size to 0 and close to true.
     * In dual position mode, to close one side position, you need to set auto_size side, reduce_only to true, and size to 0.
     * Set stp_act to decide the strategy of self-trade prevention. For detailed usage, refer to the stp_act parameter in the request body.
     *
     * NOTE: The "xGateExptime" parameter will translate to the "x-gate-exptime" header.
     *
     * @param params Parameters for creating a futures order
     * @returns Promise<FuturesOrder>
     */
    submitFuturesOrder(params: SubmitFuturesOrderReq): Promise<FuturesOrder>;
    /**
     * List futures orders
     *
     * Zero-fill order cannot be retrieved for 10 minutes after cancellation.
     * Historical orders, by default, only data within the past 6 months is supported. If you need to query data for a longer period, please use GET /futures/{settle}/orders_timerange.
     *
     * @param params Parameters for listing futures orders
     * @returns Promise<FuturesOrder[]>
     */
    getFuturesOrders(params: GetFuturesOrdersReq): Promise<FuturesOrder[]>;
    /**
     * Cancel all open orders matched
     *
     * Zero-filled order cannot be retrieved 10 minutes after order cancellation.
     *
     * NOTE: The "xGateExptime" parameter will translate to the "x-gate-exptime" header.
     *
     * @param params Parameters for cancelling all open orders matched
     * @returns Promise<FuturesOrder[]>
     */
    cancelAllFuturesOrders(params: DeleteAllFuturesOrdersReq): Promise<FuturesOrder[]>;
    /**
     * List Futures Orders By Time Range
     *
     * @param params Parameters for listing futures orders by time range
     * @returns Promise<FuturesOrder[]>
     */
    getFuturesOrdersByTimeRange(params: GetFuturesOrdersByTimeRangeReq): Promise<FuturesOrder[]>;
    /**
     * Create a batch of futures orders
     *
     * Up to 10 orders per request.
     * If any of the order's parameters are missing or in the wrong format, all of them will not be executed, and a http status 400 error will be returned directly.
     * If the parameters are checked and passed, all are executed. Even if there is a business logic error in the middle (such as insufficient funds), it will not affect other execution orders.
     * The returned result is in array format, and the order corresponds to the orders in the request body.
     * In the returned result, the succeeded field of type bool indicates whether the execution was successful or not.
     * If the execution is successful, the normal order content is included; if the execution fails, the label field is included to indicate the cause of the error.
     * In the rate limiting, each order is counted individually.
     *
     * NOTE: The "xGateExptime" parameter will translate to the "x-gate-exptime" header.
     *
     * @param params Parameters for creating a batch of futures orders
     * @returns Promise<FuturesOrder[]>
     */
    submitFuturesBatchOrders(params: {
        xGateExptime?: number;
        settle: 'btc' | 'usdt' | 'usd';
        orders: SubmitFuturesOrderReq[];
    }): Promise<FuturesOrder[]>;
    /**
     * Get a single order
     *
     * Zero-fill order cannot be retrieved for 10 minutes after cancellation.
     * Historical orders, by default, only data within the past 6 months is supported.
     *
     * @param params Parameters for retrieving a single order
     * @returns Promise<FuturesOrder>
     */
    getFuturesOrder(params: {
        settle: 'btc' | 'usdt' | 'usd';
        order_id: string;
    }): Promise<FuturesOrder>;
    /**
     * Cancel a single order
     *
     * NOTE: The "xGateExptime" parameter will translate to the "x-gate-exptime" header.
     *
     * @param params Parameters for cancelling a single order
     * @returns Promise<FuturesOrder>
     */
    cancelFuturesOrder(params: {
        xGateExptime?: number;
        settle: 'btc' | 'usdt' | 'usd';
        order_id: string;
    }): Promise<FuturesOrder>;
    /**
     * Amend an order
     *
     * NOTE: The "xGateExptime" parameter will translate to the "x-gate-exptime" header.
     *
     * @param params Parameters for amending an order
     * @returns Promise<FuturesOrder>
     */
    updateFuturesOrder(params: UpdateFuturesOrderReq): Promise<FuturesOrder>;
    /**
     * List personal trading history
     *
     * By default, only data within the past 6 months is supported. If you need to query data for a longer period, please use GET /futures/{settle}/my_trades_timerange.
     *
     * @param params Parameters for listing personal trading history
     * @returns Promise<GetFuturesTradingHistoryResp[]>
     */
    getFuturesTradingHistory(params: GetFuturesTradingHistoryReq): Promise<FuturesTradingHistoryRecord[]>;
    /**
     * List personal trading history
     *
     * This endpoint is for data longer than 6 months.
     *
     * @param params Parameters for listing personal trading history
     * @returns Promise<GetFuturesTradingHistoryResp[]>
     */
    getFuturesTradingHistoryByTimeRange(params: GetFuturesTradingHistoryByTimeRangeReq): Promise<FuturesTradingHistoryRecord[]>;
    /**
     * List position close history
     *
     * @param params Parameters for listing position close history
     * @returns Promise<GetFuturesPositionHistoryResp[]>
     */
    getFuturesPositionHistory(params: GetFuturesPositionHistoryReq): Promise<FuturesPositionHistoryRecord[]>;
    /**
     * List liquidation history
     *
     * @param params Parameters for listing liquidation history
     * @returns Promise<GetFuturesLiquidationHistoryResp[]>
     */
    getFuturesLiquidationHistory(params: GetFuturesLiquidationHistoryReq): Promise<FuturesLiquidationHistoryRecord[]>;
    /**
     * List Auto-Deleveraging History
     *
     * @param params Parameters for listing auto-deleveraging history
     * @returns Promise<GetFuturesAutoDeleveragingHistoryResp[]>
     */
    getFuturesAutoDeleveragingHistory(params: GetFuturesLiquidationHistoryReq): Promise<FuturesAutoDeleveragingHistoryRecord[]>;
    /**
     * Countdown cancel orders
     *
     * When the timeout set by the user is reached, if there is no cancel or set a new countdown, the related pending orders will be automatically cancelled. This endpoint can be called repeatedly to set a new countdown or cancel the countdown.
     * For example, call this endpoint at 30s intervals, each countdown timeout is set to 30s. If this endpoint is not called again within 30 seconds, all pending orders on the specified market will be automatically cancelled, if no market is specified, all market pending orders will be cancelled.
     * If the timeout is set to 0 within 30 seconds, the countdown timer will expire and the cancel function will be cancelled.
     *
     * @param params Parameters for setting countdown cancel orders
     * @returns Promise<{ triggerTime: number }>
     */
    setFuturesOrderCancelCountdown(params: {
        settle: 'btc' | 'usdt' | 'usd';
        timeout: number;
        contract?: string;
    }): Promise<{
        triggerTime: number;
    }>;
    /**
     * Query user trading fee rates
     *
     * @param params Parameters for querying user trading fee rates
     * @returns Promise<any>
     */
    getFuturesUserTradingFees(params: {
        settle: 'btc' | 'usdt' | 'usd';
        contract?: string;
    }): Promise<any>;
    /**
     * Cancel a batch of orders with an ID list
     *
     * Multiple distinct order ID list can be specified. Each request can cancel a maximum of 20 records.
     *
     * NOTE: The "xGateExptime" parameter will translate to the "x-gate-exptime" header.
     *
     * @param params Parameters for cancelling a batch of orders with an ID list
     * @returns Promise<DeleteFuturesBatchOrdersResp[]>
     */
    batchCancelFuturesOrders(params: {
        xGateExptime?: number;
        settle: 'btc' | 'usdt' | 'usd';
        orderIds: string[];
    }): Promise<DeleteFuturesBatchOrdersResp[]>;
    /**
     * Batch modify orders with specified IDs
     *
     * You can specify multiple different order IDs. You can only modify up to 10 orders in one request.
     *
     * NOTE: The "xGateExptime" parameter will translate to the "x-gate-exptime" header.
     *
     * @param params Array of BatchAmendOrderReq objects
     * @param settle Settlement currency (e.g., 'btc', 'usdt', 'usd')
     * @returns Promise<BatchAmendOrderResp[]>
     */
    batchUpdateFuturesOrders(params: {
        xGateExptime?: number;
        settle: 'btc' | 'usdt' | 'usd';
        orders: BatchAmendOrderReq[];
    }): Promise<BatchAmendOrderResp[]>;
    /**
     * Query risk limit table by table_id
     *
     * @param params Parameters for querying risk limit table
     * @returns Promise<RiskLimitTableTier[]>
     */
    getRiskLimitTable(params: GetRiskLimitTableReq): Promise<RiskLimitTableTier[]>;
    /**
     * Create a price-triggered order
     *
     * @param params Parameters for creating a price-triggered order
     * @returns Promise<{ id: number }>
     */
    submitFuturesPriceTriggeredOrder(params: SubmitFuturesTriggeredOrderReq): Promise<{
        id: number;
    }>;
    /**
     * List all auto orders
     *
     * @param params Parameters for listing all auto orders
     * @returns Promise<FuturesPriceTriggeredOrder[]>
     */
    getFuturesAutoOrders(params: GetFuturesAutoOrdersReq): Promise<FuturesPriceTriggeredOrder[]>;
    /**
     * Cancel all open orders
     *
     * @param params Parameters for cancelling all open orders
     * @returns Promise<FuturesPriceTriggeredOrder[]>
     */
    cancelAllOpenFuturesOrders(params: {
        settle: 'btc' | 'usdt' | 'usd';
        contract: string;
    }): Promise<FuturesPriceTriggeredOrder[]>;
    /**
     * Get a price-triggered order
     *
     * @param params Parameters for retrieving a price-triggered order
     * @returns Promise<FuturesPriceTriggeredOrder>
     */
    getFuturesPriceTriggeredOrder(params: {
        settle: 'btc' | 'usdt' | 'usd';
        order_id: string;
    }): Promise<FuturesPriceTriggeredOrder>;
    /**
     * Cancel a price-triggered order
     *
     * @param params Parameters for cancelling a price-triggered order
     * @returns Promise<FuturesPriceTriggeredOrder>
     */
    cancelFuturesPriceTriggeredOrder(params: {
        settle: 'btc' | 'usdt' | 'usd';
        order_id: string;
    }): Promise<FuturesPriceTriggeredOrder>;
    /**
     * Update a single price-triggered order
     *
     * @param params Parameters for updating a price-triggered order
     * @returns Promise<{ id: number }>
     */
    updateFuturesPriceTriggeredOrder(params: UpdateFuturesPriceTriggeredOrderReq): Promise<{
        id: number;
    }>;
    /**
     * Create trail order
     *
     * @param params settle and trail order parameters
     * @returns Promise with code, message, data containing id and timestamp
     */
    createTrailOrder(params: CreateTrailOrderReq): Promise<{
        code?: number;
        message?: string;
        data?: {
            id?: string;
            timestamp?: number;
        };
        timestamp?: number;
    }>;
    /**
     * Terminate trail order
     *
     * @param params settle and id or text
     * @returns Promise<TrailOrder>
     */
    terminateTrailOrder(params: TerminateTrailOrderReq): Promise<TrailOrder>;
    /**
     * Batch terminate trail orders
     *
     * @param params settle and optional contract, related_position
     * @returns Promise<{ orders: TrailOrder[] }>
     */
    batchTerminateTrailOrders(params: BatchTerminateTrailOrdersReq): Promise<{
        orders?: TrailOrder[];
    }>;
    /**
     * Get trail order list
     *
     * @param params query parameters
     * @returns Promise<{ orders: TrailOrder[] }>
     */
    getTrailOrderList(params: GetTrailOrderListReq): Promise<{
        orders?: TrailOrder[];
    }>;
    /**
     * Get trail order details
     *
     * @param params settle and order id
     * @returns Promise with code, message, data.order
     */
    getTrailOrderDetail(params: GetTrailOrderDetailReq): Promise<{
        code?: number;
        message?: string;
        data?: {
            order?: TrailOrder;
        };
        timestamp?: number;
    }>;
    /**
     * Update trail order
     *
     * @param params settle, id and fields to update
     * @returns Promise<TrailOrder>
     */
    updateTrailOrder(params: UpdateTrailOrderReq): Promise<TrailOrder>;
    /**
     * Get trail order user modification records
     *
     * @param params settle, id and optional pagination
     * @returns Promise<{ change_log: TrailChangeLog[] }>
     */
    getTrailOrderChangeLog(params: GetTrailOrderChangeLogReq): Promise<{
        change_log?: TrailChangeLog[];
    }>;
    getFuturesPositionCloseHistory(params: GetFuturesPositionCloseHistoryReq): Promise<FuturesPositionHistoryRecord[]>;
    getFuturesInsuranceHistory(params: GetFuturesInsuranceReq): Promise<FuturesInsuranceHistory[]>;
    /**==========================================================================================================================
     * DELIVERY
     * ==========================================================================================================================
     */
    /**
     * List all futures contracts
     *
     * @param params Parameters for listing all futures contracts
     * @returns Promise<DeliveryContract[]>
     */
    getAllDeliveryContracts(params: {
        settle: 'usdt';
    }): Promise<FuturesDeliveryContract[]>;
    /**
     * Get a single contract
     *
     * @param params Parameters for retrieving a single contract
     * @returns Promise<DeliveryContract>
     */
    getDeliveryContract(params: {
        settle: 'usdt';
        contract: string;
    }): Promise<FuturesDeliveryContract>;
    /**
     * Futures order book
     *
     * Bids will be sorted by price from high to low, while asks sorted reversely
     *
     * @param params Parameters for retrieving the futures order book
     * @returns Promise<GetDeliveryOrderBookResp>
     */
    getDeliveryOrderBook(params: GetDeliveryOrderBookReq): Promise<DeliveryOrderBook>;
    /**
     * Futures trading history
     *
     * @param params Parameters for retrieving the futures trading history
     * @returns Promise<GetDeliveryTradesResp[]>
     */
    getDeliveryTrades(params: GetDeliveryTradesReq): Promise<DeliveryTrade[]>;
    /**
     * Get futures Candles
     *
     * Return specified contract Candles. If prefix contract with mark_, the contract's mark price Candles are returned; if prefix with index_, index price Candles will be returned.
     * Maximum of 2000 points are returned in one query. Be sure not to exceed the limit when specifying from, to and interval.
     *
     * @param params Parameters for retrieving futures Candles
     * @returns Promise<GetDeliveryCandlesResp[]>
     */
    getDeliveryCandles(params: GetDeliveryCandlesReq): Promise<DeliveryCandle[]>;
    /**
     * List futures tickers
     *
     * @param params Parameters for listing futures tickers
     * @returns Promise<GetDeliveryTickersResp[]>
     */
    getDeliveryTickers(params: {
        settle: 'usdt';
        contract?: string;
    }): Promise<DeliveryTicker[]>;
    /**
     * Futures insurance balance history
     *
     * @param params Parameters for retrieving the futures insurance balance history
     * @returns Promise<{
     *   t: number;
     *   b: string;
     * }[]>
     */
    getDeliveryInsuranceBalanceHistory(params: {
        settle: 'usdt';
        limit?: number;
    }): Promise<{
        t: number;
        b: string;
    }[]>;
    /**
     * Query futures account
     *
     * @param params Parameters for querying futures account
     * @returns Promise<GetDeliveryAccountResp>
     */
    getDeliveryAccount(params: {
        settle: 'usdt';
    }): Promise<DeliveryAccount>;
    /**
     * Query account book
     *
     * @param params Parameters for querying account book
     * @returns Promise<GetDeliveryBookResp[]>
     */
    getDeliveryBook(params: GetDeliveryBookReq): Promise<DeliveryBook[]>;
    /**
     * List all positions of a user
     *
     * @param params Parameters for listing all positions of a user
     * @returns Promise<Position[]>
     */
    getDeliveryPositions(params: {
        settle: 'usdt';
    }): Promise<FuturesPosition[]>;
    /**
     * Get single position
     *
     * @param params Parameters for retrieving a single position
     * @returns Promise<Position>
     */
    getDeliveryPosition(params: {
        settle: 'usdt';
        contract: string;
    }): Promise<FuturesPosition>;
    /**
     * Update position margin
     *
     * @param params Parameters for updating position margin
     * @returns Promise<Position>
     */
    updateDeliveryMargin(params: {
        settle: 'usdt';
        contract: string;
        change: string;
    }): Promise<FuturesPosition>;
    /**
     * Update position leverage
     *
     * @param params Parameters for updating position leverage
     * @returns Promise<Position>
     */
    updateDeliveryLeverage(params: {
        settle: 'usdt';
        contract: string;
        leverage: string;
    }): Promise<FuturesPosition>;
    /**
     * Update position risk limit
     *
     * @param params Parameters for updating position risk limit
     * @returns Promise<Position>
     */
    updateDeliveryRiskLimit(params: {
        settle: 'usdt';
        contract: string;
        risk_limit: string;
    }): Promise<FuturesPosition>;
    /**
     * Create a futures order
     *
     * Zero-filled order cannot be retrieved 10 minutes after order cancellation
     *
     * @param params Parameters for creating a futures order
     * @returns Promise<FuturesOrder>
     */
    submitDeliveryOrder(params: SubmitDeliveryFuturesOrderReq): Promise<FuturesOrder>;
    /**
     * List futures orders
     *
     * Zero-fill order cannot be retrieved 10 minutes after order cancellation.
     *
     * @param params Parameters for listing futures orders
     * @returns Promise<FuturesOrder[]>
     */
    getDeliveryOrders(params: GetDeliveryOrdersReq): Promise<FuturesOrder[]>;
    /**
     * Cancel all open orders matched
     *
     * Zero-filled order cannot be retrieved 10 minutes after order cancellation
     *
     * @param params Parameters for cancelling all open orders matched
     * @returns Promise<FuturesOrder[]>
     */
    cancelAllDeliveryOrders(params: {
        settle: 'usdt';
        contract: string;
        side?: 'ask' | 'bid';
    }): Promise<FuturesOrder[]>;
    /**
     * Get a single order
     *
     * Zero-filled order cannot be retrieved 10 minutes after order cancellation
     *
     * @param params Parameters for retrieving a single order
     * @returns Promise<FuturesOrder>
     */
    getDeliveryOrder(params: {
        settle: 'usdt';
        order_id: string;
    }): Promise<FuturesOrder>;
    /**
     * Cancel a single order
     *
     * @param params Parameters for cancelling a single order
     * @returns Promise<FuturesOrder>
     */
    cancelDeliveryOrder(params: {
        settle: 'usdt';
        order_id: string;
    }): Promise<FuturesOrder>;
    /**
     * List personal trading history
     *
     * @param params Parameters for listing personal trading history
     * @returns Promise<GetDeliveryTradingHistoryResp[]>
     */
    getDeliveryTradingHistory(params: GetDeliveryTradingHistoryReq): Promise<DeliveryTradingHistoryRecord[]>;
    /**
     * List position close history
     *
     * @param params Parameters for listing position close history
     * @returns Promise<GetDeliveryClosedPositionsResp[]>
     */
    getDeliveryClosedPositions(params: GetDeliveryClosedPositionsReq): Promise<DeliveryClosedPosition[]>;
    /**
     * List liquidation history
     *
     * @param params Parameters for listing liquidation history
     * @returns Promise<GetDeliveryLiquidationHistoryResp[]>
     */
    getDeliveryLiquidationHistory(params: GetDeliveryLiquidationHistoryReq): Promise<DeliveryLiquidationHistoryRecord[]>;
    /**
     * List settlement history
     *
     * @param params Parameters for listing settlement history
     * @returns Promise<GetDeliverySettlementHistoryResp[]>
     */
    getDeliverySettlementHistory(params: GetDeliverySettlementHistoryReq): Promise<DeliverySettlementHistoryRecord[]>;
    /**
     * Create a price-triggered order
     *
     * @param params Parameters for creating a price-triggered order
     * @returns Promise<{ id: number }>
     */
    submitDeliveryTriggeredOrder(params: SubmitFuturesTriggeredOrderReq): Promise<{
        id: number;
    }>;
    /**
     * List all auto orders
     *
     * @param params Parameters for listing all auto orders
     * @returns Promise<FuturesPriceTriggeredOrder[]>
     */
    getDeliveryAutoOrders(params: GetDeliveryAutoOrdersReq): Promise<FuturesPriceTriggeredOrder[]>;
    /**
     * Cancel all open orders
     *
     * @param params Parameters for cancelling all open orders
     * @returns Promise<FuturesPriceTriggeredOrder[]>
     */
    cancelAllOpenDeliveryOrders(params: {
        settle: 'usdt';
        contract: string;
    }): Promise<FuturesPriceTriggeredOrder[]>;
    /**
     * Get a price-triggered order
     *
     * @param params Parameters for retrieving a price-triggered order
     * @returns Promise<FuturesPriceTriggeredOrder>
     */
    getDeliveryTriggeredOrder(params: {
        settle: 'usdt';
        order_id: string;
    }): Promise<FuturesPriceTriggeredOrder>;
    /**
     * Cancel a price-triggered order
     *
     * @param params Parameters for cancelling a price-triggered order
     * @returns Promise<FuturesPriceTriggeredOrder>
     */
    cancelTriggeredDeliveryOrder(params: {
        settle: 'usdt';
        order_id: string;
    }): Promise<FuturesPriceTriggeredOrder>;
    /**==========================================================================================================================
     * OPTIONS
     * ==========================================================================================================================
     */
    /**
     * List all underlyings
     *
     * @returns Promise<{ name: string; index_price: string }[]>
     */
    getOptionsUnderlyings(): Promise<{
        name: string;
        index_price: string;
    }[]>;
    /**
     * List all expiration times
     *
     * @param params Parameters for listing expiration times
     * @returns Promise<number[]>
     */
    getOptionsExpirationTimes(params: {
        underlying: string;
    }): Promise<number[]>;
    /**
     * List all the contracts with specified underlying and expiration time
     *
     * @param params Parameters for listing contracts
     * @returns Promise<GetOptionsContractsResp[]>
     */
    getOptionsContracts(params: {
        underlying: string;
        expiration?: number;
    }): Promise<OptionsContract[]>;
    /**
     * Query specified contract detail
     *
     * @param params Parameters for querying specified contract detail
     * @returns Promise<GetOptionsContractsResp>
     */
    getOptionsContract(params: {
        contract: string;
    }): Promise<OptionsContract>;
    /**
     * List settlement history
     *
     * @param params Parameters for listing settlement history
     * @returns Promise<GetOptionsSettlementHistoryResp[]>
     */
    getOptionsSettlementHistory(params: GetOptionsSettlementHistoryReq): Promise<OptionsSettlementHistoryRecord[]>;
    /**
     * Get specified contract's settlement
     *
     * @param params Parameters for retrieving specified contract's settlement
     * @returns Promise<GetOptionsSettlementHistoryResp}>
     */
    getOptionsContractSettlement(params: {
        contract: string;
        underlying: string;
        at: number;
    }): Promise<OptionsSettlementHistoryRecord>;
    /**
     * List my options settlements
     *
     * @param params Parameters for listing my options settlements
     * @returns Promise<GetOptionsMySettlementsResp[]>
     */
    getOptionsMySettlements(params: GetOptionsMySettlementsReq): Promise<OptionsUserSettlement[]>;
    /**
     * Options order book
     *
     * Bids will be sorted by price from high to low, while asks sorted reversely
     *
     * @param params Parameters for retrieving options order book
     * @returns Promise<GetOptionsOrderBookResp>
     */
    getOptionsOrderBook(params: GetOptionsOrderBookReq): Promise<OptionsOrderBook>;
    /**
     * List tickers of options contracts
     *
     * @param params Parameters for listing tickers of options contracts
     * @returns Promise<GetOptionsTickersResp[]>
     */
    getOptionsTickers(params: {
        underlying: string;
    }): Promise<OptionsTicker[]>;
    /**
     * Get underlying ticker
     *
     * @param params Parameters for retrieving underlying ticker
     * @returns Promise<{
     *   trade_put: number;
     *   trade_call: number;
     *   index_price: string;
     * }>
     */
    getOptionsUnderlyingTicker(params: {
        underlying: string;
    }): Promise<{
        trade_put: number;
        trade_call: number;
        index_price: string;
    }>;
    /**
     * Get options Candles
     *
     * @param params Parameters for retrieving options Candles
     * @returns Promise<GetOptionsCandlesResp[]>
     */
    getOptionsCandles(params: GetOptionsCandlesReq): Promise<OptionsCandle[]>;
    /**
     * Mark price Candles of an underlying
     *
     * @param params Parameters for retrieving mark price Candles of an underlying
     * @returns Promise<GetOptionsUnderlyingCandlesResp[]>
     */
    getOptionsUnderlyingCandles(params: GetOptionsUnderlyingCandlesReq): Promise<OptionsUnderlyingCandle[]>;
    /**
     * Options trade history
     *
     * @param params Parameters for retrieving options trade history
     * @returns Promise<GetOptionsTradesResp[]>
     */
    getOptionsTrades(params: GetOptionsTradesReq): Promise<OptionsTrade[]>;
    /**
     * List options account
     *
     * Indicates support for querying both classic options accounts and unified accounts
     *
     * @returns Promise<GetOptionsAccountResp>
     */
    getOptionsAccount(): Promise<OptionsAccount>;
    /**
     * List account changing history
     *
     * @param params Parameters for listing account changing history
     * @returns Promise<GetOptionsAccountChangeResp[]>
     */
    getOptionsAccountChange(params?: GetOptionsAccountChangeReq): Promise<OptionsAccountChangeRecord[]>;
    /**
     * List user's positions of specified underlying
     *
     * @param params Parameters for listing user's positions of specified underlying
     * @returns Promise<GetOptionsPositionsUnderlyingResp[]>
     */
    getOptionsPositionsUnderlying(params: {
        underlying?: string;
    }): Promise<OptionsPositionsUnderlying[]>;
    /**
     * Get specified contract position
     *
     * @param params Parameters for retrieving specified contract position
     * @returns Promise<GetOptionsPositionsUnderlyingResp>
     */
    getOptionsPositionContract(params: {
        contract: string;
    }): Promise<OptionsPositionsUnderlying>;
    /**
     * List user's liquidation history of specified underlying
     *
     * @param params Parameters for listing user's liquidation history of specified underlying
     * @returns Promise<GetOptionsLiquidationResp[]>
     */
    getOptionsLiquidation(params: {
        underlying: string;
        contract?: string;
    }): Promise<GetOptionsLiquidationResp[]>;
    /**
     * Create an options order
     *
     * @param params Parameters for creating an options order
     * @returns Promise<SubmitOptionsOrderResp>
     */
    submitOptionsOrder(params: SubmitOptionsOrderReq): Promise<SubmitOptionsOrderResp>;
    /**
     * List options orders
     *
     * @param params Parameters for listing options orders
     * @returns Promise<SubmitOptionsOrderResp[]>
     */
    getOptionsOrders(params: GetOptionsOrdersReq): Promise<SubmitOptionsOrderResp[]>;
    /**
     * Cancel all open orders matched
     *
     * @param params Parameters for canceling all open orders matched
     * @returns Promise<SubmitOptionsOrderResp[]>
     */
    cancelAllOpenOptionsOrders(params: {
        contract?: string;
        underlying?: string;
        side?: 'ask' | 'bid';
    }): Promise<SubmitOptionsOrderResp[]>;
    /**
     * Get a single order
     *
     * @param params Parameters for retrieving a single order
     * @returns Promise<SubmitOptionsOrderResp>
     */
    getOptionsOrder(params: {
        order_id: number;
    }): Promise<SubmitOptionsOrderResp>;
    /**
     * Cancel a single order
     *
     * @param params Parameters for canceling a single order
     * @returns Promise<SubmitOptionsOrderResp>
     */
    cancelOptionsOrder(params: {
        order_id: number;
    }): Promise<SubmitOptionsOrderResp>;
    /**
     * Countdown cancel orders for options
     *
     * Option order heartbeat detection. When the timeout set by the user is reached,
     * if there is no cancel or new countdown set, related pending orders will be
     * automatically cancelled. This endpoint can be called repeatedly to set a new
     * countdown or cancel the countdown.
     *
     * @param params Parameters for setting countdown cancel orders
     * @returns Promise<{
     *   triggerTime: number;
     * }>
     */
    submitOptionsCountdownCancel(params: {
        timeout: number;
        contract?: string;
        underlying?: string;
    }): Promise<{
        triggerTime: number;
    }>;
    /**
     * List personal trading history
     *
     * @param params Parameters for listing personal trading history
     * @returns Promise<GetOptionsPersonalHistoryResp[]>
     */
    getOptionsPersonalHistory(params: GetOptionsPersonalHistoryReq): Promise<OptionsUserHistoryRecord[]>;
    /**
     * Set MMP (Market Maker Protection) settings
     *
     * @param params Parameters for setting MMP settings
     * @returns Promise<OptionsMMPSetings>
     */
    setOptionsMMPSettings(params: OptionsMMPSettingsReq): Promise<OptionsMMPSettings>;
    /**
     * Query MMP (Market Maker Protection) settings
     *
     * @param params Parameters for querying MMP settings
     * @returns Promise<OptionsMMPSetings[]>
     */
    getOptionsMMPSettings(params?: {
        underlying?: string;
    }): Promise<OptionsMMPSettings[]>;
    /**
     * Reset MMP (Market Maker Protection) settings
     *
     * @param params Parameters for resetting MMP settings
     * @returns Promise<OptionsMMPSettings>
     */
    resetOptionsMMPSettings(params: {
        underlying: string;
    }): Promise<OptionsMMPSettings>;
    /**==========================================================================================================================
     * EARN UNI
     * ==========================================================================================================================
     */
    /**
     * List currencies for lending
     *
     * @returns Promise<GetLendingCurrenciesResp[]>
     */
    getLendingCurrencies(): Promise<LendingCurrency[]>;
    /**
     * Get currency detail for lending
     *
     * @param params Parameters for retrieving currency detail for lending
     * @returns Promise<GetLendingCurrenciesResp>
     */
    getLendingCurrency(params: {
        currency: string;
    }): Promise<LendingCurrency>;
    /**
     * Lend or redeem
     *
     * @param params Parameters for lending or redeeming
     * @returns Promise<any>
     */
    submitLendOrRedeemOrder(params: SubmitLendOrRedeemReq): Promise<any>;
    /**
     * List user's lending orders
     *
     * @param params Parameters for listing user's lending orders
     * @returns Promise<GetLendingOrdersResp[]>
     */
    getLendingOrders(params?: GetLendingOrdersReq): Promise<LendingOrder[]>;
    /**
     * Amend lending order
     *
     * Currently only supports amending the minimum interest rate (hour)
     *
     * @param params Parameters for amending lending order
     * @returns Promise<any>
     */
    updateLendingOrder(params: {
        currency?: string;
        min_rate?: string;
    }): Promise<any>;
    /**
     * List records of lending
     *
     * @param params Parameters for listing records of lending
     * @returns Promise<GetLendingRecordsResp[]>
     */
    getLendingRecords(params?: GetLendingRecordsReq): Promise<LendingRecord[]>;
    /**
     * Get the user's total interest income of specified currency
     *
     * @param params Parameters for retrieving the user's total interest income of specified currency
     * @returns Promise<{
     *   currency: string;
     *   interest: string;
     * }>
     */
    getLendingTotalInterest(params: {
        currency: string;
    }): Promise<{
        currency: string;
        interest: string;
    }>;
    /**
     * List interest records
     *
     * @param params Parameters for listing interest records
     * @returns Promise<GetLendingInterestRecordsResp[]>
     */
    getLendingInterestRecords(params?: GetLendingInterestRecordsReq): Promise<LendingInterestRecord[]>;
    /**
     * Set interest reinvestment toggle
     * @deprecated as of v4.99.0, 23-06-2025
     *
     * @param params Parameters for setting interest reinvestment toggle
     * @returns Promise<any>
     */
    updateInterestReinvestment(params: {
        currency: string;
        status: boolean;
    }): Promise<any>;
    /**
     * Query currency interest compounding status
     *
     * @param params Parameters for querying currency interest compounding status
     * @returns Promise<{
     *   currency: string;
     *   interest_status: string;
     * }>
     */
    getLendingInterestStatus(params: {
        currency: string;
    }): Promise<{
        currency: string;
        interest_status: string;
    }>;
    /**
     * UniLoan currency annualized trend chart
     *
     * Get the annualized interest rate trend chart data for a specific currency
     *
     * @param params Parameters for retrieving the annualized trend chart
     * @returns Promise<{ time: number; value: string }[]>
     */
    getLendingAnnualizedTrendChart(params: {
        from: number;
        to: number;
        asset: string;
    }): Promise<{
        time: number;
        value: string;
    }[]>;
    getLendingEstimatedRates(): Promise<{
        currency: string;
        est_rate: string;
    }[]>;
    /**==========================================================================================================================
     * MULTI COLLATERAL LOAN
     * ==========================================================================================================================
     */
    /**
     * Create Multi-Collateral Order
     *
     * @param params Parameters for creating a multi-collateral order
     * @returns Promise<{ order_id: number }>
     */
    submitMultiLoanOrder(params: SubmitMultiLoanOrderReq): Promise<{
        order_id: number;
    }>;
    /**
     * List Multi-Collateral Orders
     *
     * @param params Parameters for listing multi-collateral orders
     * @returns Promise<GetMultiLoanOrdersResp[]>
     */
    getMultiLoanOrders(params?: GetMultiLoanOrdersReq): Promise<MultiLoanOrder[]>;
    /**
     * Get Multi-Collateral Order Detail
     *
     * @param params Parameters for retrieving a multi-collateral order detail
     * @returns Promise<GetMultiLoanOrdersResp>
     */
    getMultiLoanOrder(params: {
        order_id: string;
    }): Promise<MultiLoanOrder>;
    /**
     * Repay Multi-Collateral Loan
     *
     * @param params Parameters for repaying a multi-collateral loan
     * @returns Promise<RepayMultiLoanResp>
     */
    repayMultiLoan(params: RepayMultiLoanReq): Promise<RepayMultiLoanResp>;
    /**
     * List Multi-Collateral Repay Records
     *
     * @param params Parameters for listing multi-collateral repay records
     * @returns Promise<GetMultiLoanRepayRecordsResp[]>
     */
    getMultiLoanRepayRecords(params: GetMultiLoanRepayRecordsReq): Promise<MultiLoanRepayRecord[]>;
    /**
     * Operate Multi-Collateral
     *
     * @param params Parameters for operating multi-collateral
     * @returns Promise<UpdateMultiLoanResp>
     */
    updateMultiLoan(params: UpdateMultiLoanReq): Promise<UpdateMultiLoanResp>;
    /**
     * Query collateral adjustment records
     *
     * @param params Parameters for querying collateral adjustment records
     * @returns Promise<GetMultiLoanAdjustmentRecordsResp[]>
     */
    getMultiLoanAdjustmentRecords(params?: GetMultiLoanAdjustmentRecordsReq): Promise<MultiLoanAdjustmentRecord[]>;
    /**
     * List User Currency Quota
     *
     * @param params Parameters for listing user currency quota
     * @returns Promise<GetMultiLoanCurrencyQuotaResp[]>
     */
    getMultiLoanCurrencyQuota(params: {
        type: 'collateral' | 'borrow';
        currency: string;
    }): Promise<MultiLoanCurrencyQuota[]>;
    /**
     * Query supported borrowing and collateral currencies in Multi-Collateral
     *
     * @returns Promise<GetMultiLoanSupportedCurrenciesResp>
     */
    getMultiLoanSupportedCurrencies(): Promise<MultiLoanSupportedCurrencies>;
    /**
     * Get Multi-Collateral ratio
     *
     * @returns Promise<GetMultiLoanRatioResp>
     */
    getMultiLoanRatio(): Promise<MultiLoanRatio>;
    /**
     * Query fixed interest rates for the currency for 7 days and 30 days
     *
     * @returns Promise<GetMultiLoanFixedRatesResp[]>
     */
    getMultiLoanFixedRates(): Promise<MultiLoanFixedRate[]>;
    /**
     * Query the current interest rate of currencies
     *
     * Query the current interest rate of currencies in the last hour.
     * The current interest rate is updated every hour.
     *
     * @param params Parameters containing currencies to query and optional VIP level
     * @returns Promise<MultiLoanCurrentRate[]>
     */
    getMultiLoanCurrentRates(params: {
        currencies: string[];
        vip_level?: string;
    }): Promise<{
        currency: string;
        current_rate: string;
    }[]>;
    /**==========================================================================================================================
     * EARN
     * ==========================================================================================================================
     */
    /**
     * ETH swap (formerly ETH2 swap)
     * @param params Parameters for ETH swap (1 - ETH to GTETH, 2 - GTETH to ETH)
     * @returns Promise<any>
     */
    submitEth2Swap(params: {
        side: '1' | '2';
        amount: string;
    }): Promise<any>;
    /**
     * Get GTETH historical rate of return data (formerly ETH2)
     *
     * @returns Promise<Array<{date_time: number, date: string, rate: string}>>
     */
    getEth2RateHistory(): Promise<{
        date_time: number;
        date: string;
        rate: string;
    }[]>;
    /**
     * Dual Investment product list
     *
     * @returns Promise<GetDualInvestmentProductsResp[]>
     */
    getDualInvestmentProducts(params?: {
        plan_id?: string;
    }): Promise<DualInvestmentProduct[]>;
    /**
     * Dual Investment order list
     *
     * @returns Promise<GetDualInvestmentOrdersResp[]>
     */
    getDualInvestmentOrders(params?: FromToPageLimit): Promise<DualInvestmentOrder[]>;
    /**
     * Place Dual Investment order
     *
     * @param params plan_id, amount (or copies), optional text
     * @returns Promise<DualInvestmentOrder>
     */
    submitDualInvestmentOrder(params: PlaceDualInvestmentOrderParams): Promise<DualInvestmentOrder>;
    /**
     * Structured Product List
     *
     * @param params Parameters for listing structured products
     * @returns Promise<GetStructuredProductListResp[]>
     */
    getStructuredProducts(params: GetStructuredProductListReq): Promise<StructuredProduct[]>;
    /**
     * Structured Product Order List
     *
     * @param params Parameters for listing structured product orders
     * @returns Promise<GetStructuredProductOrdersResp[]>
     */
    getStructuredProductOrders(params?: GetStructuredProductOrdersReq): Promise<StructuredProductOrder[]>;
    /**
     * Place Structured Product Order
     *
     * @param params Parameters for placing a structured product order
     * @returns Promise<any>
     */
    submitStructuredProductOrder(params: {
        pid?: string;
        amount?: string;
    }): Promise<any>;
    /**
     * List staking coins
     *
     * @param params Parameters for listing staking coins
     * @returns Promise<string[]>
     */
    getStakingCoins(params?: {
        coin?: string;
        cointype?: string;
    }): Promise<string[]>;
    /**
     * On-chain Token Swap for Earned Coins
     *
     * @param params Parameters for staking swap
     * @returns Promise<any>
     */
    submitStakingSwap(params: {
        coin: string;
        side: '0' | '1';
        amount: string;
        pid?: number;
    }): Promise<any>;
    /**==========================================================================================================================
     * ACCOUNT
     * ==========================================================================================================================
     */
    /**
     * Get account detail
     *
     * @returns Promise<GetAccountDetailResp>
     */
    getAccountDetail(): Promise<AccountDetail>;
    /**
     * Get user transaction rate limit information
     *
     * @returns Promise<AccountRateLimit[]>
     */
    getAccountRateLimit(): Promise<AccountRateLimit[]>;
    /**
     * Create STP Group
     *
     * @param params Parameters for creating an STP group
     * @returns Promise<CreateStpGroupResp>
     */
    createStpGroup(params: CreateStpGroupReq): Promise<StpGroup>;
    /**
     * List STP Groups
     *
     * @param params Parameters for listing STP groups
     * @returns Promise<CreateStpGroupResp[]>
     */
    getStpGroups(params?: {
        name?: string;
    }): Promise<StpGroup[]>;
    /**
     * List users of the STP group
     *
     * @param params Parameters for listing users of the STP group
     * @returns Promise<StpResp[]>
     */
    getStpGroupUsers(params: {
        stp_id: number;
    }): Promise<StpGroupUser[]>;
    /**
     * Add users to the STP group
     *
     * @param params Parameters for adding users to the STP group
     * @returns Promise<StpResp[]>
     */
    addUsersToStpGroup(params: {
        stp_id: number;
        body: number[];
    }): Promise<StpGroupUser[]>;
    /**
     * Delete the user in the STP group
     *
     * @param params Parameters for deleting users from the STP group
     * @returns Promise<StpResp[]>
     */
    deleteUserFromStpGroup(params: {
        stp_id: number;
        user_id: number;
    }): Promise<StpGroupUser[]>;
    /**
     * Set GT deduction
     *
     * Enable or disable GT deduction for the current account.
     *
     * @param params Parameters for setting GT deduction
     * @returns Promise<void>
     */
    setGTDeduction(params: {
        enabled: boolean;
    }): Promise<void>;
    /**
     * Query GT deduction configuration
     *
     * Query the current GT deduction configuration for the account.
     *
     * @returns Promise<{ enabled: boolean }>
     */
    getGTDeduction(): Promise<{
        enabled: boolean;
    }>;
    /**
     * Query all main account API key information
     *
     * @returns Promise<AccountMainKey[]>
     */
    getAccountMainKeys(): Promise<AccountMainKey[]>;
    /**==========================================================================================================================
     * REBATES
     * ==========================================================================================================================
     */
    /**
     * The agency obtains the transaction history of the recommended user.
     * Record time range cannot exceed 30 days.
     *
     * @param params Parameters for retrieving transaction history
     * @returns Promise<GetAgencyTransactionHistoryResp>
     */
    getAgencyTransactionHistory(params: GetAgencyTransactionHistoryReq): Promise<{
        total: number;
        list: AgencyTransactionHistoryRecord[];
    }>;
    /**
     * The agency obtains the commission history of the recommended user.
     * Record time range cannot exceed 30 days.
     *
     * @param params Parameters for retrieving commission history
     * @returns Promise<GetAgencyCommissionHistoryResp>
     */
    getAgencyCommissionHistory(params: GetAgencyCommissionHistoryReq): Promise<{
        total: number;
        list: AgencyCommissionHistoryRecord[];
    }>;
    /**
     * Partner obtains transaction records of recommended users
     *
     * Record time range cannot exceed 30 days.
     *
     * @param params Parameters for retrieving transaction records
     * @returns Promise<GetPartnerTransactionHistoryResp>
     */
    getPartnerTransactionHistory(params?: PartnerTransactionReq): Promise<{
        total: number;
        list: PartnerTransaction[];
    }>;
    /**
     * Partner obtains commission records of recommended users
     *
     * Record time range cannot exceed 30 days.
     *
     * @param params Parameters for retrieving commission records
     * @returns Promise<GetPartnerCommissionHistoryResp>
     */
    getPartnerCommissionHistory(params?: PartnerTransactionReq): Promise<{
        total: number;
        list: PartnerCommission[];
    }>;
    /**
     * Partner subordinate list
     *
     * Including sub-agents, direct customers, indirect customers
     *
     * @param params Parameters for retrieving partner subordinate list
     * @returns Promise<{
     *   total: number;
     *   list: {
     *     user_id: number;
     *     user_join_time: number;
     *     type: number;
     *     desc: string;
     *   }[];
     * }>
     */
    getPartnerSubordinateList(params?: GetPartnerSubordinateListReq): Promise<{
        total: number;
        list: PartnerSubordinate[];
    }>;
    /**
     * The broker obtains the user's commission rebate records.
     * Record time range cannot exceed 30 days.
     *
     * @param params Parameters for retrieving commission rebate records
     * @returns Promise<GetBrokerCommissionHistoryResp>
     */
    getBrokerCommissionHistory(params: GetBrokerCommissionHistoryReq): Promise<{
        total: number;
        list: BrokerCommissionHistoryRecord[];
    }>;
    /**
     * The broker obtains the user's trading history.
     * Record time range cannot exceed 30 days.
     *
     * @param params Parameters for retrieving trading history
     * @returns Promise<GetBrokerTransactionHistoryResp>
     */
    getBrokerTransactionHistory(params: GetBrokerTransactionHistoryReq): Promise<{
        total: number;
        list: BrokerTransactionHistoryRecord[];
    }>;
    /**
     * User retrieves rebate information.
     */
    getUserRebateInfo(): Promise<{
        invite_uid: number;
    }>;
    /**
     * Query user-subordinate relationship
     *
     * Checks whether specified users are in the system and their relationship status
     */
    getUserSubordinateRelationships(params: {
        user_id_list: string;
    }): Promise<{
        list: {
            uid: number;
            belong: string;
            type: number;
            ref_uid: number;
        }[];
    }>;
    /**==========================================================================================================================
     * OTC
     * ==========================================================================================================================
     */
    /**
     * Fiat and stablecoin quote
     *
     * Create fiat and stablecoin quotes, supporting both PAY and GET directions
     *
     * @param params Quote parameters
     * @returns Promise with quote details including rate, amounts, and quote_token
     */
    createOTCQuote(params: CreateOTCQuoteReq): Promise<CreateOTCQuoteResp>;
    /**
     * Create fiat order
     *
     * Create a fiat order, supporting BUY for on-ramp and SELL for off-ramp
     *
     * @param params Fiat order parameters
     * @returns Promise with order creation confirmation
     */
    createOTCFiatOrder(params: CreateOTCFiatOrderReq): Promise<CreateOTCFiatOrderResp>;
    /**
     * Create stablecoin order
     *
     * Create stablecoin order
     *
     * @param params Stablecoin order parameters
     * @returns Promise with order creation confirmation
     */
    createOTCStablecoinOrder(params: CreateOTCStablecoinOrderReq): Promise<CreateOTCStablecoinOrderResp>;
    /**
     * Get user's default bank account information
     *
     * Get user's default bank account information for order placement
     *
     * @returns Promise with default bank account details
     */
    getOTCUserDefaultBank(): Promise<GetOTCUserDefaultBankResp>;
    /**
     * Mark fiat order as paid
     *
     * Mark fiat order as paid
     *
     * @param params Parameters with order_id
     * @returns Promise with confirmation
     */
    markOTCOrderAsPaid(params: MarkOTCOrderAsPaidReq): Promise<MarkOTCOrderAsPaidResp>;
    /**
     * Fiat order cancellation
     *
     * Cancel fiat order
     *
     * @param params Parameters with order_id
     * @returns Promise with cancellation confirmation
     */
    cancelOTCOrder(params: CancelOTCOrderReq): Promise<CancelOTCOrderResp>;
    /**
     * Fiat order list
     *
     * Query the fiat order list with filters such as type, currency, time range, and status
     *
     * @param params Filter parameters for fiat order list
     * @returns Promise with paginated fiat order list
     */
    getOTCFiatOrderList(params?: GetOTCFiatOrderListReq): Promise<GetOTCFiatOrderListResp>;
    /**
     * Stablecoin order list
     *
     * Query stablecoin order list with filtering by currency, time range, status, etc.
     *
     * @param params Filter parameters for stablecoin order list
     * @returns Promise with paginated stablecoin order list
     */
    getOTCStablecoinOrderList(params?: GetOTCStablecoinOrderListReq): Promise<GetOTCStablecoinOrderListResp>;
    /**
     * Fiat order details
     *
     * Query fiat order details
     *
     * @param params Parameters with order_id
     * @returns Promise with fiat order details
     */
    getOTCFiatOrderDetail(params: GetOTCFiatOrderDetailReq): Promise<GetOTCFiatOrderDetailResp>;
    /**==========================================================================================================================
     * P2P MERCHANT
     * ==========================================================================================================================
     */
    /**
     * Get account information
     */
    getP2PMerchantUserInfo(): Promise<P2PMerchantApiResp<P2PMerchantUserInfo>>;
    /**
     * Get counterparty information
     */
    getP2PMerchantCounterpartyUserInfo(params: P2PMerchantGetCounterpartyUserInfoReq): Promise<P2PMerchantApiResp<P2PMerchantCounterpartyUserInfo>>;
    /**
     * Get payment method list
     */
    getP2PMerchantMyselfPayment(params?: P2PMerchantGetMyselfPaymentReq): Promise<P2PMerchantApiResp<P2PMerchantPaymentMethod[]>>;
    /**
     * Get pending orders
     */
    getP2PMerchantPendingTransactionList(params: P2PMerchantGetPendingTransactionListReq): Promise<P2PMerchantApiResp<P2PMerchantTransactionListData>>;
    /**
     * Get completed/historical orders
     */
    getP2PMerchantCompletedTransactionList(params: P2PMerchantGetCompletedTransactionListReq): Promise<P2PMerchantApiResp<P2PMerchantTransactionListData>>;
    /**
     * Get order details
     */
    getP2PMerchantTransactionDetails(params: P2PMerchantGetTransactionDetailsReq): Promise<P2PMerchantApiResp<P2PMerchantTransactionDetails>>;
    /**
     * Confirm payment
     */
    confirmP2PMerchantPayment(params: P2PMerchantConfirmPaymentReq): Promise<P2PMerchantApiResp<Record<string, unknown>>>;
    /**
     * Confirm receipt
     */
    confirmP2PMerchantReceipt(params: P2PMerchantConfirmReceiptReq): Promise<P2PMerchantApiResp<Record<string, unknown>>>;
    /**
     * Cancel order
     */
    cancelP2PMerchantTransaction(params: P2PMerchantCancelTransactionReq): Promise<P2PMerchantApiResp<Record<string, unknown>>>;
    /**
     * Place ad order
     */
    placeP2PMerchantBizPushOrder(params: P2PMerchantPlaceBizPushOrderReq): Promise<P2PMerchantApiResp<Record<string, unknown>>>;
    /**
     * Update ad status
     */
    updateP2PMerchantAdsStatus(params: P2PMerchantAdsUpdateStatusReq): Promise<P2PMerchantApiResp<{
        status: number;
    }>>;
    /**
     * Get ad details
     */
    getP2PMerchantAdsDetail(params: P2PMerchantAdsDetailReq): Promise<P2PMerchantApiResp<P2PMerchantAdsDetail>>;
    /**
     * Get my ads list
     */
    getP2PMerchantMyAdsList(params?: P2PMerchantMyAdsListReq): Promise<P2PMerchantApiResp<P2PMerchantMyAdsListData>>;
    /**
     * Get advertisement list
     */
    getP2PMerchantAdsList(params: P2PMerchantGetAdsListReq): Promise<P2PMerchantApiResp<P2PMerchantAdsListItem[]>>;
    /**
     * Get chat history
     */
    getP2PMerchantChatsList(params: P2PMerchantGetChatsListReq): Promise<P2PMerchantApiResp<P2PMerchantChatsListData>>;
    /**
     * Send chat message
     */
    sendP2PMerchantChatMessage(params: P2PMerchantSendChatMessageReq): Promise<P2PMerchantApiResp<{
        SRVTM: number;
    }>>;
    /**
     * Upload chat file
     */
    uploadP2PMerchantChatFile(params: P2PMerchantUploadChatFileReq): Promise<P2PMerchantApiResp<{
        file_key: string;
    }>>;
    /**==========================================================================================================================
     * CROSSEX
     * ==========================================================================================================================
     */
    /**
     * Query Trading Pair Information
     *
     * Query trading pair information for cross-exchange trading
     *
     * @param params Optional parameters to filter symbols
     * @returns Promise with array of symbol information
     */
    getCrossExSymbols(params?: GetCrossExSymbolsReq): Promise<CrossExSymbol[]>;
    /**
     * Query Risk Limit Information
     *
     * Query risk limit information for futures/margin trading pairs
     *
     * @param params Parameters with required symbols
     * @returns Promise with array of risk limit information
     */
    getCrossExRiskLimits(params: GetCrossExRiskLimitsReq): Promise<CrossExRiskLimit[]>;
    /**
     * Query Supported Transfer Currencies
     *
     * Query supported transfer currencies for cross-exchange
     *
     * @param params Optional currency filter
     * @returns Promise with array of transfer coin information
     */
    getCrossExTransferCoins(params?: GetCrossExTransferCoinsReq): Promise<CrossExTransferCoin[]>;
    /**
     * Fund Transfer
     *
     * Transfer funds between accounts. Rate limit: 10 requests per 10 seconds
     *
     * @param params Transfer parameters
     * @returns Promise with transfer confirmation
     */
    createCrossExTransfer(params: CreateCrossExTransferReq): Promise<CreateCrossExTransferResp>;
    /**
     * Query Fund Transfer History
     *
     * Query fund transfer history. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional filter parameters
     * @returns Promise with array of transfer history records
     */
    getCrossExTransferHistory(params?: GetCrossExTransferHistoryReq): Promise<CrossExTransferHistory[]>;
    /**
     * Create an order
     *
     * Create an order for cross-exchange trading. Rate Limit: 100 requests per 10 seconds
     *
     * @param params Order parameters
     * @returns Promise with order creation response
     */
    createCrossExOrder(params: CreateCrossExOrderReq): Promise<CreateCrossExOrderResp>;
    /**
     * Cancel Order
     *
     * Cancel an order. Rate Limit: 100 requests per 10 seconds
     *
     * @param order_id Order ID or Text for Cancel Order
     * @returns Promise with cancellation confirmation
     */
    cancelCrossExOrder(order_id: string): Promise<CancelCrossExOrderResp>;
    /**
     * Modify Order
     *
     * Modify an existing order. Rate Limit: 100 requests per 10 seconds
     *
     * @param order_id Order ID or Text for Modify Order
     * @param params Modification parameters
     * @returns Promise with modification confirmation
     */
    modifyCrossExOrder(order_id: string, params: ModifyCrossExOrderReq): Promise<ModifyCrossExOrderResp>;
    /**
     * Query order details
     *
     * Query order details by order ID or custom text. Rate Limit: 200 requests per 10 seconds
     *
     * @param order_id Order ID or custom text
     * @returns Promise with order details
     */
    getCrossExOrder(order_id: string): Promise<CrossExOrder>;
    /**
     * Flash Swap Inquiry
     *
     * Create a flash swap quote. Rate Limit: 100 requests per day
     *
     * @param params Quote parameters
     * @returns Promise with quote details
     */
    createCrossExConvertQuote(params: CreateCrossExConvertQuoteReq): Promise<CreateCrossExConvertQuoteResp>;
    /**
     * Flash Swap Transaction
     *
     * Execute a flash swap transaction. Rate limit: 10 requests per 10 seconds
     *
     * @param params Parameters with quote_id
     * @returns Promise with transaction confirmation
     */
    createCrossExConvertOrder(params: CreateCrossExConvertOrderReq): Promise<{}>;
    /**
     * Modify Account Contract Position Mode and Account Mode
     *
     * Modify account settings. Rate Limit: 100 requests per 60 seconds
     *
     * @param params Account modification parameters
     * @returns Promise with update confirmation
     */
    updateCrossExAccount(params: UpdateCrossExAccountReq): Promise<UpdateCrossExAccountResp>;
    /**
     * Query Account Assets
     *
     * Query account assets and balances. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional exchange_type filter
     * @returns Promise with account information
     */
    getCrossExAccounts(params?: GetCrossExAccountsReq): Promise<CrossExAccount>;
    /**
     * Modify Contract Trading Pair Leverage Multiplier
     *
     * Modify leverage for contract trading pair. Rate Limit: 100 requests per 10 seconds
     *
     * @param params Leverage modification parameters
     * @returns Promise with leverage update confirmation
     */
    setCrossExPositionLeverage(params: SetCrossExPositionLeverageReq): Promise<SetCrossExPositionLeverageResp>;
    /**
     * Query Contract Trading Pair Leverage Multiplier
     *
     * Query leverage for contract trading pairs. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional symbols filter
     * @returns Promise with array of leverage information
     */
    getCrossExPositionLeverage(params?: GetCrossExPositionLeverageReq): Promise<CrossExPositionLeverage[]>;
    /**
     * Modify Leveraged Trading Pair Leverage Multiplier
     *
     * Modify leverage for margin trading pair. Rate Limit: 100 requests per 10 seconds
     *
     * @param params Leverage modification parameters
     * @returns Promise with leverage update confirmation
     */
    setCrossExMarginPositionLeverage(params: SetCrossExMarginPositionLeverageReq): Promise<SetCrossExMarginPositionLeverageResp>;
    /**
     * Query Leveraged Trading Pair Leverage Multiplier
     *
     * Query leverage for margin trading pairs. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional symbols filter
     * @returns Promise with array of leverage information
     */
    getCrossExMarginPositionLeverage(params?: GetCrossExMarginPositionLeverageReq): Promise<CrossExMarginPositionLeverage[]>;
    /**
     * Full Close Position
     *
     * Fully close a position. Rate Limit: 100 requests per day
     *
     * @param params Position close parameters
     * @returns Promise with close position confirmation
     */
    closeCrossExPosition(params: CloseCrossExPositionReq): Promise<CloseCrossExPositionResp>;
    /**
     * Query margin asset interest rates
     *
     * Query interest rates for margin assets. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional filter parameters
     * @returns Promise with array of interest rates
     */
    getCrossExInterestRate(params?: GetCrossExInterestRateReq): Promise<CrossExInterestRate[]>;
    /**
     * Query User Fee Rates
     *
     * Query user fee rates. Rate Limit: 200 requests per 10 seconds
     *
     * @returns Promise with fee rate information
     */
    getCrossExFeeRate(): Promise<CrossExFeeRate>;
    /**
     * Query Contract Positions
     *
     * Query contract positions. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional filter parameters
     * @returns Promise with array of positions
     */
    getCrossExPositions(params?: GetCrossExPositionsReq): Promise<CrossExPosition[]>;
    /**
     * Query Leveraged Positions
     *
     * Query margin/leveraged positions. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional filter parameters
     * @returns Promise with array of margin positions
     */
    getCrossExMarginPositions(params?: GetCrossExMarginPositionsReq): Promise<CrossExMarginPosition[]>;
    /**
     * Query ADL Position Reduction Ranking
     *
     * Query ADL position reduction ranking. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Parameters with required symbol
     * @returns Promise with array of ADL rankings
     */
    getCrossExAdlRank(params: GetCrossExAdlRankReq): Promise<CrossExAdlRank[]>;
    /**
     * Query All Current Open Orders
     *
     * Query all current open orders. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional filter parameters
     * @returns Promise with array of open orders
     */
    getCrossExOpenOrders(params?: GetCrossExOpenOrdersReq): Promise<CrossExOrder[]>;
    /**
     * Query order history
     *
     * Query historical orders. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional filter parameters
     * @returns Promise with array of historical orders
     */
    getCrossExHistoryOrders(params?: GetCrossExHistoryOrdersReq): Promise<CrossExOrder[]>;
    /**
     * Query Contract Position History
     *
     * Query contract position history. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional filter parameters
     * @returns Promise with array of historical positions
     */
    getCrossExHistoryPositions(params?: GetCrossExHistoryPositionsReq): Promise<CrossExHistoryPosition[]>;
    /**
     * Query Leveraged Position History
     *
     * Query margin position history. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional filter parameters
     * @returns Promise with array of historical margin positions
     */
    getCrossExHistoryMarginPositions(params?: GetCrossExHistoryMarginPositionsReq): Promise<CrossExHistoryMarginPosition[]>;
    /**
     * Query Leveraged Interest Deduction History
     *
     * Query margin interest deduction history. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional filter parameters
     * @returns Promise with array of interest deduction records
     */
    getCrossExHistoryMarginInterests(params?: GetCrossExHistoryMarginInterestsReq): Promise<CrossExHistoryMarginInterest[]>;
    /**
     * Query filled history
     *
     * Query trade execution history. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional filter parameters
     * @returns Promise with array of trade records
     */
    getCrossExHistoryTrades(params?: GetCrossExHistoryTradesReq): Promise<CrossExHistoryTrade[]>;
    /**
     * Query Account Asset Change History
     *
     * Query account balance change history. Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional filter parameters
     * @returns Promise with array of account book records
     */
    getCrossExAccountBook(params?: GetCrossExAccountBookReq): Promise<CrossExAccountBook[]>;
    /**
     * Query currency discount rate
     *
     * Query currency discount rate (for margin currency in isolated exchange mode). Rate Limit: 200 requests per 10 seconds
     *
     * @param params Optional filter parameters
     * @returns Promise with array of coin discount rates
     */
    getCrossExCoinDiscountRate(params?: GetCrossExCoinDiscountRateReq): Promise<CrossExCoinDiscountRate[]>;
    /**==========================================================================================================================
     * ALPHA
     * ==========================================================================================================================
     */
    /**
     * Query position assets
     *
     * Query alpha account position assets
     *
     * @returns Promise with array of account balances
     */
    getAlphaAccounts(): Promise<AlphaAccount[]>;
    /**
     * Query asset transactions
     *
     * Query alpha account transaction history
     *
     * @param params Parameters with required from timestamp
     * @returns Promise with array of transaction records
     */
    getAlphaAccountBook(params: GetAlphaAccountBookReq): Promise<AlphaAccountBook[]>;
    /**
     * Alpha Quote API
     *
     * Get a quote for alpha trading. Quote is valid for 1 minute. Rate-limited at 10 requests per second per user.
     *
     * @param params Quote parameters
     * @returns Promise with quote details
     */
    createAlphaQuote(params: CreateAlphaQuoteReq): Promise<CreateAlphaQuoteResp>;
    /**
     * Alpha Order API
     *
     * Create an alpha order. Rate-limited at 5 requests per second per user.
     *
     * @param params Order parameters including quote_id
     * @returns Promise with order details
     */
    createAlphaOrder(params: CreateAlphaOrderReq): Promise<CreateAlphaOrderResp>;
    /**
     * Alpha Order List API
     *
     * Query alpha order list with filters
     *
     * @param params Filter parameters
     * @returns Promise with array of orders
     */
    getAlphaOrders(params: GetAlphaOrdersReq): Promise<AlphaOrder[]>;
    /**
     * Alpha Single Order Query API
     *
     * Query a single alpha order by order ID
     *
     * @param params Parameters with order_id
     * @returns Promise with order details
     */
    getAlphaOrder(params: GetAlphaOrderReq): Promise<AlphaOrder>;
    /**
     * Query currency information
     *
     * Query alpha currency information. When currency is provided, returns specific currency info; otherwise returns paginated list.
     *
     * @param params Optional filter parameters
     * @returns Promise with array of currency information
     */
    getAlphaCurrencies(params?: GetAlphaCurrenciesReq): Promise<AlphaCurrency[]>;
    /**
     * Query currency ticker
     *
     * Query alpha currency ticker. When currency is provided, returns specific ticker; otherwise returns paginated list.
     *
     * @param params Optional filter parameters
     * @returns Promise with array of ticker information
     */
    getAlphaTickers(params?: GetAlphaTickersReq): Promise<AlphaTicker[]>;
    getTradFiMT5Account(): Promise<TradFiApiResp<TradFiMT5Account>>;
    getTradFiSymbolCategories(): Promise<TradFiApiResp<TradFiListData<TradFiCategoryItem>>>;
    getTradFiSymbols(): Promise<TradFiApiResp<TradFiListData<TradFiSymbolItem>>>;
    getTradFiSymbolDetail(params: TradFiGetSymbolDetailParams): Promise<TradFiApiResp<TradFiListData<TradFiSymbolDetailItem>>>;
    getTradFiKlines(symbol: string, params: TradFiGetKlinesParams): Promise<TradFiApiResp<TradFiListData<TradFiKlineItem>>>;
    getTradFiTicker(symbol: string): Promise<TradFiApiResp<TradFiTicker>>;
    createTradFiUser(): Promise<TradFiApiResp<TradFiCreateUserResult>>;
    getTradFiAssets(): Promise<TradFiApiResp<TradFiAssets>>;
    createTradFiTransaction(params: TradFiCreateTransactionReq): Promise<TradFiApiResp<Record<string, never>>>;
    getTradFiTransactions(params?: TradFiGetTransactionsParams): Promise<TradFiApiResp<TradFiTransactionListData>>;
    createTradFiOrder(params: TradFiCreateOrderReq): Promise<TradFiApiResp<TradFiCreateOrderResult>>;
    getTradFiOrders(): Promise<TradFiApiResp<TradFiListData<TradFiOrderItem>>>;
    modifyTradFiOrder(orderId: number, params: TradFiModifyOrderReq): Promise<TradFiApiResp<TradFiModifyOrderResult>>;
    cancelTradFiOrder(orderId: number): Promise<Record<string, never>>;
    getTradFiOrderHistory(params?: TradFiGetOrderHistoryParams): Promise<TradFiApiResp<TradFiListData<TradFiOrderHistoryItem>>>;
    getTradFiPositions(): Promise<TradFiApiResp<TradFiListData<TradFiPositionItem>>>;
    modifyTradFiPosition(positionId: number, params: TradFiModifyPositionReq): Promise<TradFiApiResp<Record<string, never>>>;
    closeTradFiPosition(positionId: number, params: TradFiClosePositionReq): Promise<TradFiApiResp<Record<string, never>>>;
    getTradFiPositionHistory(params?: TradFiGetPositionHistoryParams): Promise<TradFiApiResp<TradFiListData<TradFiPositionHistoryItem>>>;
}
