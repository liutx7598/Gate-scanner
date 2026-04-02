import { DefaultLogger } from './lib/logger.js';
import { WSClientConfigurableOptions } from './types/websockets/client.js';
import { WSAPIFuturesOrder, WSAPIFuturesOrderAmendReq, WSAPIFuturesOrderBatchPlaceRespItem, WSAPIFuturesOrderCancelCPReq, WSAPIFuturesOrderCancelIdsRespItem, WSAPIFuturesOrderCancelReq, WSAPIFuturesOrderListReq, WSAPIFuturesOrderPlaceReq, WSAPIFuturesOrderStatusReq, WSAPIResponse, WSAPISpotOrder, WSAPISpotOrderAmendReq, WSAPISpotOrderCancelCPReq, WSAPISpotOrderCancelIdsReq, WSAPISpotOrderCancelIdsRespItem, WSAPISpotOrderCancelReq, WSAPISpotOrderListReq, WSAPISpotOrderPlaceReq, WSAPISpotOrderStatusReq, WSAPIWsKey } from './types/websockets/wsAPI.js';
import { WebsocketClient } from './WebsocketClient.js';
/**
 * Configurable options specific to only the REST-like WebsocketAPIClient
 */
export interface WSAPIClientConfigurableOptions {
    /**
     * Default: true
     *
     * Attach default event listeners, which will console log any high level
     * events (opened/reconnecting/reconnected/etc).
     *
     * If you disable this, you should set your own event listeners
     * on the embedded WS Client `wsApiClient.getWSClient().on(....)`.
     */
    attachEventListeners: boolean;
}
/**
 * This is a minimal Websocket API wrapper around the WebsocketClient.
 *
 * Some methods support passing in a custom "wsKey". This is a reference to which WS connection should
 * be used to transmit that message. This is only useful if you wish to use an alternative wss
 * domain that is supported by the SDK.
 *
 * Note: To use testnet, don't set the wsKey - use `testnet: true` in
 * the constructor instead.
 *
 * Note: You can also directly use the sendWSAPIRequest() method to make WS API calls, but some
 * may find the below methods slightly more intuitive.
 *
 * Refer to the WS API promises example for a more detailed example on using sendWSAPIRequest() directly:
 * https://github.com/tiagosiebler/gateio-api/blob/master/examples/ws-private-spot-wsapi.ts#L119
 */
export declare class WebsocketAPIClient {
    private wsClient;
    private options;
    constructor(options?: WSClientConfigurableOptions & Partial<WSAPIClientConfigurableOptions>, logger?: DefaultLogger);
    getWSClient(): WebsocketClient;
    setTimeOffsetMs(newOffset: number): void;
    /**
     * Submit a spot order
     */
    submitNewSpotOrder(params: WSAPISpotOrderPlaceReq, wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPISpotOrder>>;
    /**
     * Cancel a spot order
     */
    cancelSpotOrder(params: WSAPISpotOrderCancelReq, wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPISpotOrder>>;
    /**
     * Cancel all spot orders with the given id list
     */
    cancelSpotOrderById(params: WSAPISpotOrderCancelIdsReq[], wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPISpotOrderCancelIdsRespItem[]>>;
    /**
     * Cancel a spot order for a given symbol
     */
    cancelSpotOrderForSymbol(params: WSAPISpotOrderCancelCPReq, wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPISpotOrder[]>>;
    /**
     * Update a spot order
     */
    updateSpotOrder(params: WSAPISpotOrderAmendReq, wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPISpotOrder>>;
    /**
     * Get the status of a spot order
     */
    getSpotOrderStatus(params: WSAPISpotOrderStatusReq, wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPISpotOrder>>;
    /**
     * Get all spot orders
     */
    getSpotOrders(params: WSAPISpotOrderListReq, wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPISpotOrder[]>>;
    /**
     * Submit a futures order.
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    submitNewFuturesOrder(params: WSAPIFuturesOrderPlaceReq, wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPIFuturesOrder>>;
    /**
     * Submit a batch of futures orders
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    submitNewFuturesBatchOrder(params: WSAPIFuturesOrderPlaceReq[], wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPIFuturesOrderBatchPlaceRespItem[]>>;
    /**
     * Cancel a futures order
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    cancelFuturesOrder(params: WSAPIFuturesOrderCancelReq, wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPIFuturesOrder>>;
    /**
     * Cancel futures orders by id list
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    cancelFuturesOrderById(params: string[], wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPIFuturesOrderCancelIdsRespItem[]>>;
    /**
     * Cancel all open futures orders
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    cancelFuturesAllOpenOrders(params: WSAPIFuturesOrderCancelCPReq, wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPIFuturesOrder[]>>;
    /**
     * Update a futures order
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    updateFuturesOrder(params: WSAPIFuturesOrderAmendReq, wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPIFuturesOrder>>;
    /**
     * Get all futures orders
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    getFuturesOrders(params: WSAPIFuturesOrderListReq, wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPIFuturesOrder[]>>;
    /**
     * Get futures order status
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    getFuturesOrderStatus(params: WSAPIFuturesOrderStatusReq, wsKey?: WSAPIWsKey): Promise<WSAPIResponse<WSAPIFuturesOrder>>;
    /**
     *
     *
     *
     *
     *
     *
     *
     * Private methods for handling some of the convenience/automation provided by the WS API Client
     *
     *
     *
     *
     *
     *
     *
     */
    private setupDefaultEventListeners;
}
