import WebSocket from 'isomorphic-ws';
import { WSAPIRequest } from '../../types/websockets/requests.js';
/**
 * Should be one WS key per unique URL. Some URLs may need a suffix.
 */
export declare const WS_KEY_MAP: {
    /**
     * Spot & Margin
     * https://www.gate.io/docs/developers/apiv4/ws/en/
     */
    readonly spotV4: "spotV4";
    /**
     * Perpetual futures (USDT)
     * https://www.gate.io/docs/developers/futures/ws/en/#gate-io-futures-websocket-v4
     */
    readonly perpFuturesUSDTV4: "perpFuturesUSDTV4";
    /**
     * Perpetual futures (BTC)
     * https://www.gate.io/docs/developers/futures/ws/en/#gate-io-futures-websocket-v4
     */
    readonly perpFuturesBTCV4: "perpFuturesBTCV4";
    /**
     * Delivery Futures (USDT)
     * https://www.gate.io/docs/developers/delivery/ws/en/
     */
    readonly deliveryFuturesUSDTV4: "deliveryFuturesUSDTV4";
    /**
     * Delivery Futures (BTC)
     * https://www.gate.io/docs/developers/delivery/ws/en/
     */
    readonly deliveryFuturesBTCV4: "deliveryFuturesBTCV4";
    /**
     * Options
     * https://www.gate.io/docs/developers/options/ws/en/
     */
    readonly optionsV4: "optionsV4";
    /**
     * Announcements V4
     * https://www.gate.io/docs/developers/options/ws/en/
     */
    readonly announcementsV4: "announcementsV4";
};
/** This is used to differentiate between each of the available websocket streams */
export type WsKey = (typeof WS_KEY_MAP)[keyof typeof WS_KEY_MAP];
export type FuturesWsKey = typeof WS_KEY_MAP.perpFuturesUSDTV4 | typeof WS_KEY_MAP.perpFuturesBTCV4 | typeof WS_KEY_MAP.deliveryFuturesUSDTV4 | typeof WS_KEY_MAP.deliveryFuturesBTCV4;
export type WsMarket = 'all';
/**
 * Normalised internal format for a request (subscribe/unsubscribe/etc) on a topic, with optional parameters.
 *
 * - Topic: the topic this event is for
 * - Payload: the parameters to include, optional. E.g. auth requires key + sign. Some topics allow configurable parameters.
 */
export interface WsTopicRequest<TWSTopic extends string = string, TWSPayload = any> {
    topic: TWSTopic;
    payload?: TWSPayload;
}
/**
 * Conveniently allow users to request a topic either as string topics or objects (containing string topic + params)
 */
export type WsTopicRequestOrStringTopic<TWSTopic extends string, TWSPayload = any> = WsTopicRequest<TWSTopic, TWSPayload> | string;
/**
 * Some exchanges have two livenet environments, some have test environments, some dont. This allows easy flexibility for different exchanges.
 * Examples:
 *  - One livenet and one testnet: NetworkMap<'livenet' | 'testnet'>
 *  - One livenet, sometimes two, one testnet: NetworkMap<'livenet' | 'testnet', 'livenet2'>
 *  - Only one livenet, no other networks: NetworkMap<'livenet'>
 */
type NetworkMap<TRequiredKeys extends string, TOptionalKeys extends string | undefined = undefined> = Record<TRequiredKeys, string> & (TOptionalKeys extends string ? Record<TOptionalKeys, string | undefined> : Record<TRequiredKeys, string>);
export declare const WS_BASE_URL_MAP: Record<WsKey, NetworkMap<'livenet' | 'testnet'>>;
export declare function neverGuard(x: never, msg: string): Error;
/**
 * WS API promises are stored using a primary key. This key is constructed using
 * properties found in every request & reply.
 */
export declare function getPromiseRefForWSAPIRequest(requestEvent: WSAPIRequest): string;
export declare function getPrivateSpotTopics(): string[];
export declare function getPrivateFuturesTopics(): string[];
export declare function getPrivateOptionsTopics(): string[];
/**
 * ws.terminate() is undefined in browsers.
 * This only works in node.js, not in browsers.
 * Does nothing if `ws` is undefined. Does nothing in browsers.
 */
export declare function safeTerminateWs(ws?: WebSocket | any, fallbackToClose?: boolean): boolean;
export {};
