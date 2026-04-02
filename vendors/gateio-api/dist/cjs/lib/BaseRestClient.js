"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRestClient = exports.REST_CLIENT_TYPE_ENUM = void 0;
const axios_1 = __importDefault(require("axios"));
// NOTE: https.Agent is Node.js-only and not available in browser environments
// Browser builds (via webpack) exclude this module - see webpack.config.js fallback settings
const https_1 = __importDefault(require("https"));
const misc_util_js_1 = require("./misc-util.js");
const requestUtils_js_1 = require("./requestUtils.js");
const webCryptoAPI_js_1 = require("./webCryptoAPI.js");
const MISSING_API_KEYS_ERROR = 'API Key, Secret & Application ID are ALL required to use the authenticated REST client';
/**
 * Used to switch how authentication/requests work under the hood
 */
exports.REST_CLIENT_TYPE_ENUM = {
    main: 'main',
};
/**
 * Enables:
 * - Detailed request/response logging
 * - Full request dump in any exceptions thrown from API responses
 */
const ENABLE_HTTP_TRACE = typeof process === 'object' &&
    typeof process.env === 'object' &&
    process.env.GATETRACE;
if (ENABLE_HTTP_TRACE) {
    axios_1.default.interceptors.request.use((request) => {
        console.log(new Date(), 'Starting Request', JSON.stringify({
            url: request.url,
            method: request.method,
            params: request.params,
            data: request.data,
        }, null, 2));
        return request;
    });
    axios_1.default.interceptors.response.use((response) => {
        console.log(new Date(), 'Response:', {
            // request: {
            //   url: response.config.url,
            //   method: response.config.method,
            //   data: response.config.data,
            //   headers: response.config.headers,
            // },
            response: {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                data: response.data,
            },
        });
        return response;
    });
}
/**
 * Impure, mutates params to remove any values that have a key but are undefined.
 */
function deleteUndefinedValues(params) {
    if (!params) {
        return;
    }
    for (const key in params) {
        const value = params[key];
        if (typeof value === 'undefined') {
            delete params[key];
        }
    }
}
class BaseRestClient {
    options;
    baseUrl;
    baseUrlPath;
    globalRequestOptions;
    apiKey;
    apiSecret;
    /**
     * Create an instance of the REST client. Pass API credentials in the object in the first parameter.
     * @param {RestClientOptions} [restClientOptions={}] options to configure REST API connectivity
     * @param {AxiosRequestConfig} [networkOptions={}] HTTP networking options for axios
     */
    constructor(restClientOptions = {}, networkOptions = {}) {
        this.options = {
            recvWindow: 5000,
            /** Throw errors if any request params are empty */
            strictParamValidation: false,
            ...restClientOptions,
        };
        this.globalRequestOptions = {
            /** in ms == 5 minutes by default */
            timeout: 1000 * 60 * 5,
            /** inject custom rquest options based on axios specs - see axios docs for more guidance on AxiosRequestConfig: https://github.com/axios/axios#request-config */
            ...networkOptions,
            headers: {
                'Content-Type': 'application/json',
                'X-Gate-Channel-Id': requestUtils_js_1.CHANNEL_ID,
                locale: 'en-US',
            },
        };
        // If enabled, configure a https agent with keepAlive enabled
        // NOTE: This is Node.js-only functionality. In browser environments, this code is skipped
        // as the 'https' module is excluded via webpack fallback configuration.
        // Browser connection pooling is handled automatically by the browser itself.
        if (this.options.keepAlive) {
            // Extract existing https agent parameters, if provided, to prevent the keepAlive flag from overwriting an existing https agent completely
            const existingHttpsAgent = this.globalRequestOptions.httpsAgent;
            const existingAgentOptions = existingHttpsAgent?.options || {};
            // For more advanced configuration, raise an issue on GitHub or use the "networkOptions"
            // parameter to define a custom httpsAgent with the desired properties
            this.globalRequestOptions.httpsAgent = new https_1.default.Agent({
                ...existingAgentOptions,
                keepAlive: true,
                keepAliveMsecs: this.options.keepAliveMsecs,
            });
        }
        this.baseUrl = (0, requestUtils_js_1.getRestBaseUrl)(restClientOptions);
        this.baseUrlPath = new URL(this.baseUrl).pathname;
        this.apiKey = this.options.apiKey;
        this.apiSecret = this.options.apiSecret;
        // Check Web Crypto API support when credentials are provided and no custom sign function is used
        if (this.apiKey && this.apiSecret && !this.options.customSignMessageFn) {
            (0, webCryptoAPI_js_1.checkWebCryptoAPISupported)();
        }
        // Throw if one of the 3 values is missing, but at least one of them is set
        const credentials = [this.apiKey, this.apiSecret];
        if (credentials.includes(undefined) &&
            credentials.some((v) => typeof v === 'string')) {
            throw new Error(MISSING_API_KEYS_ERROR);
        }
    }
    /**
     * Timestamp used to sign the request. Override this method to implement your own timestamp/sync mechanism
     */
    getSignTimestampMs() {
        return Date.now();
    }
    get(endpoint, params) {
        const isPublicAPI = true;
        // GET only supports params in the query string
        return this._call('GET', endpoint, { query: params }, isPublicAPI);
    }
    post(endpoint, params) {
        const isPublicAPI = true;
        return this._call('POST', endpoint, params, isPublicAPI);
    }
    getPrivate(endpoint, params) {
        const isPublicAPI = false;
        // GET only supports params in the query string
        return this._call('GET', endpoint, { query: params }, isPublicAPI);
    }
    postPrivate(endpoint, params) {
        const isPublicAPI = false;
        return this._call('POST', endpoint, params, isPublicAPI);
    }
    deletePrivate(endpoint, params) {
        const isPublicAPI = false;
        return this._call('DELETE', endpoint, params, isPublicAPI);
    }
    putPrivate(endpoint, params) {
        const isPublicAPI = false;
        return this._call('PUT', endpoint, params, isPublicAPI);
    }
    // protected patchPrivate(endpoint: string, params?: any) {
    patchPrivate(endpoint, params) {
        const isPublicAPI = false;
        return this._call('PATCH', endpoint, params, isPublicAPI);
    }
    /**
     * @private Make a HTTP request to a specific endpoint. Private endpoint API calls are automatically signed.
     */
    async _call(method, endpoint, params, isPublicApi) {
        // Sanity check to make sure it's only ever prefixed by one forward slash
        const requestUrl = [this.baseUrl, endpoint].join(endpoint.startsWith('/') ? '' : '/');
        // Build a request and handle signature process
        const options = await this.buildRequest(method, endpoint, requestUrl, params, isPublicApi);
        if (ENABLE_HTTP_TRACE) {
            console.log('full request: ', options);
        }
        // Dispatch request
        return (0, axios_1.default)(options)
            .then((response) => {
            // See: https://www.gate.io/docs/developers/apiv4/en/#return-format
            if (response.status >= 200 && response.status <= 204) {
                // Throw API rejections by parsing the response code from the body
                if (typeof response.data?.code === 'number' &&
                    response.data?.code !== 1000) {
                    throw { response };
                }
                return response.data;
            }
            throw { response };
        })
            .catch((e) => this.parseException(e, options));
    }
    /**
     * @private generic handler to parse request exceptions
     */
    parseException(e, request) {
        if (this.options.parseExceptions === false) {
            throw e;
        }
        // Something happened in setting up the request that triggered an error
        if (!e.response) {
            if (!e.request) {
                throw e.message;
            }
            // request made but no response received
            throw e;
        }
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const response = e.response;
        // console.error('err: ', response?.data);
        const debugData = ENABLE_HTTP_TRACE ? { fullRequest: request } : {};
        throw {
            code: response.status,
            message: response.statusText,
            body: response.data,
            headers: response.headers,
            requestOptions: {
                ...this.options,
                // Prevent credentials from leaking into error messages
                apiKey: 'omittedFromError',
                apiMemo: 'omittedFromError',
                apiSecret: 'omittedFromError',
                reqUrl: request.url,
                reqBody: request.data,
            },
            ...debugData,
        };
    }
    /**
     * @private sign request and set recv window
     */
    async signRequest(data, endpoint, method, signMethod) {
        const timestamp = +(this.getSignTimestampMs() / 1000).toFixed(0); // in seconds
        const res = {
            originalParams: {
                // recvWindow: this.options.recvWindow,
                ...data,
            },
            sign: '',
            timestamp,
            recvWindow: 0,
            serializedParams: '',
            queryParamsWithSign: '',
        };
        if (!this.apiKey || !this.apiSecret) {
            return res;
        }
        // It's possible to override the recv window on a per rquest level
        const strictParamValidation = this.options.strictParamValidation;
        const encodeQueryStringValues = false;
        if (signMethod === 'gateV4') {
            const signEncoding = 'hex';
            const signAlgoritm = 'SHA-512';
            const queryStringToSign = data?.query
                ? (0, requestUtils_js_1.serializeParams)(res.originalParams?.query, strictParamValidation, encodeQueryStringValues, '')
                : '';
            const requestBodyToHash = res.originalParams?.body
                ? JSON.stringify(res.originalParams?.body)
                : '';
            const hashedRequestBody = await (0, webCryptoAPI_js_1.hashMessage)(requestBodyToHash, signEncoding, signAlgoritm);
            const toSign = [
                method,
                this.baseUrlPath + endpoint,
                queryStringToSign,
                hashedRequestBody,
                timestamp,
            ].join('\n');
            // console.log('sign params: ', {
            //   requestBodyToHash,
            //   paramsStr: toSign,
            //   url: this.baseUrl,
            //   urlPath: this.baseUrlPath,
            // });
            res.sign = await this.signMessage(toSign, this.apiSecret, signEncoding, signAlgoritm);
            res.queryParamsWithSign = queryStringToSign;
            return res;
        }
        console.error(new Date(), (0, misc_util_js_1.neverGuard)(signMethod, `Unhandled sign method: "${webCryptoAPI_js_1.signMessage}"`));
        return res;
    }
    async signMessage(paramsStr, secret, method, algorithm) {
        if (typeof this.options.customSignMessageFn === 'function') {
            return this.options.customSignMessageFn(paramsStr, secret);
        }
        return await (0, webCryptoAPI_js_1.signMessage)(paramsStr, secret, method, algorithm);
    }
    async prepareSignParams(method, endpoint, signMethod, params, isPublicApi) {
        if (isPublicApi) {
            return {
                originalParams: params,
                paramsWithSign: params,
            };
        }
        if (!this.apiKey || !this.apiSecret) {
            throw new Error(MISSING_API_KEYS_ERROR);
        }
        return this.signRequest(params, endpoint, method, signMethod);
    }
    /** Returns an axios request object. Handles signing process automatically if this is a private API call */
    async buildRequest(method, endpoint, url, params, isPublicApi) {
        const options = {
            ...this.globalRequestOptions,
            url: url,
            method: method,
            headers: {
                ...params?.headers,
                ...this.globalRequestOptions.headers,
            },
        };
        deleteUndefinedValues(params);
        deleteUndefinedValues(params?.body);
        deleteUndefinedValues(params?.query);
        deleteUndefinedValues(params?.headers);
        if (!isPublicApi && (!this.apiKey || !this.apiSecret)) {
            throw new Error('API Key & Secret are both required for private endpoints');
        }
        if (isPublicApi || !this.apiKey || !this.apiSecret) {
            return {
                ...options,
                params: params?.query || params?.body || params,
            };
        }
        const signResult = await this.prepareSignParams(method, endpoint, 'gateV4', params, isPublicApi);
        const authHeaders = {
            KEY: this.apiKey,
            SIGN: signResult.sign,
            Timestamp: signResult.timestamp,
        };
        const urlSuffix = signResult.queryParamsWithSign
            ? '?' + signResult.queryParamsWithSign
            : '';
        const urlWithQueryParams = options.url + urlSuffix;
        if (method === 'GET' || !params?.body) {
            return {
                ...options,
                headers: {
                    ...authHeaders,
                    ...options.headers,
                },
                url: urlWithQueryParams,
            };
        }
        return {
            ...options,
            headers: {
                ...authHeaders,
                ...options.headers,
            },
            url: params?.query ? urlWithQueryParams : options.url,
            data: signResult.originalParams.body,
        };
    }
}
exports.BaseRestClient = BaseRestClient;
//# sourceMappingURL=BaseRestClient.js.map