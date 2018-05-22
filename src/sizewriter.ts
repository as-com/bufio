/*!
 * sizewriter.js - buffer writer for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

import * as encoding from "./encoding";
import {I64, U64} from "n64";
import {IWriter} from "./writer";

/**
 * Size Writer
 */

export default class SizeWriter implements IWriter {
	offset: number;

	/**
	 * Create a size writer.
	 * @constructor
	 */

	constructor() {
		this.offset = 0;
	}

	/**
	 * Calculate size.
	 * @returns {Number}
	 */

	render() {
		const size = this.offset;
		this.destroy();
		return size;
	}

	/**
	 * Get size of data written so far.
	 * @returns {Number}
	 */

	getSize() {
		return this.offset;
	}

	/**
	 * Seek to relative offset.
	 * @param {Number} offset
	 */

	seek(offset: number) {
		this.offset += offset;
		return this;
	}

	/**
	 * Destroy the buffer writer.
	 */

	destroy() {
		this.offset = 0;
		return this;
	}

	/**
	 * Write uint8.
	 * @param {Number} value
	 */

	writeU8(value: number) {
		this.offset += 1;
		return this;
	}

	/**
	 * Write uint16le.
	 * @param {Number} value
	 */

	writeU16(value: number) {
		this.offset += 2;
		return this;
	}

	/**
	 * Write uint16be.
	 * @param {Number} value
	 */

	writeU16BE(value: number) {
		this.offset += 2;
		return this;
	}

	/**
	 * Write uint32le.
	 * @param {Number} value
	 */

	writeU32(value: number) {
		this.offset += 4;
		return this;
	}

	/**
	 * Write uint32be.
	 * @param {Number} value
	 */

	writeU32BE(value: number) {
		this.offset += 4;
		return this;
	}

	/**
	 * Write uint64le.
	 * @param {Number} value
	 */

	writeU64(value: number) {
		this.offset += 8;
		return this;
	}

	/**
	 * Write uint64be.
	 * @param {Number} value
	 */

	writeU64BE(value: number) {
		this.offset += 8;
		return this;
	}

	/**
	 * Write uint64le.
	 * @param {U64} value
	 */

	writeU64N(value: U64) {
		this.offset += 8;
		return this;
	}

	/**
	 * Write uint64be.
	 * @param {U64} value
	 */

	writeU64BEN(value: U64) {
		this.offset += 8;
		return this;
	}

	/**
	 * Write int8.
	 * @param {Number} value
	 */

	writeI8(value: number) {
		this.offset += 1;
		return this;
	}

	/**
	 * Write int16le.
	 * @param {Number} value
	 */

	writeI16(value: number) {
		this.offset += 2;
		return this;
	}

	/**
	 * Write int16be.
	 * @param {Number} value
	 */

	writeI16BE(value: number) {
		this.offset += 2;
		return this;
	}

	/**
	 * Write int32le.
	 * @param {Number} value
	 */

	writeI32(value: number) {
		this.offset += 4;
		return this;
	}

	/**
	 * Write int32be.
	 * @param {Number} value
	 */

	writeI32BE(value: number) {
		this.offset += 4;
		return this;
	}

	/**
	 * Write int64le.
	 * @param {Number} value
	 */

	writeI64(value: number) {
		this.offset += 8;
		return this;
	}

	/**
	 * Write int64be.
	 * @param {Number} value
	 */

	writeI64BE(value: number) {
		this.offset += 8;
		return this;
	}

	/**
	 * Write int64le.
	 * @param {I64} value
	 */

	writeI64N(value: I64) {
		this.offset += 8;
		return this;
	}

	/**
	 * Write int64be.
	 * @param {I64} value
	 */

	writeI64BEN(value: I64) {
		this.offset += 8;
		return this;
	}

	/**
	 * Write float le.
	 * @param {Number} value
	 */

	writeFloat(value: number) {
		this.offset += 4;
		return this;
	}

	/**
	 * Write float be.
	 * @param {Number} value
	 */

	writeFloatBE(value: number) {
		this.offset += 4;
		return this;
	}

	/**
	 * Write double le.
	 * @param {Number} value
	 */

	writeDouble(value: number) {
		this.offset += 8;
		return this;
	}

	/**
	 * Write double be.
	 * @param {Number} value
	 */

	writeDoubleBE(value: number) {
		this.offset += 8;
		return this;
	}

	/**
	 * Write a varint.
	 * @param {Number} value
	 */

	writeVarint(value: number) {
		this.offset += encoding.sizeVarint(value);
		return this;
	}

	/**
	 * Write a varint.
	 * @param {U64} value
	 */

	writeVarintN(value: U64) {
		this.offset += encoding.sizeVarintN(value);
		return this;
	}

	/**
	 * Write a varint (type 2).
	 * @param {Number} value
	 */

	writeVarint2(value: number) {
		this.offset += encoding.sizeVarint2(value);
		return this;
	}

	/**
	 * Write a varint (type 2).
	 * @param {U64} value
	 */

	writeVarint2N(value: U64) {
		this.offset += encoding.sizeVarint2N(value);
		return this;
	}

	/**
	 * Write bytes.
	 * @param {Buffer} value
	 */

	writeBytes(value) {
		this.offset += value.length;
		return this;
	}

	/**
	 * Write bytes with a varint length before them.
	 * @param {Buffer} value
	 */

	writeVarBytes(value: Buffer) {
		this.writeVarint(value.length);
		this.writeBytes(value);
		return this;
	}

	/**
	 * Copy bytes.
	 * @param {Buffer} value
	 * @param {Number} start
	 * @param {Number} end
	 */

	copy(value: Buffer, start: number, end: number) {
		this.offset += end - start;
		return this;
	}

	/**
	 * Write string to buffer.
	 * @param {String} value
	 * @param {String?} enc - Any buffer-supported encoding.
	 */

	writeString(value: string | Buffer, enc?: string) {
		if (value.length === 0)
			return this;

		this.offset += Buffer.byteLength(value, enc);
		return this;
	}

	/**
	 * Write a 32 byte hash.
	 * @param {Hash} value
	 */

	writeHash(value) { // TODO
		this.offset += 32;
		return this;
	}

	/**
	 * Write a string with a varint length before it.
	 * @param {String} value
	 * @param {String?} enc - Any buffer-supported encoding.
	 */

	writeVarString(value: string, enc?: string) {
		if (value.length === 0) {
			this.offset += 1;
			return this;
		}

		const size = Buffer.byteLength(value, enc);

		this.writeVarint(size);

		this.offset += size;
		return this;
	}

	/**
	 * Write a null-terminated string.
	 * @param {String|Buffer} value
	 * @param {String?} enc - Any buffer-supported encoding.
	 */

	writeNullString(value: string | Buffer, enc: string) {
		this.writeString(value, enc);
		this.writeU8(0);
		return this;
	}

	/**
	 * Calculate and write a checksum for the data written so far.
	 * @param {Function} hash
	 */

	writeChecksum(hash: Function) {
		this.offset += 4;
		return this;
	}

	/**
	 * Fill N bytes with value.
	 * @param {Number} value
	 * @param {Number} size
	 */

	fill(value: number, size: number) {
		this.offset += size;
		return this;
	}
}
