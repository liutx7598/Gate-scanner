"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WS_BASE_URL_MAP = exports.WS_KEY_MAP = void 0;
exports.neverGuard = neverGuard;
exports.getPromiseRefForWSAPIRequest = getPromiseRefForWSAPIRequest;
exports.getPrivateSpotTopics = getPrivateSpotTopics;
exports.getPrivateFuturesTopics = getPrivateFuturesTopics;
exports.getPrivateOptionsTopics = getPrivateOptionsTopics;
exports.safeTerminateWs = safeTerminateWs;
/**
 * Should be one WS key per unique URL. Some URLs may need a suffix.
 */
exports.WS_KEY_MAP = {
    /**
     * Spot & Margin
     * https://www.gate.io/docs/developers/apiv4/ws/en/
     */
    spotV4: 'spotV4',
    /**
     * Perpetual futures (USDT)
     * https://www.gate.io/docs/developers/futures/ws/en/#gate-io-futures-websocket-v4
     */
    perpFuturesUSDTV4: 'perpFuturesUSDTV4',
    /**
     * Perpetual futures (BTC)
     * https://www.gate.io/docs/developers/futures/ws/en/#gate-io-futures-websocket-v4
     */
    perpFuturesBTCV4: 'perpFuturesBTCV4',
    /**
     * Delivery Futures (USDT)
     * https://www.gate.io/docs/developers/delivery/ws/en/
     */
    deliveryFuturesUSDTV4: 'deliveryFuturesUSDTV4',
    /**
     * Delivery Futures (BTC)
     * https://www.gate.io/docs/developers/delivery/ws/en/
     */
    deliveryFuturesBTCV4: 'deliveryFuturesBTCV4',
    /**
     * Options
     * https://www.gate.io/docs/developers/options/ws/en/
     */
    optionsV4: 'optionsV4',
    /**
     * Announcements V4
     * https://www.gate.io/docs/developers/options/ws/en/
     */
    announcementsV4: 'announcementsV4',
};
exports.WS_BASE_URL_MAP = {
    spotV4: {
        livenet: 'wss://api.gateio.ws/ws/v4/',
        testnet: 'NoTestnetForSpotWebsockets!',
    },
    perpFuturesUSDTV4: {
        livenet: 'wss://fx-ws.gateio.ws/v4/ws/usdt',
        testnet: 'wss://ws-testnet.gate.com/v4/ws/futures/usdt',
    },
    perpFuturesBTCV4: {
        livenet: 'wss://fx-ws.gateio.ws/v4/ws/btc',
        testnet: 'wss://fx-ws-testnet.gateio.ws/v4/ws/btc',
    },
    deliveryFuturesUSDTV4: {
        livenet: 'wss://fx-ws.gateio.ws/v4/ws/delivery/usdt',
        testnet: 'wss://fx-ws-testnet.gateio.ws/v4/ws/delivery/usdt',
    },
    deliveryFuturesBTCV4: {
        livenet: 'wss://fx-ws.gateio.ws/v4/ws/delivery/btc',
        testnet: 'wss://fx-ws-testnet.gateio.ws/v4/ws/delivery/btc',
    },
    optionsV4: {
        livenet: 'wss://op-ws.gateio.live/v4/ws',
        testnet: 'wss://op-ws-testnet.gateio.live/v4/ws',
    },
    announcementsV4: {
        livenet: 'wss://api.gateio.ws/ws/v4/ann',
        testnet: 'NoTestnetForAnnouncementsWebSockets!',
    },
};
function neverGuard(x, msg) {
    return new Error(`Unhandled value exception "${x}", ${msg}`);
}
/**
 * WS API promises are stored using a primary key. This key is constructed using
 * properties found in every request & reply.
 */
function getPromiseRefForWSAPIRequest(requestEvent) {
    const promiseRef = [requestEvent.channel, requestEvent.payload?.req_id].join('_');
    return promiseRef;
}
function getPrivateSpotTopics() {
    // Consumeable channels for spot
    const privateSpotTopics = [
        'spot.orders',
        'spot.usertrades',
        'spot.balances',
        'spot.margin_balances',
        'spot.funding_balances',
        'spot.cross_balances',
        'spot.priceorders',
    ];
    // WebSocket API for spot
    const privateSpotWSAPITopics = [
        'spot.login',
        'spot.order_place',
        'spot.order_cancel',
        'spot.order_cancel_ids',
        'spot.order_cancel_cp',
        'spot.order_amend',
        'spot.order_status',
    ];
    return [...privateSpotTopics, ...privateSpotWSAPITopics];
}
function getPrivateFuturesTopics() {
    // These are the same for perps vs delivery futures
    const privatePerpetualFuturesTopics = [
        'futures.orders',
        'futures.usertrades',
        'futures.liquidates',
        'futures.auto_deleverages',
        'futures.position_closes',
        'futures.balances',
        'futures.reduce_risk_limits',
        'futures.positions',
        'futures.autoorders',
    ];
    const privatePerpetualFuturesWSAPITopics = [
        'futures.login',
        'futures.order_place',
        'futures.order_batch_place',
        'futures.order_cancel',
        'futures.order_cancel_cp',
        'futures.order_amend',
        'futures.order_list',
        'futures.order_status',
    ];
    return [
        ...privatePerpetualFuturesTopics,
        ...privatePerpetualFuturesWSAPITopics,
    ];
}
function getPrivateOptionsTopics() {
    const privateOptionsTopics = [
        'options.orders',
        'options.usertrades',
        'options.liquidates',
        'options.user_settlements',
        'options.position_closes',
        'options.balances',
        'options.positions',
    ];
    return [...privateOptionsTopics];
}
/**
 * ws.terminate() is undefined in browsers.
 * This only works in node.js, not in browsers.
 * Does nothing if `ws` is undefined. Does nothing in browsers.
 */
function safeTerminateWs(ws, fallbackToClose) {
    if (!ws) {
        return false;
    }
    if (typeof ws['terminate'] === 'function') {
        ws.terminate();
        return true;
    }
    else if (fallbackToClose) {
        ws.close();
    }
    return false;
}
//# sourceMappingURL=websocket-util.js.map