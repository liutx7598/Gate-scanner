"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.neverGuard = neverGuard;
function neverGuard(x, msg) {
    return new Error(`Unhandled value exception "${x}", ${msg}`);
}
//# sourceMappingURL=misc-util.js.map