export const DefaultLogger = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    trace: (..._params) => {
        // console.log(_params);
    },
    info: (...params) => {
        console.info(params);
    },
    error: (...params) => {
        console.error(params);
    },
};
//# sourceMappingURL=logger.js.map