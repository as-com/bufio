/*!
 * error.js - encoding error for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Encoding Error
 * @extends {Error}
 */
class EncodingError extends Error {
    /**
     * Create an encoding error.
     * @constructor
     * @param {Number} offset
     * @param {String} reason
     * @param start
     */
    constructor(offset, reason, start) {
        super();
        this.type = 'EncodingError';
        this.message = `${reason} (offset=${offset}).`;
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, start || EncodingError);
    }
}
exports.default = EncodingError;
//# sourceMappingURL=error.js.map