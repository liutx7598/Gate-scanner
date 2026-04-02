import { WS_KEY_MAP } from './lib/websocket/websocket-util.js';
import { WebsocketClient } from './WebsocketClient.js';
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
export class WebsocketAPIClient {
    wsClient;
    options;
    constructor(options, logger) {
        this.wsClient = new WebsocketClient(options, logger);
        this.options = {
            attachEventListeners: true,
            ...options,
        };
        this.setupDefaultEventListeners();
    }
    getWSClient() {
        return this.wsClient;
    }
    setTimeOffsetMs(newOffset) {
        return this.getWSClient().setTimeOffsetMs(newOffset);
    }
    /*
     *
     * SPOT - Trading requests
     *
     */
    /**
     * Submit a spot order
     */
    submitNewSpotOrder(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.spotV4, 'spot.order_place', params);
    }
    /**
     * Cancel a spot order
     */
    cancelSpotOrder(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.spotV4, 'spot.order_cancel', params);
    }
    /**
     * Cancel all spot orders with the given id list
     */
    cancelSpotOrderById(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.spotV4, 'spot.order_cancel_ids', params);
    }
    /**
     * Cancel a spot order for a given symbol
     */
    cancelSpotOrderForSymbol(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.spotV4, 'spot.order_cancel_cp', params);
    }
    /**
     * Update a spot order
     */
    updateSpotOrder(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.spotV4, 'spot.order_amend', params);
    }
    /**
     * Get the status of a spot order
     */
    getSpotOrderStatus(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.spotV4, 'spot.order_status', params);
    }
    /**
     * Get all spot orders
     */
    getSpotOrders(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.spotV4, 'spot.order_list', params);
    }
    /*
     *
     * Futures - Trading requests
     *
     */
    /**
     * Submit a futures order.
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    submitNewFuturesOrder(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.perpFuturesUSDTV4, 'futures.order_place', params);
    }
    /**
     * Submit a batch of futures orders
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    submitNewFuturesBatchOrder(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.perpFuturesUSDTV4, 'futures.order_batch_place', params);
    }
    /**
     * Cancel a futures order
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    cancelFuturesOrder(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.perpFuturesUSDTV4, 'futures.order_cancel', params);
    }
    /**
     * Cancel futures orders by id list
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    cancelFuturesOrderById(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.perpFuturesUSDTV4, 'futures.order_cancel_ids', params);
    }
    /**
     * Cancel all open futures orders
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    cancelFuturesAllOpenOrders(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.perpFuturesUSDTV4, 'futures.order_cancel_cp', params);
    }
    /**
     * Update a futures order
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    updateFuturesOrder(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.perpFuturesUSDTV4, 'futures.order_amend', params);
    }
    /**
     * Get all futures orders
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    getFuturesOrders(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.perpFuturesUSDTV4, 'futures.order_list', params);
    }
    /**
     * Get futures order status
     *
     * Note: without a wsKey, this defaults to the perpFuturesUSDTV4 connection
     */
    getFuturesOrderStatus(params, wsKey) {
        return this.wsClient.sendWSAPIRequest(wsKey || WS_KEY_MAP.perpFuturesUSDTV4, 'futures.order_status', params);
    }
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
    setupDefaultEventListeners() {
        if (this.options.attachEventListeners) {
            /**
             * General event handlers for monitoring the WebsocketClient
             */
            this.wsClient
                .on('open', (data) => {
                console.log(new Date(), 'ws connected', data.wsKey);
            })
                .on('reconnect', ({ wsKey }) => {
                console.log(new Date(), 'ws automatically reconnecting.... ', wsKey);
            })
                .on('reconnected', (data) => {
                console.log(new Date(), 'ws has reconnected ', data?.wsKey);
            })
                .on('authenticated', (data) => {
                console.info(new Date(), 'ws has authenticated ', data?.wsKey);
            })
                .on('exception', (data) => {
                try {
                    // Blind JSON.stringify can fail on circular references
                    console.error(new Date(), 'ws exception: ', JSON.stringify(data));
                }
                catch {
                    console.error(new Date(), 'ws exception: ', data);
                }
            });
        }
    }
}
//# sourceMappingURL=WebsocketAPIClient.js.map