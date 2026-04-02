export type LogParams = null | any;
export declare const DefaultLogger: {
    trace: (..._params: LogParams) => void;
    info: (...params: LogParams) => void;
    error: (...params: LogParams) => void;
};
export type DefaultLogger = typeof DefaultLogger;
