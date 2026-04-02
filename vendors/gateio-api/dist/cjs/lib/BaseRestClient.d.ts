import { AxiosRequestConfig } from 'axios';
import { RestClientOptions } from './requestUtils.js';
/**
 * Used to switch how authentication/requests work under the hood
 */
export declare const REST_CLIENT_TYPE_ENUM: {
    readonly main: "main";
};
export type RestClientType = (typeof REST_CLIENT_TYPE_ENUM)[keyof typeof REST_CLIENT_TYPE_ENUM];
/**
 * Some requests require some params to be in the query string and some in the body. Some even support passing params via headers.
 * This type anticipates these are possible in any combination.
 *
 * The request builder will automatically handle where parameters should go.
 */
type ParamsInQueryBodyOrHeader = {
    query?: object;
    body?: object;
    headers?: object;
};
export declare abstract class BaseRestClient {
    private options;
    private baseUrl;
    private baseUrlPath;
    private globalRequestOptions;
    private apiKey;
    private apiSecret;
    /** Defines the client type (affecting how requests & signatures behave) */
    abstract getClientType(): RestClientType;
    /**
     * Create an instance of the REST client. Pass API credentials in the object in the first parameter.
     * @param {RestClientOptions} [restClientOptions={}] options to configure REST API connectivity
     * @param {AxiosRequestConfig} [networkOptions={}] HTTP networking options for axios
     */
    constructor(restClientOptions?: RestClientOptions, networkOptions?: AxiosRequestConfig);
    /**
     * Timestamp used to sign the request. Override this method to implement your own timestamp/sync mechanism
     */
    getSignTimestampMs(): number;
    protected get(endpoint: string, params?: object): Promise<any>;
    protected post(endpoint: string, params?: ParamsInQueryBodyOrHeader): Promise<any>;
    protected getPrivate(endpoint: string, params?: object): Promise<any>;
    protected postPrivate(endpoint: string, params?: ParamsInQueryBodyOrHeader): Promise<any>;
    protected deletePrivate(endpoint: string, params?: ParamsInQueryBodyOrHeader): Promise<any>;
    protected putPrivate(endpoint: string, params?: ParamsInQueryBodyOrHeader): Promise<any>;
    protected patchPrivate(endpoint: string, params?: ParamsInQueryBodyOrHeader): Promise<any>;
    /**
     * @private Make a HTTP request to a specific endpoint. Private endpoint API calls are automatically signed.
     */
    private _call;
    /**
     * @private generic handler to parse request exceptions
     */
    parseException(e: any, request: AxiosRequestConfig<any>): unknown;
    /**
     * @private sign request and set recv window
     */
    private signRequest;
    private signMessage;
    private prepareSignParams;
    /** Returns an axios request object. Handles signing process automatically if this is a private API call */
    private buildRequest;
}
export {};
