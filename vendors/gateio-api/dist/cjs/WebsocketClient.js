"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketClient = exports.WS_LOGGER_CATEGORY = void 0;
const BaseWSClient_js_1 = require("./lib/BaseWSClient.js");
const misc_util_js_1 = require("./lib/misc-util.js");
const requestUtils_js_1 = require("./lib/requestUtils.js");
const webCryptoAPI_js_1 = require("./lib/webCryptoAPI.js");
const websocket_util_js_1 = require("./lib/websocket/websocket-util.js");
exports.WS_LOGGER_CATEGORY = { category: 'gate-ws' };
class WebsocketClient extends BaseWSClient_js_1.BaseWebsocketClient {
    /**
     * Request connection of all dependent (public & private) websockets, instead of waiting for automatic connection by library.
     *
     * Returns array of promises that individually resolve when each connection is successfully opened.
     */
    connectAll() {
        return [
            this.connect(websocket_util_js_1.WS_KEY_MAP.spotV4),
            this.connect(websocket_util_js_1.WS_KEY_MAP.perpFuturesUSDTV4),
            this.connect(websocket_util_js_1.WS_KEY_MAP.deliveryFuturesUSDTV4),
            this.connect(websocket_util_js_1.WS_KEY_MAP.optionsV4),
            this.connect(websocket_util_js_1.WS_KEY_MAP.announcementsV4),
        ];
    }
    /**
     * Ensures the WS API connection is active and ready.
     *
     * You do not need to call this, but if you call this before making any WS API requests,
     * it can accelerate the first request (by preparing the connection in advance).
     */
    connectWSAPI(wsKey, skipAuth) {
        if (skipAuth) {
            return this.assertIsConnected(wsKey);
        }
        /** This call automatically ensures the connection is active AND authenticated before resolving */
        return this.assertIsAuthenticated(wsKey);
    }
    /**
     * Request subscription to one or more topics. Pass topics as either an array of strings, or array of objects (if the topic has parameters).
     * Objects should be formatted as {topic: string, params: object}.
     *
     * - Subscriptions are automatically routed to the correct websocket connection.
     * - Authentication/connection is automatic.
     * - Resubscribe after network issues is automatic.
     *
     * Call `unsubscribe(topics)` to remove topics
     */
    subscribe(requests, wsKey) {
        if (!Array.isArray(requests)) {
            this.subscribeTopicsForWsKey([requests], wsKey);
            return;
        }
        if (requests.length) {
            this.subscribeTopicsForWsKey(requests, wsKey);
        }
    }
    /**
     * Unsubscribe from one or more topics. Similar to subscribe() but in reverse.
     *
     * - Requests are automatically routed to the correct websocket connection.
     * - These topics will be removed from the topic cache, so they won't be subscribed to again.
     */
    unsubscribe(requests, wsKey) {
        if (!Array.isArray(requests)) {
            this.unsubscribeTopicsForWsKey([requests], wsKey);
            return;
        }
        if (requests.length) {
            this.unsubscribeTopicsForWsKey(requests, wsKey);
        }
    }
    async sendWSAPIRequest(wsKey, channel, params, requestFlags) {
        this.logger.trace(`sendWSAPIRequest(): assert "${wsKey}" is connected`);
        await this.assertIsConnected(wsKey);
        // Some commands don't require authentication.
        if (requestFlags?.authIsOptional !== true) {
            // this.logger.trace('sendWSAPIRequest(): assertIsAuthenticated(${wsKey})...');
            await this.assertIsAuthenticated(wsKey);
            // this.logger.trace('sendWSAPIRequest(): assertIsAuthenticated(${wsKey}) ok');
        }
        const timestampBeforeAuth = Date.now();
        const signTimestamp = Date.now() + this.options.recvWindow;
        const timeInSeconds = +(signTimestamp / 1000).toFixed(0);
        const requestEvent = {
            time: timeInSeconds,
            // id: timeInSeconds,
            channel,
            event: 'api',
            payload: {
                req_id: this.getNewRequestId(),
                req_header: {
                    'X-Gate-Channel-Id': requestUtils_js_1.CHANNEL_ID,
                },
                api_key: this.options.apiKey,
                req_param: params ? params : '',
                timestamp: `${timeInSeconds}`,
            },
        };
        const timestampAfterAuth = Date.now();
        /**
         * Some WS API requests require a timestamp to be included. assertIsConnected and assertIsAuthenticated
         * can introduce a small delay before the actual request is sent, if not connected before that request is
         * made. This can lead to a curious race condition, where the request timestamp is before
         * the "authorizedSince" timestamp - as such, binance does not recognise the session as already authenticated.
         *
         * The below mechanism measures any delay introduced from the assert calls, and if the request includes a timestamp,
         * it offsets that timestamp by the delay.
         */
        const delayFromAuthAssert = timestampAfterAuth - timestampBeforeAuth;
        if (delayFromAuthAssert && requestEvent.payload?.timestamp) {
            requestEvent.payload.timestamp += delayFromAuthAssert;
            this.logger.trace(`sendWSAPIRequest(): adjust timestamp - delay seen by connect/auth assert and delayed request includes timestamp, adjusting timestamp by ${delayFromAuthAssert}ms`);
        }
        // Sign request
        const signedEvent = await this.signWSAPIRequest(requestEvent);
        // Store deferred promise
        const promiseRef = (0, websocket_util_js_1.getPromiseRefForWSAPIRequest)(requestEvent);
        const deferredPromise = this.getWsStore().createDeferredPromise(wsKey, promiseRef, false);
        // Enrich returned promise with request context for easier debugging
        deferredPromise.promise
            ?.then((res) => {
            if (!Array.isArray(res)) {
                res.request = {
                    wsKey: wsKey,
                    ...signedEvent,
                };
            }
            return res;
        })
            .catch((e) => {
            if (typeof e === 'string') {
                this.logger.error('unexpcted string', { e });
                return e;
            }
            e.request = {
                wsKey: wsKey,
                channel,
                payload: signedEvent.payload,
            };
            // throw e;
            return e;
        });
        // Send event
        const throwExceptions = true;
        this.tryWsSend(wsKey, JSON.stringify(signedEvent), throwExceptions);
        this.logger.trace(`sendWSAPIRequest(): sent "${channel}" event with promiseRef(${promiseRef})`);
        // Return deferred promise, so caller can await this call
        return deferredPromise.promise;
    }
    /**
     *
     * Internal methods - not intended for public use
     *
     */
    getWsUrl(wsKey) {
        if (this.options.wsUrl) {
            return this.options.wsUrl;
        }
        const useTestnet = this.options.useTestnet;
        const networkKey = useTestnet ? 'testnet' : 'livenet';
        const baseUrl = websocket_util_js_1.WS_BASE_URL_MAP[wsKey][networkKey];
        return baseUrl;
    }
    sendPingEvent(wsKey) {
        let pingChannel;
        switch (wsKey) {
            case 'deliveryFuturesBTCV4':
            case 'deliveryFuturesUSDTV4':
            case 'perpFuturesBTCV4':
            case 'perpFuturesUSDTV4': {
                pingChannel = 'futures.ping';
                break;
            }
            case 'announcementsV4': {
                pingChannel = 'announcement.ping';
                break;
            }
            case 'optionsV4': {
                pingChannel = 'options.ping';
                break;
            }
            case 'spotV4': {
                pingChannel = 'spot.ping';
                break;
            }
            default: {
                throw (0, misc_util_js_1.neverGuard)(wsKey, `Unhandled WsKey "${wsKey}"`);
            }
        }
        const signTimestamp = Date.now() + this.options.recvWindow;
        const timeInS = (signTimestamp / 1000).toFixed(0);
        return this.tryWsSend(wsKey, `{ "time": ${timeInS}, "channel": "${pingChannel}" }`);
    }
    sendPongEvent(wsKey) {
        try {
            this.logger.trace('Sending upstream ws PONG: ', {
                ...exports.WS_LOGGER_CATEGORY,
                wsMessage: 'PONG',
                wsKey,
            });
            if (!wsKey) {
                throw new Error('Cannot send PONG, no wsKey provided');
            }
            const wsState = this.getWsStore().get(wsKey);
            if (!wsState || !wsState?.ws) {
                throw new Error(`Cannot send pong, ${wsKey} socket not connected yet`);
            }
            // Send a protocol layer pong
            wsState.ws.pong();
        }
        catch (e) {
            this.logger.error('Failed to send WS PONG', {
                ...exports.WS_LOGGER_CATEGORY,
                wsMessage: 'PONG',
                wsKey,
                exception: e,
            });
        }
    }
    // NOT IN USE for gate.io, pings for gate are protocol layer pings
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isWsPing(_msg) {
        return false;
    }
    isWsPong(msg) {
        if (typeof msg?.data === 'string' && msg.data.includes('.pong"')) {
            return true;
        }
        return false;
    }
    /**
     * Parse incoming events into categories, before emitting to the user
     */
    resolveEmittableEvents(wsKey, event) {
        const results = [];
        try {
            const parsed = JSON.parse(event.data);
            const responseEvents = ['subscribe', 'unsubscribe'];
            const authenticatedEvents = ['auth'];
            const eventHeaders = parsed?.header;
            const eventChannel = eventHeaders?.channel;
            const eventType = eventHeaders?.event;
            const eventStatusCode = eventHeaders?.status;
            const requestId = parsed?.request_id;
            const promiseRef = [eventChannel, requestId].join('_');
            const eventAction = parsed.event || parsed.action || parsed?.header?.data || parsed.channel;
            if (eventType === 'api') {
                const isError = eventStatusCode !== '200';
                // WS API Exception
                if (isError) {
                    try {
                        this.getWsStore().rejectDeferredPromise(wsKey, promiseRef, {
                            wsKey,
                            ...parsed,
                        }, true);
                    }
                    catch (e) {
                        this.logger.error('Exception trying to reject WSAPI promise', {
                            wsKey,
                            promiseRef,
                            parsedEvent: parsed,
                            error: e,
                        });
                    }
                    results.push({
                        eventType: 'exception',
                        event: parsed,
                    });
                    return results;
                }
                // WS API Success
                try {
                    this.getWsStore().resolveDeferredPromise(wsKey, promiseRef, {
                        wsKey,
                        ...parsed,
                    }, true);
                }
                catch (e) {
                    this.logger.error('Exception trying to resolve WSAPI promise', {
                        wsKey,
                        promiseRef,
                        parsedEvent: parsed,
                        error: e,
                    });
                }
                if (eventChannel.includes('.login')) {
                    results.push({
                        eventType: 'authenticated',
                        event: {
                            ...parsed,
                            isWSAPI: true,
                            WSAPIAuthChannel: eventChannel,
                        },
                    });
                }
                results.push({
                    eventType: 'response',
                    event: parsed,
                });
                return results;
            }
            if (typeof eventAction === 'string') {
                if (parsed.success === false) {
                    results.push({
                        eventType: 'exception',
                        event: parsed,
                    });
                    return results;
                }
                // Most events use "event: 'update'" for topic updates
                // The legacy "futures.order_book" topic uses "all" for this field
                // 'futures.obu' is used for the orderbook v2 event. Oddly in a different structure than the other topics.
                if (['update', 'all', 'futures.obu'].includes(eventAction)) {
                    results.push({
                        eventType: 'update',
                        event: parsed,
                    });
                    return results;
                }
                // These are request/reply pattern events (e.g. after subscribing to topics or authenticating)
                if (responseEvents.includes(eventAction)) {
                    results.push({
                        eventType: 'response',
                        event: parsed,
                    });
                    return results;
                }
                // Request/reply pattern for authentication success
                if (authenticatedEvents.includes(eventAction)) {
                    results.push({
                        eventType: 'authenticated',
                        event: parsed,
                    });
                    return results;
                }
                this.logger.error(`!! Unhandled string event type "${eventAction}". Defaulting to "update" channel...`, parsed);
            }
            else {
                this.logger.error(`!! Unhandled non-string event type "${eventAction}". Defaulting to "update" channel...`, parsed);
            }
            results.push({
                eventType: 'update',
                event: parsed,
            });
        }
        catch (e) {
            results.push({
                event: {
                    message: 'Failed to parse event data due to exception',
                    exception: e,
                    eventData: event.data,
                },
                eventType: 'exception',
            });
            this.logger.error('Failed to parse event data due to exception: ', {
                exception: e,
                eventData: event.data,
            });
        }
        return results;
    }
    /**
     * Determines if a topic is for a private channel, using a hardcoded list of strings
     */
    isPrivateTopicRequest(request, wsKey) {
        const topicName = request?.topic?.toLowerCase();
        if (!topicName) {
            return false;
        }
        switch (wsKey) {
            case 'spotV4':
                return (0, websocket_util_js_1.getPrivateSpotTopics)().includes(topicName);
            case 'perpFuturesBTCV4':
            case 'perpFuturesUSDTV4':
            case 'deliveryFuturesBTCV4':
            case 'deliveryFuturesUSDTV4':
                return (0, websocket_util_js_1.getPrivateFuturesTopics)().includes(topicName);
            case 'optionsV4':
                return (0, websocket_util_js_1.getPrivateOptionsTopics)().includes(topicName);
            // No private announcements channels
            case 'announcementsV4':
                return false;
            default:
                throw (0, misc_util_js_1.neverGuard)(wsKey, `Unhandled WsKey "${wsKey}"`);
        }
    }
    /**
     * Not in use for gate.io
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getWsMarketForWsKey(_wsKey) {
        return 'all';
    }
    /**
     * Not in use for gate.io
     */
    getPrivateWSKeys() {
        return [];
    }
    isAuthOnConnectWsKey(wsKey) {
        return this.getPrivateWSKeys().includes(wsKey);
    }
    /** Force subscription requests to be sent in smaller batches, if a number is returned */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getMaxTopicsPerSubscribeEvent(_wsKey) {
        return 1;
    }
    /**
     * Map one or more topics into fully prepared "subscribe request" events (already stringified and ready to send)
     */
    async getWsOperationEventsForTopics(topics, wsKey, operation) {
        // console.log(new Date(), `called getWsSubscribeEventsForTopics()`, topics);
        // console.trace();
        if (!topics.length) {
            return [];
        }
        // Events that are ready to send (usually stringified JSON)
        const jsonStringEvents = [];
        const market = this.getWsMarketForWsKey(wsKey);
        const maxTopicsPerEvent = this.getMaxTopicsPerSubscribeEvent(wsKey);
        if (maxTopicsPerEvent &&
            maxTopicsPerEvent !== null &&
            topics.length > maxTopicsPerEvent) {
            for (let i = 0; i < topics.length; i += maxTopicsPerEvent) {
                const batch = topics.slice(i, i + maxTopicsPerEvent);
                const subscribeRequestEvents = await this.getWsRequestEvents(market, operation, batch, wsKey);
                for (const event of subscribeRequestEvents) {
                    jsonStringEvents.push(JSON.stringify(event));
                }
            }
            return jsonStringEvents;
        }
        const subscribeRequestEvents = await this.getWsRequestEvents(market, operation, topics, wsKey);
        for (const event of subscribeRequestEvents) {
            jsonStringEvents.push(JSON.stringify(event));
        }
        return jsonStringEvents;
    }
    /**
     * @returns one or more correctly structured request events for performing a operations over WS. This can vary per exchange spec.
     */
    async getWsRequestEvents(market, operation, requests, wsKey) {
        const wsRequestEvents = [];
        const wsRequestBuildingErrors = [];
        switch (market) {
            case 'all': {
                for (const request of requests) {
                    const signTimestamp = Date.now() + this.options.recvWindow;
                    const timeInSeconds = +(signTimestamp / 1000).toFixed(0);
                    const wsEvent = {
                        time: timeInSeconds,
                        channel: request.topic,
                        event: operation,
                    };
                    if (request.payload) {
                        wsEvent.payload = request.payload;
                    }
                    if (!this.isPrivateTopicRequest(request, wsKey)) {
                        wsRequestEvents.push(wsEvent);
                        continue;
                    }
                    // If private topic request, build auth part for request
                    // No key or secret, push event as failed
                    if (!this.options.apiKey || !this.options.apiSecret) {
                        wsRequestBuildingErrors.push({
                            error: 'apiKey or apiSecret missing from config',
                            operation,
                            event: wsEvent,
                        });
                        continue;
                    }
                    const signAlgoritm = 'SHA-512';
                    const signEncoding = 'hex';
                    const signInput = `channel=${wsEvent.channel}&event=${wsEvent.event}&time=${timeInSeconds}`;
                    try {
                        const sign = await this.signMessage(signInput, this.options.apiSecret, signEncoding, signAlgoritm);
                        wsRequestEvents.push({
                            ...wsEvent,
                            auth: {
                                method: 'api_key',
                                KEY: this.options.apiKey,
                                SIGN: sign,
                            },
                        });
                    }
                    catch (e) {
                        wsRequestBuildingErrors.push({
                            error: 'exception during sign',
                            errorTrace: e,
                            operation,
                            event: wsEvent,
                        });
                    }
                }
                break;
            }
            default: {
                throw (0, misc_util_js_1.neverGuard)(market, `Unhandled market "${market}"`);
            }
        }
        if (wsRequestBuildingErrors.length) {
            const label = wsRequestBuildingErrors.length === requests.length ? 'all' : 'some';
            this.logger.error(`Failed to build/send ${wsRequestBuildingErrors.length} event(s) for ${label} WS requests due to exceptions`, {
                ...exports.WS_LOGGER_CATEGORY,
                wsRequestBuildingErrors,
                wsRequestBuildingErrorsStringified: JSON.stringify(wsRequestBuildingErrors, null, 2),
            });
        }
        return wsRequestEvents;
    }
    async signMessage(paramsStr, secret, method, algorithm) {
        if (typeof this.options.customSignMessageFn === 'function') {
            return this.options.customSignMessageFn(paramsStr, secret);
        }
        return await (0, webCryptoAPI_js_1.signMessage)(paramsStr, secret, method, algorithm);
    }
    async getWsAuthRequestEvent(wsKey) {
        if (!this.options.apiKey || !this.options.apiSecret) {
            throw new Error('Cannot auth - missing api key, secret or memo in config');
        }
        let channel;
        switch (wsKey) {
            case 'spotV4': {
                channel = 'spot.login';
                break;
            }
            case 'perpFuturesBTCV4':
            case 'perpFuturesUSDTV4': {
                channel = 'futures.login';
                break;
            }
            case 'announcementsV4':
            case 'deliveryFuturesBTCV4':
            case 'deliveryFuturesUSDTV4':
            case 'optionsV4': {
                return {};
            }
            default: {
                throw (0, misc_util_js_1.neverGuard)(wsKey, `Unhandled wsKey "${wsKey}"`);
            }
        }
        const signTimestamp = Date.now() + this.options.recvWindow;
        const timeInSeconds = +(signTimestamp / 1000).toFixed(0);
        const requestEvent = {
            time: timeInSeconds,
            // id: timeInSeconds,
            channel,
            event: 'api',
            payload: {
                req_id: this.getNewRequestId(),
                req_header: {
                    'X-Gate-Channel-Id': requestUtils_js_1.CHANNEL_ID,
                },
                api_key: this.options.apiKey,
                req_param: '',
                timestamp: `${timeInSeconds}`,
            },
        };
        const signedEvent = await this.signWSAPIRequest(requestEvent);
        return signedEvent;
    }
    /**
     *
     * @param requestEvent
     * @returns A signed updated WS API request object, ready to be sent
     */
    async signWSAPIRequest(requestEvent) {
        if (!this.options.apiSecret) {
            throw new Error('API Secret missing');
        }
        const payload = requestEvent.payload;
        const toSign = [
            requestEvent.event,
            requestEvent.channel,
            JSON.stringify(payload.req_param),
            requestEvent.time,
        ].join('\n');
        const signEncoding = 'hex';
        const signAlgoritm = 'SHA-512';
        return {
            ...requestEvent,
            payload: {
                ...requestEvent.payload,
                req_header: {
                    'X-Gate-Channel-Id': requestUtils_js_1.CHANNEL_ID,
                },
                signature: await this.signMessage(toSign, this.options.apiSecret, signEncoding, signAlgoritm),
            },
        };
    }
}
exports.WebsocketClient = WebsocketClient;
//# sourceMappingURL=WebsocketClient.js.map