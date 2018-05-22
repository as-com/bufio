/*!
 * bufio.js - buffer utilities for javascript
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

import * as encoding from "./encoding";

import BufferReader from './reader';
import StaticWriter from './staticwriter';
import BufferWriter from './writer';
import SizeWriter from './sizewriter';
import HashWriter from './hashwriter';


export {default as EncodingError} from "./error";
export {default as BufferReader} from "./reader";
export {default as BufferWriter} from "./writer";
export {default as StaticWriter} from "./staticwriter";
export {default as SizeWriter} from "./sizewriter";
export {default as HashWriter} from "./hashwriter";
export {default as Struct} from "./struct";

export {encoding}

export function read(data: Buffer, zeroCopy?: boolean) {
	return new BufferReader(data, zeroCopy);
}

export function write(): BufferWriter
export function write(size: number): StaticWriter
export function write(size?: number) {
	return size != null
		? new StaticWriter(size)
		: new BufferWriter();
}

export function pool(size: number) {
	return StaticWriter.pool(size);
}

export function size(_size) {
	return new SizeWriter(); // TODO
	// return new SizeWriter(_size);
}

export function hash(ctx) {
	return new HashWriter(ctx);
}
