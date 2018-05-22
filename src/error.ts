/*!
 * error.js - encoding error for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

/**
 * Encoding Error
 * @extends {Error}
 */

export default class EncodingError extends Error {
	type: string;

	/**
	 * Create an encoding error.
	 * @constructor
	 * @param {Number} offset
	 * @param {String} reason
	 * @param start
	 */
	constructor(offset: number, reason: string, start?: Function) {
		super();

		this.type = 'EncodingError';
		this.message = `${reason} (offset=${offset}).`;

		if (Error.captureStackTrace)
			Error.captureStackTrace(this, start || EncodingError);
	}
}
