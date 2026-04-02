import WebSocket from 'isomorphic-ws';
import { GateBaseUrlKey } from '../types/shared.js';
export interface RestClientOptions {
    /** Your API key */
    apiKey?: string;
    /** Your API secret */
    apiSecret?: string;
    /**
     * Override the default/global max size of the request window (in ms) for signed api calls.
     * If you don't include a recv window when making an API call, this value will be used as default
     */
    recvWindow?: number;
    /** Default: false. If true, we'll throw errors if any params are undefined */
    strictParamValidation?: boolean;
    /**
     * Optionally override API protocol + domain
     * e.g baseUrl: 'https://api.gate.io'
     **/
    baseUrl?: string;
    baseUrlKey?: GateBaseUrlKey;
    /** Default: true. whether to try and post-process request exceptions (and throw them). */
    parseExceptions?: boolean;
    /**
     * Enable keep alive for REST API requests (via axios).
     * See: https://github.com/tiagosiebler/bybit-api/issues/368
     */
    keepAlive?: boolean;
    /**
     * When using HTTP KeepAlive, how often to send TCP KeepAlive packets over sockets being kept alive. Default = 1000.
     * Only relevant if keepAlive is set to true.
     * Default: 1000 (defaults comes from https agent)
     */
    keepAliveMsecs?: number;
    /**
     * Allows you to provide a custom "signMessage" function, e.g. to use node's much faster createHmac method
     *
     * Look in the examples folder for a demonstration on using node's createHmac instead.
     */
    customSignMessageFn?: (message: string, secret: string) => Promise<string>;
}
export declare function serializeParams<T extends Record<string, any> | undefined = {}>(params: T, strict_validation: boolean | undefined, encodeValues: boolean, prefixWith: string): string;
export declare function getRestBaseUrl(restClientOptions: RestClientOptions): string;
export declare const CHANNEL_ID = "gateapinode";
export interface MessageEventLike {
    target: WebSocket;
    type: 'message';
    data: string;
}
export declare function isMessageEvent(msg: unknown): msg is MessageEventLike;
