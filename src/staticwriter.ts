/*!
 * staticwriter.js - buffer writer for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

import * as assert from "assert";
import * as encoding from "./encoding";
import EncodingError from "./error";
import {I64, U64} from "n64";
import {IWriter} from "./writer";
/*
 * Constants
 */

const EMPTY = Buffer.alloc(0);
const POOLSIZE = 100 << 10;

let POOL = null;

/**
 * Statically Allocated Writer
 */

export default class StaticWriter implements IWriter {
	data: Buffer;
	offset: number;

	/**
	 * Statically allocated buffer writer.
	 * @constructor
	 * @param {Number|Buffer} options
	 */

	constructor(options?: number | Buffer) {
		this.data = EMPTY;
		this.offset = 0;

		if (options != null)
			this.init(options);
	}

	/**
	 * Initialize options.
	 * @param {Object} options
	 */

	init(options: Buffer | number) {
		if (Buffer.isBuffer(options)) {
			this.data = options;
			this.offset = 0;
			return this;
		}

		assert((options >>> 0) === options);

		this.data = Buffer.allocUnsafe(options);
		this.offset = 0;

		return this;
	}

	/**
	 * Allocate writer from preallocated 100kb pool.
	 * @param {Number} size
	 * @returns {StaticWriter}
	 */

	static pool(size: number) {
		if (size <= POOLSIZE) {
			if (!POOL)
				POOL = Buffer.allocUnsafeSlow(POOLSIZE);

			const bw = new StaticWriter();
			bw.data = POOL.slice(0, size);
			return bw;
		}

		return new StaticWriter(size);
	}

	/**
	 * Allocate and render the final buffer.
	 * @returns {Buffer} Rendered buffer.
	 */

	render() {
		const {data, offset} = this;

		if (offset !== data.length)
			throw new EncodingError(offset, 'Out of bounds write');

		this.destroy();

		return data;
	}

	/**
	 * Slice the final buffer at written offset.
	 * @returns {Buffer} Rendered buffer.
	 */

	slice() {
		const {data, offset} = this;

		if (offset > data.length)
			throw new EncodingError(offset, 'Out of bounds write');

		this.destroy();

		return data.slice(0, offset);
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
		this.data = EMPTY;
		this.offset = 0;
		return this;
	}

	/**
	 * Write uint8.
	 * @param {Number} value
	 */

	writeU8(value: number) {
		this.offset = this.data.writeUInt8(value, this.offset, true);
		return this;
	}

	/**
	 * Write uint16le.
	 * @param {Number} value
	 */

	writeU16(value: number) {
		this.offset = this.data.writeUInt16LE(value, this.offset, true);
		return this;
	}

	/**
	 * Write uint16be.
	 * @param {Number} value
	 */

	writeU16BE(value: number) {
		this.offset = this.data.writeUInt16BE(value, this.offset, true);
		return this;
	}

	/**
	 * Write uint32le.
	 * @param {Number} value
	 */

	writeU32(value: number) {
		this.offset = this.data.writeUInt32LE(value, this.offset, true);
		return this;
	}

	/**
	 * Write uint32be.
	 * @param {Number} value
	 */

	writeU32BE(value: number) {
		this.offset = this.data.writeUInt32BE(value, this.offset, true);
		return this;
	}

	/**
	 * Write uint64le.
	 * @param {Number} value
	 */

	writeU64(value: number) {
		this.offset = encoding.writeU64(this.data, value, this.offset);
		return this;
	}

	/**
	 * Write uint64be.
	 * @param {Number} value
	 */

	writeU64BE(value: number) {
		this.offset = encoding.writeU64BE(this.data, value, this.offset);
		return this;
	}

	/**
	 * Write uint64le.
	 * @param {U64} value
	 */

	writeU64N(value: U64) {
		this.offset = encoding.writeU64N(this.data, value, this.offset);
		return this;
	}

	/**
	 * Write uint64be.
	 * @param {U64} value
	 */

	writeU64BEN(value: U64) {
		this.offset = encoding.writeU64BEN(this.data, value, this.offset);
		return this;
	}

	/**
	 * Write int8.
	 * @param {Number} value
	 */

	writeI8(value: number) {
		this.offset = this.data.writeInt8(value, this.offset, true);
		return this;
	}

	/**
	 * Write int16le.
	 * @param {Number} value
	 */

	writeI16(value: number) {
		this.offset = this.data.writeInt16LE(value, this.offset, true);
		return this;
	}

	/**
	 * Write int16be.
	 * @param {Number} value
	 */

	writeI16BE(value: number) {
		this.offset = this.data.writeInt16BE(value, this.offset, true);
		return this;
	}

	/**
	 * Write int32le.
	 * @param {Number} value
	 */

	writeI32(value: number) {
		this.offset = this.data.writeInt32LE(value, this.offset, true);
		return this;
	}

	/**
	 * Write int32be.
	 * @param {Number} value
	 */

	writeI32BE(value: number) {
		this.offset = this.data.writeInt32BE(value, this.offset, true);
		return this;
	}

	/**
	 * Write int64le.
	 * @param {Number} value
	 */

	writeI64(value: number) {
		this.offset = encoding.writeI64(this.data, value, this.offset);
		return this;
	}

	/**
	 * Write int64be.
	 * @param {Number} value
	 */

	writeI64BE(value: number) {
		this.offset = encoding.writeI64BE(this.data, value, this.offset);
		return this;
	}

	/**
	 * Write int64le.
	 * @param {I64} value
	 */

	writeI64N(value: I64) {
		this.offset = encoding.writeI64N(this.data, value, this.offset);
		return this;
	}

	/**
	 * Write int64be.
	 * @param {I64} value
	 */

	writeI64BEN(value: I64) {
		this.offset = encoding.writeI64BEN(this.data, value, this.offset);
		return this;
	}

	/**
	 * Write float le.
	 * @param {Number} value
	 */

	writeFloat(value: number) {
		this.offset = this.data.writeFloatLE(value, this.offset, true);
		return this;
	}

	/**
	 * Write float be.
	 * @param {Number} value
	 */

	writeFloatBE(value: number) {
		this.offset = this.data.writeFloatBE(value, this.offset, true);
		return this;
	}

	/**
	 * Write double le.
	 * @param {Number} value
	 */

	writeDouble(value: number) {
		this.offset = this.data.writeDoubleLE(value, this.offset, true);
		return this;
	}

	/**
	 * Write double be.
	 * @param {Number} value
	 */

	writeDoubleBE(value: number) {
		this.offset = this.data.writeDoubleBE(value, this.offset, true);
		return this;
	}

	/**
	 * Write a varint.
	 * @param {Number} value
	 */

	writeVarint(value: number) {
		this.offset = encoding.writeVarint(this.data, value, this.offset);
		return this;
	}

	/**
	 * Write a varint.
	 * @param {U64} value
	 */

	writeVarintN(value: U64) {
		this.offset = encoding.writeVarintN(this.data, value, this.offset);
		return this;
	}

	/**
	 * Write a varint (type 2).
	 * @param {Number} value
	 */

	writeVarint2(value: number) {
		this.offset = encoding.writeVarint2(this.data, value, this.offset);
		return this;
	}

	/**
	 * Write a varint (type 2).
	 * @param {U64} value
	 */

	writeVarint2N(value: U64) {
		this.offset = encoding.writeVarint2N(this.data, value, this.offset);
		return this;
	}

	/**
	 * Write bytes.
	 * @param {Buffer} value
	 */

	writeBytes(value: Buffer) {
		if (value.length === 0)
			return this;

		value.copy(this.data, this.offset);

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
		const len = end - start;

		if (len === 0)
			return this;

		value.copy(this.data, this.offset, start, end);
		this.offset += len;

		return this;
	}

	/**
	 * Write string to buffer.
	 * @param {String} value
	 * @param {String?} enc - Any buffer-supported encoding.
	 */

	writeString(value: string, enc?: string) {
		if (value.length === 0)
			return this;

		const size = Buffer.byteLength(value, enc);

		this.data.write(value, this.offset, undefined, enc); // TODO

		this.offset += size;

		return this;
	}

	/**
	 * Write a 32 byte hash.
	 * @param {Hash} value
	 */

	writeHash(value: string | any) { // TODO
		if (typeof value !== 'string') {
			assert(value.length === 32);
			this.writeBytes(value);
			return this;
		}
		assert(value.length === 64);
		this.data.write(value, this.offset, undefined, 'hex'); // TODO
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
			this.writeVarint(0);
			return this;
		}

		const size = Buffer.byteLength(value, enc);

		this.writeVarint(size);
		this.data.write(value, this.offset, undefined, enc); // TODO

		this.offset += size;

		return this;
	}

	/**
	 * Write a null-terminated string.
	 * @param {String|Buffer} value
	 * @param {String?} enc - Any buffer-supported encoding.
	 */

	writeNullString(value: string, enc?: string) { // TODO
		this.writeString(value, enc);
		this.writeU8(0);
		return this;
	}

	/**
	 * Calculate and write a checksum for the data written so far.
	 * @param {Function} hash
	 */

	writeChecksum(hash) {
		const data = this.data.slice(0, this.offset);
		hash(data).copy(this.data, this.offset, 0, 4);
		this.offset += 4;
		return this;
	}

	/**
	 * Fill N bytes with value.
	 * @param {Number} value
	 * @param {Number} size
	 */

	fill(value, size) {
		assert(size >= 0);

		if (size === 0)
			return this;

		this.data.fill(value, this.offset, this.offset + size);
		this.offset += size;

		return this;
	}
}
