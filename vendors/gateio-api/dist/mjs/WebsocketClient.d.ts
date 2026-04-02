import { BaseWebsocketClient, EmittableEvent } from './lib/BaseWSClient.js';
import { MessageEventLike } from './lib/requestUtils.js';
import { WsKey, WsMarket, WsTopicRequest } from './lib/websocket/websocket-util.js';
import { WSConnectedResult } from './lib/websocket/WsStore.types.js';
import { WsOperation } from './types/websockets/requests.js';
import { WsAPITopicRequestParamMap, WsAPITopicResponseMap, WSAPIWsKey, WsAPIWsKeyTopicMap } from './types/websockets/wsAPI.js';
export declare const WS_LOGGER_CATEGORY: {
    category: string;
};
export interface WSAPIRequestFlags {
    /** If true, will skip auth requirement for WS API connection */
    authIsOptional?: boolean | undefined;
}
/**
 * WS topics are always a string for gate. Some exchanges use complex objects
 */
export type WsTopic = string;
export declare class WebsocketClient extends BaseWebsocketClient<WsKey> {
    /**
     * Request connection of all dependent (public & private) websockets, instead of waiting for automatic connection by library.
     *
     * Returns array of promises that individually resolve when each connection is successfully opened.
     */
    connectAll(): Promise<WSConnectedResult | undefined>[];
    /**
     * Ensures the WS API connection is active and ready.
     *
     * You do not need to call this, but if you call this before making any WS API requests,
     * it can accelerate the first request (by preparing the connection in advance).
     */
    connectWSAPI(wsKey: WSAPIWsKey, skipAuth?: boolean): Promise<unknown>;
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
    subscribe(requests: (WsTopicRequest<WsTopic> | WsTopic) | (WsTopicRequest<WsTopic> | WsTopic)[], wsKey: WsKey): void;
    /**
     * Unsubscribe from one or more topics. Similar to subscribe() but in reverse.
     *
     * - Requests are automatically routed to the correct websocket connection.
     * - These topics will be removed from the topic cache, so they won't be subscribed to again.
     */
    unsubscribe(requests: (WsTopicRequest<WsTopic> | WsTopic) | (WsTopicRequest<WsTopic> | WsTopic)[], wsKey: WsKey): void;
    /**
     * WS API Methods - similar to the REST API, but via WebSockets
     */
    /**
     * Send a Websocket API event on a connection. Returns a promise that resolves on reply.
     *
     * Returned promise is rejected if an exception is detected in the reply OR the connection disconnects for any reason (even if automatic reconnect will happen).
     *
     * After a fresh connection, you should always send a login request first.
     *
     * If you authenticated once and you're reconnected later (e.g. connection temporarily lost), the SDK will by default automatically:
     * - Detect you were authenticated to the WS API before
     * - Try to re-authenticate (up to 5 times, in case something (bad timestamp) goes wrong)
     * - If it succeeds, it will emit the 'authenticated' event.
     * - If it fails and gives up, it will emit an 'exception' event (type: 'wsapi.auth', reason: detailed text).
     *
     * You can turn off the automatic re-auth WS API logic using `reauthWSAPIOnReconnect: false` in the WSClient config.
     *
     * @param wsKey - The connection this event is for (e.g. "spotV4" | "perpFuturesUSDTV4" | "perpFuturesBTCV4" | "deliveryFuturesUSDTV4" | "deliveryFuturesBTCV4" | "optionsV4")
     * @param channel - The channel this event is for (e.g. "spot.login" to authenticate)
     * @param params - Any request parameters for the payload (contents of req_param in the docs). Signature generation is automatic, only send parameters such as order ID as per the docs.
     * @returns Promise - tries to resolve with async WS API response. Rejects if disconnected or exception is seen in async WS API response
     */
    sendWSAPIRequest<TWSKey extends keyof WsAPIWsKeyTopicMap, TWSChannel extends WsAPIWsKeyTopicMap[TWSKey] = WsAPIWsKeyTopicMap[TWSKey], TWSParams extends WsAPITopicRequestParamMap[TWSChannel] = WsAPITopicRequestParamMap[TWSChannel], TWSAPIResponse extends WsAPITopicResponseMap[TWSChannel] | object = WsAPITopicResponseMap[TWSChannel]>(wsKey: TWSKey, channel: TWSChannel, params?: TWSParams extends void | never ? undefined : TWSParams, requestFlags?: WSAPIRequestFlags): Promise<TWSAPIResponse>;
    /**
     *
     * Internal methods - not intended for public use
     *
     */
    protected getWsUrl(wsKey: WsKey): string;
    protected sendPingEvent(wsKey: WsKey): void;
    protected sendPongEvent(wsKey: WsKey): void;
    protected isWsPing(_msg: any): boolean;
    protected isWsPong(msg: any): boolean;
    /**
     * Parse incoming events into categories, before emitting to the user
     */
    protected resolveEmittableEvents(wsKey: WsKey, event: MessageEventLike): EmittableEvent[];
    /**
     * Determines if a topic is for a private channel, using a hardcoded list of strings
     */
    protected isPrivateTopicRequest(request: WsTopicRequest<string>, wsKey: WsKey): boolean;
    /**
     * Not in use for gate.io
     */
    protected getWsMarketForWsKey(_wsKey: WsKey): WsMarket;
    /**
     * Not in use for gate.io
     */
    protected getPrivateWSKeys(): WsKey[];
    protected isAuthOnConnectWsKey(wsKey: WsKey): boolean;
    /** Force subscription requests to be sent in smaller batches, if a number is returned */
    protected getMaxTopicsPerSubscribeEvent(_wsKey: WsKey): number | null;
    /**
     * Map one or more topics into fully prepared "subscribe request" events (already stringified and ready to send)
     */
    protected getWsOperationEventsForTopics(topics: WsTopicRequest<string>[], wsKey: WsKey, operation: WsOperation): Promise<string[]>;
    /**
     * @returns one or more correctly structured request events for performing a operations over WS. This can vary per exchange spec.
     */
    private getWsRequestEvents;
    private signMessage;
    protected getWsAuthRequestEvent(wsKey: WsKey): Promise<object>;
    /**
     *
     * @param requestEvent
     * @returns A signed updated WS API request object, ready to be sent
     */
    private signWSAPIRequest;
}
