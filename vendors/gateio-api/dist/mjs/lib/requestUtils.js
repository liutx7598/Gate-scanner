export function serializeParams(params, strict_validation, encodeValues, prefixWith) {
    if (!params) {
        return '';
    }
    const queryString = Object.keys(params)
        .sort()
        .map((key) => {
        const value = params[key];
        if (strict_validation === true && typeof value === 'undefined') {
            throw new Error('Failed to sign API request due to undefined parameter');
        }
        const encodedValue = encodeValues ? encodeURIComponent(value) : value;
        return `${key}=${encodedValue}`;
    })
        .join('&');
    // Only prefix if there's a value
    return queryString ? prefixWith + queryString : queryString;
}
const GATE_BASE_URLS = {
    live: 'https://api.gateio.ws/api/v4',
    futuresLiveAlternative: 'https://fx-api.gateio.ws/api/v4',
    futuresTestnet: 'https://fx-api-testnet.gateio.ws/api/v4',
};
export function getRestBaseUrl(restClientOptions) {
    if (restClientOptions.baseUrl) {
        return restClientOptions.baseUrl;
    }
    if (restClientOptions.baseUrlKey) {
        return GATE_BASE_URLS[restClientOptions.baseUrlKey];
    }
    return GATE_BASE_URLS.live;
}
export const CHANNEL_ID = 'gateapinode';
export function isMessageEvent(msg) {
    if (typeof msg !== 'object' || !msg) {
        return false;
    }
    const message = msg;
    return message['type'] === 'message' && typeof message['data'] === 'string';
}
//# sourceMappingURL=requestUtils.js.map