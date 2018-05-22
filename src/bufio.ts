/*!
 * bufio.js - buffer utilities for javascript
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

import * as encoding from "./encoding";
import EncodingError from "./error";
import BufferReader from "./reader";
import BufferWriter from "./writer";
import StaticWriter from "./staticwriter";
import SizeWriter from "./sizewriter";
import HashWriter from "./hashwriter";
import Struct from "./struct";

export {encoding}
export {EncodingError}
export {BufferReader}
export {BufferWriter}
export {StaticWriter}
export {SizeWriter}
export {HashWriter}
export {Struct}

export function read(data, zeroCopy) {
	return new BufferReader(data, zeroCopy);
}

export function write(size) {
	return size != null
		? new StaticWriter(size)
		: new BufferWriter();
}

export function pool(size) {
	return StaticWriter.pool(size);
}

export function size(_size) {
	return new SizeWriter(); // TODO
	// return new SizeWriter(_size);
}

export function hash(ctx) {
	return new HashWriter(ctx);
}
