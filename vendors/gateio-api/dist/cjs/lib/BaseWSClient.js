"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWebsocketClient = void 0;
const events_1 = __importDefault(require("events"));
const isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
const WebsocketClient_js_1 = require("../WebsocketClient.js");
const logger_js_1 = require("./logger.js");
const requestUtils_js_1 = require("./requestUtils.js");
const webCryptoAPI_js_1 = require("./webCryptoAPI.js");
const websocket_util_js_1 = require("./websocket/websocket-util.js");
const WsStore_js_1 = require("./websocket/WsStore.js");
const WsStore_types_js_1 = require("./websocket/WsStore.types.js");
/**
 * Users can conveniently pass topics as strings or objects (object has topic name + optional params).
 *
 * This method normalises topics into objects (object has topic name + optional params).
 */
function getNormalisedTopicRequests(wsTopicRequests) {
    const normalisedTopicRequests = [];
    for (const wsTopicRequest of wsTopicRequests) {
        // passed as string, convert to object
        if (typeof wsTopicRequest === 'string') {
            const topicRequest = {
                topic: wsTopicRequest,
                payload: undefined,
            };
            normalisedTopicRequests.push(topicRequest);
            continue;
        }
        // already a normalised object, thanks to user
        normalisedTopicRequests.push(wsTopicRequest);
    }
    return normalisedTopicRequests;
}
/**
 * Base WebSocket abstraction layer. Handles connections, tracking each connection as a unique "WS Key"
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class BaseWebsocketClient extends events_1.default {
    /**
     * State store to track a list of topics (topic requests) we are expected to be subscribed to if reconnected
     */
    wsStore;
    logger;
    options;
    wsApiRequestId = 0;
    timeOffsetMs = 0;
    constructor(options, logger) {
        super();
        this.logger = logger || logger_js_1.DefaultLogger;
        this.wsStore = new WsStore_js_1.WsStore(this.logger);
        this.options = {
            // Some defaults:
            pongTimeout: 1500,
            pingInterval: 10000,
            reconnectTimeout: 500,
            recvWindow: -1000,
            // Gate.io only has one connection (for both public & private). Auth works with every sub, not on connect, so this is turned off.
            authPrivateConnectionsOnConnect: false,
            // Gate.io requires auth to be added to every request, when subscribing to private topics. This is handled automatically.
            authPrivateRequests: true,
            // Automatically re-auth WS API, if we were auth'd before and get reconnected
            reauthWSAPIOnReconnect: true,
            ...options,
        };
        // Check Web Crypto API support when credentials are provided and no custom sign function is used
        if (this.options.apiKey &&
            this.options.apiSecret &&
            !this.options.customSignMessageFn) {
            (0, webCryptoAPI_js_1.checkWebCryptoAPISupported)();
        }
    }
    isPrivateWsKey(wsKey) {
        return this.getPrivateWSKeys().includes(wsKey);
    }
    /** Returns auto-incrementing request ID, used to track promise references for async requests */
    getNewRequestId() {
        return `${++this.wsApiRequestId}`;
    }
    getTimeOffsetMs() {
        return this.timeOffsetMs;
    }
    // TODO: not implemented
    setTimeOffsetMs(newOffset) {
        this.timeOffsetMs = newOffset;
    }
    /**
     * Don't call directly! Use subscribe() instead!
     *
     * Subscribe to one or more topics on a WS connection (identified by WS Key).
     *
     * - Topics are automatically cached
     * - Connections are automatically opened, if not yet connected
     * - Authentication is automatically handled
     * - Topics are automatically resubscribed to, if something happens to the connection, unless you call unsubsribeTopicsForWsKey(topics, key).
     *
     * @param wsRequests array of topics to subscribe to
     * @param wsKey ws key referring to the ws connection these topics should be subscribed on
     */
    subscribeTopicsForWsKey(wsTopicRequests, wsKey) {
        const normalisedTopicRequests = getNormalisedTopicRequests(wsTopicRequests);
        // Store topics, so future automation (post-auth, post-reconnect) has everything needed to resubscribe automatically
        for (const topic of normalisedTopicRequests) {
            this.wsStore.addTopic(wsKey, topic);
        }
        const isConnected = this.wsStore.isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTED);
        const isConnectionInProgress = this.wsStore.isConnectionAttemptInProgress(wsKey);
        // start connection process if it hasn't yet begun. Topics are automatically subscribed to on-connect
        if (!isConnected && !isConnectionInProgress) {
            return this.connect(wsKey);
        }
        // Subscribe should happen automatically once connected, nothing to do here after topics are added to wsStore.
        if (!isConnected) {
            /**
             * Are we in the process of connection? Nothing to send yet.
             */
            this.logger.trace('WS not connected - requests queued for retry once connected.', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsKey,
                wsTopicRequests,
            });
            return;
        }
        // We're connected. Check if auth is needed and if already authenticated
        const isPrivateConnection = this.isPrivateWsKey(wsKey);
        const isAuthenticated = this.wsStore.get(wsKey)?.isAuthenticated;
        if (isPrivateConnection && !isAuthenticated) {
            /**
             * If not authenticated yet and auth is required, don't request topics yet.
             *
             * Auth should already automatically be in progress, so no action needed from here. Topics will automatically subscribe post-auth success.
             */
            return false;
        }
        // Finally, request subscription to topics if the connection is healthy and ready
        this.requestSubscribeTopics(wsKey, normalisedTopicRequests);
    }
    unsubscribeTopicsForWsKey(wsTopicRequests, wsKey) {
        const normalisedTopicRequests = getNormalisedTopicRequests(wsTopicRequests);
        // Store topics, so future automation (post-auth, post-reconnect) has everything needed to resubscribe automatically
        for (const topic of normalisedTopicRequests) {
            this.wsStore.deleteTopic(wsKey, topic);
        }
        const isConnected = this.wsStore.isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTED);
        // If not connected, don't need to do anything.
        // Removing the topic from the store is enough to stop it from being resubscribed to on reconnect.
        if (!isConnected) {
            return;
        }
        // We're connected. Check if auth is needed and if already authenticated
        const isPrivateConnection = this.isPrivateWsKey(wsKey);
        const isAuthenticated = this.wsStore.get(wsKey)?.isAuthenticated;
        if (isPrivateConnection && !isAuthenticated) {
            /**
             * If not authenticated yet and auth is required, don't need to do anything.
             * We don't subscribe to topics until auth is complete anyway.
             */
            return;
        }
        // Finally, request subscription to topics if the connection is healthy and ready
        this.requestUnsubscribeTopics(wsKey, normalisedTopicRequests);
    }
    /**
     * Splits topic requests into two groups, public & private topic requests
     */
    sortTopicRequestsIntoPublicPrivate(wsTopicRequests, wsKey) {
        const publicTopicRequests = [];
        const privateTopicRequests = [];
        for (const topic of wsTopicRequests) {
            if (this.isPrivateTopicRequest(topic, wsKey)) {
                privateTopicRequests.push(topic);
            }
            else {
                publicTopicRequests.push(topic);
            }
        }
        return {
            publicReqs: publicTopicRequests,
            privateReqs: privateTopicRequests,
        };
    }
    /** Get the WsStore that tracks websockets & topics */
    getWsStore() {
        return this.wsStore;
    }
    close(wsKey, force) {
        this.logger.info('Closing connection', { ...WebsocketClient_js_1.WS_LOGGER_CATEGORY, wsKey });
        this.setWsState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CLOSING);
        this.clearTimers(wsKey);
        const ws = this.getWs(wsKey);
        ws?.close();
        if (force) {
            (0, websocket_util_js_1.safeTerminateWs)(ws);
        }
    }
    closeAll(force) {
        this.wsStore.getKeys().forEach((key) => {
            this.close(key, force);
        });
    }
    isConnected(wsKey) {
        return this.wsStore.isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTED);
    }
    /**
     * Request connection to a specific websocket, instead of waiting for automatic connection.
     */
    async connect(wsKey) {
        try {
            if (this.wsStore.isWsOpen(wsKey)) {
                this.logger.error('Refused to connect to ws with existing active connection', { ...WebsocketClient_js_1.WS_LOGGER_CATEGORY, wsKey });
                return { wsKey, ws: this.wsStore.getWs(wsKey) };
            }
            if (this.wsStore.isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTING)) {
                this.logger.error('Refused to connect to ws, connection attempt already active', { ...WebsocketClient_js_1.WS_LOGGER_CATEGORY, wsKey });
                return this.wsStore.getConnectionInProgressPromise(wsKey)?.promise;
            }
            if (!this.wsStore.getConnectionState(wsKey) ||
                this.wsStore.isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.INITIAL)) {
                this.setWsState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTING);
            }
            if (!this.wsStore.getConnectionInProgressPromise(wsKey)) {
                this.wsStore.createConnectionInProgressPromise(wsKey, false);
            }
            const url = this.getWsUrl(wsKey);
            const ws = this.connectToWsUrl(url, wsKey);
            this.wsStore.setWs(wsKey, ws);
        }
        catch (err) {
            this.parseWsError('Connection failed', err, wsKey);
            this.reconnectWithDelay(wsKey, this.options.reconnectTimeout);
        }
        return this.wsStore.getConnectionInProgressPromise(wsKey)?.promise;
    }
    connectToWsUrl(url, wsKey) {
        this.logger.trace(`Opening WS connection to URL: ${url}`, {
            ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
            wsKey,
        });
        const { protocols = [], ...wsOptions } = this.options.wsOptions || {};
        const ws = new isomorphic_ws_1.default(url, protocols, wsOptions);
        ws.onopen = (event) => this.onWsOpen(event, wsKey, url, ws);
        ws.onmessage = (event) => this.onWsMessage(event, wsKey, ws);
        ws.onerror = (event) => this.parseWsError('websocket error', event, wsKey);
        ws.onclose = (event) => this.onWsClose(event, wsKey);
        return ws;
    }
    parseWsError(context, error, wsKey) {
        if (!error.message) {
            this.logger.error(`${context} due to unexpected error: `, error);
            this.emit('response', { ...error, wsKey });
            this.emit('exception', { ...error, wsKey });
            return;
        }
        switch (error.message) {
            case 'Unexpected server response: 401':
                this.logger.error(`${context} due to 401 authorization failure.`, {
                    ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                    wsKey,
                });
                break;
            default:
                this.logger.error(`${context} due to unexpected response error: "${error?.msg || error?.message || error}"`, { ...WebsocketClient_js_1.WS_LOGGER_CATEGORY, wsKey, error });
                break;
        }
        this.emit('response', { ...error, wsKey });
        this.emit('exception', { ...error, wsKey });
    }
    /** Get a signature, build the auth request and send it */
    async sendAuthRequest(wsKey) {
        try {
            this.logger.info('Sending auth request...', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsKey,
            });
            await this.assertIsConnected(wsKey);
            if (!this.wsStore.getAuthenticationInProgressPromise(wsKey)) {
                this.wsStore.createAuthenticationInProgressPromise(wsKey, false);
            }
            const request = await this.getWsAuthRequestEvent(wsKey);
            // console.log('ws auth req', request);
            this.tryWsSend(wsKey, JSON.stringify(request));
            return this.wsStore.getAuthenticationInProgressPromise(wsKey)?.promise;
        }
        catch (e) {
            this.logger.trace(e, { ...WebsocketClient_js_1.WS_LOGGER_CATEGORY, wsKey });
        }
    }
    reconnectWithDelay(wsKey, connectionDelayMs) {
        this.clearTimers(wsKey);
        if (!this.wsStore.isConnectionAttemptInProgress(wsKey)) {
            this.setWsState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.RECONNECTING);
        }
        this.wsStore.get(wsKey, true).activeReconnectTimer = setTimeout(() => {
            this.logger.info('Reconnecting to websocket', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsKey,
            });
            this.connect(wsKey);
        }, connectionDelayMs);
    }
    ping(wsKey) {
        if (this.wsStore.get(wsKey, true).activePongTimer) {
            return;
        }
        this.clearPongTimer(wsKey);
        this.logger.trace('Sending ping', { ...WebsocketClient_js_1.WS_LOGGER_CATEGORY, wsKey });
        const ws = this.wsStore.get(wsKey, true).ws;
        if (!ws) {
            this.logger.error(`Unable to send ping for wsKey "${wsKey}" - no connection found`);
            return;
        }
        this.sendPingEvent(wsKey, ws);
        this.wsStore.get(wsKey, true).activePongTimer = setTimeout(() => {
            this.logger.info('Pong timeout - closing socket to reconnect', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsKey,
            });
            this.clearPongTimer(wsKey);
            (0, websocket_util_js_1.safeTerminateWs)(this.getWs(wsKey), true);
        }, this.options.pongTimeout);
    }
    clearTimers(wsKey) {
        this.clearPingTimer(wsKey);
        this.clearPongTimer(wsKey);
        const wsState = this.wsStore.get(wsKey);
        if (wsState?.activeReconnectTimer) {
            clearTimeout(wsState.activeReconnectTimer);
        }
    }
    // Send a ping at intervals
    clearPingTimer(wsKey) {
        const wsState = this.wsStore.get(wsKey);
        if (wsState?.activePingTimer) {
            clearInterval(wsState.activePingTimer);
            wsState.activePingTimer = undefined;
        }
    }
    // Expect a pong within a time limit
    clearPongTimer(wsKey) {
        const wsState = this.wsStore.get(wsKey);
        if (wsState?.activePongTimer) {
            clearTimeout(wsState.activePongTimer);
            wsState.activePongTimer = undefined;
            // this.logger.trace(`Cleared pong timeout for "${wsKey}"`);
        }
        else {
            // this.logger.trace(`No active pong timer for "${wsKey}"`);
        }
    }
    /**
     * Simply builds and sends subscribe events for a list of topics for a ws key
     *
     * @private Use the `subscribe(topics)` or `subscribeTopicsForWsKey(topics, wsKey)` method to subscribe to topics. Send WS message to subscribe to topics.
     */
    async requestSubscribeTopics(wsKey, topics) {
        if (!topics.length) {
            return;
        }
        // Automatically splits requests into smaller batches, if needed
        const subscribeWsMessages = await this.getWsOperationEventsForTopics(topics, wsKey, 'subscribe');
        this.logger.trace(`Subscribing to ${topics.length} "${wsKey}" topics in ${subscribeWsMessages.length} batches.`);
        // console.log(`batches: `, JSON.stringify(subscribeWsMessages, null, 2));
        for (const wsMessage of subscribeWsMessages) {
            // this.logger.trace(`Sending batch via message: "${wsMessage}"`);
            this.tryWsSend(wsKey, wsMessage);
        }
        this.logger.trace(`Finished subscribing to ${topics.length} "${wsKey}" topics in ${subscribeWsMessages.length} batches.`);
    }
    /**
     * Simply builds and sends unsubscribe events for a list of topics for a ws key
     *
     * @private Use the `unsubscribe(topics)` method to unsubscribe from topics. Send WS message to unsubscribe from topics.
     */
    async requestUnsubscribeTopics(wsKey, wsTopicRequests) {
        if (!wsTopicRequests.length) {
            return;
        }
        const subscribeWsMessages = await this.getWsOperationEventsForTopics(wsTopicRequests, wsKey, 'unsubscribe');
        this.logger.trace(`Unsubscribing to ${wsTopicRequests.length} "${wsKey}" topics in ${subscribeWsMessages.length} batches. Events: "${JSON.stringify(wsTopicRequests)}"`);
        for (const wsMessage of subscribeWsMessages) {
            this.logger.trace(`Sending batch via message: "${wsMessage}"`);
            this.tryWsSend(wsKey, wsMessage);
        }
        this.logger.trace(`Finished unsubscribing to ${wsTopicRequests.length} "${wsKey}" topics in ${subscribeWsMessages.length} batches.`);
    }
    /**
     * Try sending a string event on a WS connection (identified by the WS Key)
     */
    tryWsSend(wsKey, wsMessage, throwExceptions) {
        try {
            this.logger.trace('Sending upstream ws message: ', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsMessage,
                wsKey,
            });
            if (!wsKey) {
                throw new Error('Cannot send message due to no known websocket for this wsKey');
            }
            const ws = this.getWs(wsKey);
            if (!ws) {
                throw new Error(`${wsKey} socket not connected yet, call "connectAll()" first then try again when the "open" event arrives`);
            }
            ws.send(wsMessage);
        }
        catch (e) {
            this.logger.error('Failed to send WS message', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsMessage,
                wsKey,
                exception: e,
            });
            if (throwExceptions) {
                throw e;
            }
        }
    }
    async onWsOpen(event, wsKey, url, ws) {
        const isFreshConnectionAttempt = this.wsStore.isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTING);
        const didReconnectSuccessfully = this.wsStore.isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.RECONNECTING);
        if (isFreshConnectionAttempt) {
            this.logger.info('Websocket connected', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsKey,
            });
            this.emit('open', { wsKey, event, wsUrl: url, ws });
        }
        else if (didReconnectSuccessfully) {
            this.logger.info('Websocket reconnected', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                wsKey,
            });
            this.emit('reconnected', { wsKey, event, wsUrl: url, ws });
        }
        this.setWsState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTED);
        this.logger.trace('Enabled ping timer', { ...WebsocketClient_js_1.WS_LOGGER_CATEGORY, wsKey });
        this.wsStore.get(wsKey, true).activePingTimer = setInterval(() => this.ping(wsKey), this.options.pingInterval);
        // Resolve & cleanup deferred "connection attempt in progress" promise
        try {
            const connectionInProgressPromise = this.wsStore.getConnectionInProgressPromise(wsKey);
            if (connectionInProgressPromise?.resolve) {
                connectionInProgressPromise.resolve({
                    ws,
                    wsKey,
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (e) {
            this.logger.error('Exception trying to resolve "connectionInProgress" promise');
        }
        // Remove before resolving, in case there's more requests queued
        this.wsStore.removeConnectingInProgressPromise(wsKey);
        // Some websockets require an auth packet to be sent after opening the connection
        if (this.isAuthOnConnectWsKey(wsKey) &&
            this.options.authPrivateConnectionsOnConnect) {
            await this.assertIsAuthenticated(wsKey);
        }
        // Reconnect to topics known before it connected
        const { privateReqs, publicReqs } = this.sortTopicRequestsIntoPublicPrivate([...this.wsStore.getTopics(wsKey)], wsKey);
        // Request sub to public topics, if any
        this.requestSubscribeTopics(wsKey, publicReqs);
        // Request sub to private topics, if auth on connect isn't needed
        if (!this.options.authPrivateConnectionsOnConnect) {
            this.requestSubscribeTopics(wsKey, privateReqs);
        }
        const wsStoredState = this.wsStore.get(wsKey, true);
        const { didAuthWSAPI, WSAPIAuthChannel } = wsStoredState;
        // If enabled, automatically reauth WS API if reconnected
        if (didReconnectSuccessfully &&
            this.options.reauthWSAPIOnReconnect &&
            didAuthWSAPI &&
            WSAPIAuthChannel) {
            this.logger.info('WS API was authenticated before reconnect - re-authenticating WS API...');
            let attempt = 0;
            const maxReAuthAttempts = 5;
            while (attempt <= maxReAuthAttempts) {
                attempt++;
                try {
                    this.logger.trace(`try reauthenticate (attempt ${attempt}/${maxReAuthAttempts})`);
                    const loginResult = await this.sendWSAPIRequest(wsKey, WSAPIAuthChannel);
                    this.logger.trace('reauthenticated!', loginResult);
                    break;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                }
                catch (e) {
                    const giveUp = attempt >= maxReAuthAttempts;
                    const suffix = giveUp
                        ? 'Max tries reached. Giving up!'
                        : 'Trying again...';
                    this.logger.error(`Exception trying to reauthenticate WS API on reconnect... ${suffix}`);
                    this.emit('exception', {
                        wsKey,
                        type: 'wsapi.auth',
                        reason: `automatic WS API reauth failed after ${attempt} attempts`,
                    });
                }
            }
        }
    }
    /**
     * Handle subscription to private topics _after_ authentication successfully completes asynchronously.
     *
     * Only used for exchanges that require auth before sending private topic subscription requests
     */
    onWsAuthenticated(wsKey, event) {
        const wsState = this.wsStore.get(wsKey, true);
        wsState.isAuthenticated = true;
        // Resolve & cleanup deferred "auth attempt in progress" promise
        try {
            const inProgressPromise = this.wsStore.getAuthenticationInProgressPromise(wsKey);
            if (inProgressPromise?.resolve) {
                inProgressPromise.resolve({
                    wsKey,
                    event,
                    ws: wsState.ws,
                });
            }
        }
        catch (e) {
            this.logger.error('Exception trying to resolve "authenticationInProgress" promise', e);
        }
        // Remove before continuing, in case there's more requests queued
        this.wsStore.removeAuthenticationInProgressPromise(wsKey);
        if (this.options.authPrivateConnectionsOnConnect) {
            const topics = [...this.wsStore.getTopics(wsKey)];
            const privateTopics = topics.filter((topic) => this.isPrivateTopicRequest(topic, wsKey));
            if (privateTopics.length) {
                this.subscribeTopicsForWsKey(privateTopics, wsKey);
            }
        }
        if (event?.isWSAPI && event?.WSAPIAuthChannel) {
            wsState.didAuthWSAPI = true;
            wsState.WSAPIAuthChannel = event.WSAPIAuthChannel;
        }
    }
    onWsMessage(event, wsKey, ws) {
        try {
            // any message can clear the pong timer - wouldn't get a message if the ws wasn't working
            this.clearPongTimer(wsKey);
            if (this.isWsPong(event)) {
                this.logger.trace('Received pong', {
                    ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                    wsKey,
                    event: event?.data,
                });
                return;
            }
            if (this.isWsPing(event)) {
                this.logger.trace('Received ping', {
                    ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                    wsKey,
                    event,
                });
                this.sendPongEvent(wsKey, ws);
                return;
            }
            if ((0, requestUtils_js_1.isMessageEvent)(event)) {
                const data = event.data;
                const dataType = event.type;
                const emittableEvents = this.resolveEmittableEvents(wsKey, event);
                if (!emittableEvents.length) {
                    // console.log(`raw event: `, { data, dataType, emittableEvents });
                    this.logger.error('Unhandled/unrecognised ws event message - returned no emittable data', {
                        ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                        message: data || 'no message',
                        dataType,
                        event,
                        wsKey,
                    });
                    return this.emit('update', { ...event, wsKey });
                }
                for (const emittable of emittableEvents) {
                    if (this.isWsPong(emittable)) {
                        this.logger.trace('Received pong', {
                            ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                            wsKey,
                            data,
                        });
                        continue;
                    }
                    if (emittable.eventType === 'authenticated') {
                        this.logger.trace('Successfully authenticated', {
                            ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                            wsKey,
                        });
                        this.emit(emittable.eventType, { ...emittable.event, wsKey });
                        this.onWsAuthenticated(wsKey, emittable.event);
                        continue;
                    }
                    this.emit(emittable.eventType, { ...emittable.event, wsKey });
                }
                return;
            }
            this.logger.error('Unhandled/unrecognised ws event message - unexpected message format', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                message: event || 'no message',
                event,
                wsKey,
            });
        }
        catch (e) {
            this.logger.error('Failed to parse ws event message', {
                ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
                error: e,
                event,
                wsKey,
            });
        }
    }
    onWsClose(event, wsKey) {
        this.logger.info('Websocket connection closed', {
            ...WebsocketClient_js_1.WS_LOGGER_CATEGORY,
            wsKey,
        });
        const wsState = this.wsStore.get(wsKey, true);
        wsState.isAuthenticated = false;
        if (this.wsStore.getConnectionState(wsKey) !== WsStore_types_js_1.WsConnectionStateEnum.CLOSING) {
            // unintentional close, attempt recovery
            this.logger.trace(`onWsClose(${wsKey}): rejecting all deferred promises...`);
            // clean up any pending promises for this connection
            this.getWsStore().rejectAllDeferredPromises(wsKey, 'connection lost, reconnecting');
            this.setWsState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.INITIAL);
            this.reconnectWithDelay(wsKey, this.options.reconnectTimeout);
            this.emit('reconnect', { wsKey, event });
        }
        else {
            // intentional close - clean up
            // clean up any pending promises for this connection
            this.logger.trace(`onWsClose(${wsKey}): rejecting all deferred promises...`);
            // clean up any pending promises for this connection
            this.getWsStore().rejectAllDeferredPromises(wsKey, 'disconnected');
            this.setWsState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.INITIAL);
            // This was an intentional close, delete all state for this connection, as if it never existed:
            this.wsStore.delete(wsKey);
            this.emit('close', { wsKey, event });
        }
    }
    getWs(wsKey) {
        return this.wsStore.getWs(wsKey);
    }
    setWsState(wsKey, state) {
        this.wsStore.setConnectionState(wsKey, state);
    }
    /**
     * Promise-driven method to assert that a ws has successfully connected (will await until connection is open)
     */
    async assertIsConnected(wsKey) {
        const isConnected = this.getWsStore().isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTED);
        if (isConnected) {
            return true;
        }
        const inProgressPromise = this.getWsStore().getConnectionInProgressPromise(wsKey);
        // Already in progress? Await shared promise and retry
        if (inProgressPromise) {
            this.logger.trace('assertIsConnected(): awaiting...');
            await inProgressPromise.promise;
            this.logger.trace('assertIsConnected(): awaiting...connected!');
            return inProgressPromise.promise;
        }
        // Start connection, it should automatically store/return a promise.
        this.logger.trace('assertIsConnected(): connecting...');
        await this.connect(wsKey);
        this.logger.trace('assertIsConnected(): connecting...newly connected!');
    }
    /**
     * Promise-driven method to assert that a ws has been successfully authenticated (will await until auth is confirmed)
     */
    async assertIsAuthenticated(wsKey) {
        const isConnected = this.getWsStore().isConnectionState(wsKey, WsStore_types_js_1.WsConnectionStateEnum.CONNECTED);
        if (!isConnected) {
            this.logger.trace('assertIsAuthenticated(): connecting...');
            await this.assertIsConnected(wsKey);
        }
        const inProgressPromise = this.getWsStore().getAuthenticationInProgressPromise(wsKey);
        // Already in progress? Await shared promise and retry
        if (inProgressPromise) {
            this.logger.trace('assertIsAuthenticated(): awaiting...');
            await inProgressPromise.promise;
            this.logger.trace('assertIsAuthenticated(): authenticated!');
            return;
        }
        const isAuthenticated = this.wsStore.get(wsKey)?.isAuthenticated;
        if (isAuthenticated) {
            // this.logger.trace('assertIsAuthenticated(): ok');
            return;
        }
        // Start authentication, it should automatically store/return a promise.
        this.logger.trace('assertIsAuthenticated(): authenticating...');
        await this.sendAuthRequest(wsKey);
        this.logger.trace('assertIsAuthenticated(): newly authenticated!');
    }
}
exports.BaseWebsocketClient = BaseWebsocketClient;
//# sourceMappingURL=BaseWSClient.js.map