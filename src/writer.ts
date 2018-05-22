/*!
 * writer.js - buffer writer for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

import * as assert from "assert";
import {I64 as I64_t, U64} from "n64";
import * as encoding from "./encoding";
import EncodingError from "./error";

/*
 * Constants
 */

const SEEK = 0;
const UI8 = 1;
const UI16 = 2;
const UI16BE = 3;
const UI32 = 4;
const UI32BE = 5;
const UI64 = 6;
const UI64BE = 7;
const UI64N = 8;
const UI64BEN = 9;
const I8 = 10;
const I16 = 11;
const I16BE = 12;
const I32 = 13;
const I32BE = 14;
const I64 = 15;
const I64BE = 16;
const I64N = 17;
const I64BEN = 18;
const FL = 19;
const FLBE = 20;
const DBL = 21;
const DBLBE = 22;
const VARINT = 23;
const VARINTN = 24;
const VARINT2 = 25;
const VARINT2N = 26;
const BYTES = 27;
const STR = 28;
const CHECKSUM = 29;
const FILL = 30;

export interface IWriter {
	/**
	 * Allocate and render the final buffer.
	 * @returns {Buffer} Rendered buffer.
	 */

	render(): Buffer | number;
	/**
	 * Get size of data written so far.
	 * @returns {Number}
	 */

	getSize(): any;
	/**
	 * Seek to relative offset.
	 * @param {Number} offset
	 */

	seek(offset: number): this;
	/**
	 * Destroy the buffer writer. Remove references to `ops`.
	 */

	destroy(): this;
	/**
	 * Write uint8.
	 * @param {Number} value
	 */

	writeU8(value: number): this;
	/**
	 * Write uint16le.
	 * @param {Number} value
	 */

	writeU16(value: number): this;
	/**
	 * Write uint16be.
	 * @param {Number} value
	 */

	writeU16BE(value: number): this;
	/**
	 * Write uint32le.
	 * @param {Number} value
	 */

	writeU32(value: number): this;
	/**
	 * Write uint32be.
	 * @param {Number} value
	 */

	writeU32BE(value: number): this;
	/**
	 * Write uint64le.
	 * @param {Number} value
	 */

	writeU64(value: number): this;
	/**
	 * Write uint64be.
	 * @param {Number} value
	 */

	writeU64BE(value: number): this;
	/**
	 * Write uint64le.
	 * @param {U64} value
	 */

	writeU64N(value: U64): this;
	/**
	 * Write uint64be.
	 * @param {U64} value
	 */

	writeU64BEN(value: U64): this;
	/**
	 * Write int8.
	 * @param {Number} value
	 */

	writeI8(value: number): this;
	/**
	 * Write int16le.
	 * @param {Number} value
	 */

	writeI16(value: number): this;
	/**
	 * Write int16be.
	 * @param {Number} value
	 */

	writeI16BE(value: number): this;
	/**
	 * Write int32le.
	 * @param {Number} value
	 */

	writeI32(value: number): this;
	/**
	 * Write int32be.
	 * @param {Number} value
	 */

	writeI32BE(value: number): this;
	/**
	 * Write int64le.
	 * @param {Number} value
	 */

	writeI64(value: number): this;
	/**
	 * Write int64be.
	 * @param {Number} value
	 */

	writeI64BE(value: number): this;
	/**
	 * Write int64le.
	 * @param {I64_t} value
	 */

	writeI64N(value: I64_t): this;
	/**
	 * Write int64be.
	 * @param {I64_t} value
	 */

	writeI64BEN(value: I64_t): this;
	/**
	 * Write float le.
	 * @param {Number} value
	 */

	writeFloat(value): this;
	/**
	 * Write float be.
	 * @param {Number} value
	 */

	writeFloatBE(value: number): this;
	/**
	 * Write double le.
	 * @param {Number} value
	 */

	writeDouble(value: number): this;
	/**
	 * Write double be.
	 * @param {Number} value
	 */

	writeDoubleBE(value: number): this;
	/**
	 * Write a varint.
	 * @param {Number} value
	 */

	writeVarint(value: number): this;
	/**
	 * Write a varint.
	 * @param {U64} value
	 */

	writeVarintN(value: U64): this;
	/**
	 * Write a varint (type 2).
	 * @param {Number} value
	 */

	writeVarint2(value: number): this;
	/**
	 * Write a varint (type 2).
	 * @param {U64} value
	 */

	writeVarint2N(value: U64): this;
	/**
	 * Write bytes.
	 * @param {Buffer} value
	 */

	writeBytes(value: Buffer): this;
	/**
	 * Write bytes with a varint length before them.
	 * @param {Buffer} value
	 */

	writeVarBytes(value: Buffer): this;
	/**
	 * Copy bytes.
	 * @param {Buffer} value
	 * @param {Number} start
	 * @param {Number} end
	 */

	copy(value: Buffer, start: number, end: number): this;
	/**
	 * Write string to buffer.
	 * @param {String} value
	 * @param {String?} enc - Any buffer-supported encoding.
	 */

	writeString(value: string | Buffer, enc?: string): this;
	/**
	 * Write a 32 byte hash.
	 * @param {Hash} value
	 */

	writeHash(value: any): this;
	/**
	 * Write a string with a varint length before it.
	 * @param {String} value
	 * @param {String?} enc - Any buffer-supported encoding.
	 */

	writeVarString(value: string, enc?: string): this;
	/**
	 * Write a null-terminated string.
	 * @param {String|Buffer} value
	 * @param {String?} enc - Any buffer-supported encoding.
	 */

	writeNullString(value: string | Buffer, enc?: string): this;
	/**
	 * Calculate and write a checksum for the data written so far.
	 * @param {Function} hash
	 */

	writeChecksum(hash: Function): this;
	/**
	 * Fill N bytes with value.
	 * @param {Number} value
	 * @param {Number} size
	 */

	fill(value: number, size: number): this;
}

/**
 * Buffer Writer
 */

export default class BufferWriter implements IWriter {
	ops: WriteOp[];
	offset: number;

	/**
	 * Create a buffer writer.
	 * @constructor
	 */

	constructor() {
		this.ops = [];
		this.offset = 0;
	}

	/**
	 * Allocate and render the final buffer.
	 * @returns {Buffer} Rendered buffer.
	 */

	render() {
		const data = Buffer.allocUnsafe(this.offset);

		let off = 0;

		for (let op of this.ops as any[]) { // TODO
			switch (op.type) {
				case SEEK:
					off += op.value;
					break;
				case UI8:
					off = data.writeUInt8(op.value, off, true);
					break;
				case UI16:
					off = data.writeUInt16LE(op.value, off, true);
					break;
				case UI16BE:
					off = data.writeUInt16BE(op.value, off, true);
					break;
				case UI32:
					off = data.writeUInt32LE(op.value, off, true);
					break;
				case UI32BE:
					off = data.writeUInt32BE(op.value, off, true);
					break;
				case UI64:
					off = encoding.writeU64(data, op.value, off);
					break;
				case UI64BE:
					off = encoding.writeU64BE(data, op.value, off);
					break;
				case UI64N:
					off = encoding.writeU64N(data, op.value, off);
					break;
				case UI64BEN:
					off = encoding.writeU64BEN(data, op.value, off);
					break;
				case I8:
					off = data.writeInt8(op.value, off, true);
					break;
				case I16:
					off = data.writeInt16LE(op.value, off, true);
					break;
				case I16BE:
					off = data.writeInt16BE(op.value, off, true);
					break;
				case I32:
					off = data.writeInt32LE(op.value, off, true);
					break;
				case I32BE:
					off = data.writeInt32BE(op.value, off, true);
					break;
				case I64:
					off = encoding.writeI64(data, op.value, off);
					break;
				case I64BE:
					off = encoding.writeI64BE(data, op.value, off);
					break;
				case I64N:
					off = encoding.writeI64N(data, op.value, off);
					break;
				case I64BEN:
					off = encoding.writeI64BEN(data, op.value, off);
					break;
				case FL:
					off = data.writeFloatLE(op.value, off, true);
					break;
				case FLBE:
					off = data.writeFloatBE(op.value, off, true);
					break;
				case DBL:
					off = data.writeDoubleLE(op.value, off, true);
					break;
				case DBLBE:
					off = data.writeDoubleBE(op.value, off, true);
					break;
				case VARINT:
					off = encoding.writeVarint(data, op.value, off);
					break;
				case VARINTN:
					off = encoding.writeVarintN(data, op.value, off);
					break;
				case VARINT2:
					off = encoding.writeVarint2(data, op.value, off);
					break;
				case VARINT2N:
					off = encoding.writeVarint2N(data, op.value, off);
					break;
				case BYTES:
					off += op.data.copy(data, off);
					break;
				case STR:
					off += data.write(op.value, off, op.enc);
					break;
				case CHECKSUM:
					off += op.func(data.slice(0, off)).copy(data, off, 0, 4);
					break;
				case FILL:
					data.fill(op.value, off, off + op.size);
					off += op.size;
					break;
				default:
					assert(false, 'Bad type.');
					break;
			}
		}

		if (off !== data.length)
			throw new EncodingError(off, 'Out of bounds write');

		this.destroy();

		return data;
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
		this.ops.push(new NumberOp(SEEK, offset));
		return this;
	}

	/**
	 * Destroy the buffer writer. Remove references to `ops`.
	 */

	destroy() {
		this.ops.length = 0;
		this.offset = 0;
		return this;
	}

	/**
	 * Write uint8.
	 * @param {Number} value
	 */

	writeU8(value: number) {
		this.offset += 1;
		this.ops.push(new NumberOp(UI8, value));
		return this;
	}

	/**
	 * Write uint16le.
	 * @param {Number} value
	 */

	writeU16(value: number) {
		this.offset += 2;
		this.ops.push(new NumberOp(UI16, value));
		return this;
	}

	/**
	 * Write uint16be.
	 * @param {Number} value
	 */

	writeU16BE(value: number) {
		this.offset += 2;
		this.ops.push(new NumberOp(UI16BE, value));
		return this;
	}

	/**
	 * Write uint32le.
	 * @param {Number} value
	 */

	writeU32(value: number) {
		this.offset += 4;
		this.ops.push(new NumberOp(UI32, value));
		return this;
	}

	/**
	 * Write uint32be.
	 * @param {Number} value
	 */

	writeU32BE(value: number) {
		this.offset += 4;
		this.ops.push(new NumberOp(UI32BE, value));
		return this;
	}

	/**
	 * Write uint64le.
	 * @param {Number} value
	 */

	writeU64(value: number) {
		this.offset += 8;
		this.ops.push(new NumberOp(UI64, value));
		return this;
	}

	/**
	 * Write uint64be.
	 * @param {Number} value
	 */

	writeU64BE(value: number) {
		this.offset += 8;
		this.ops.push(new NumberOp(UI64BE, value));
		return this;
	}

	/**
	 * Write uint64le.
	 * @param {U64} value
	 */

	writeU64N(value: U64) {
		this.offset += 8;
		this.ops.push(new NumberOp(UI64N, value));
		return this;
	}

	/**
	 * Write uint64be.
	 * @param {U64} value
	 */

	writeU64BEN(value: U64) {
		this.offset += 8;
		this.ops.push(new NumberOp(UI64BEN, value));
		return this;
	}

	/**
	 * Write int8.
	 * @param {Number} value
	 */

	writeI8(value: number) {
		this.offset += 1;
		this.ops.push(new NumberOp(I8, value));
		return this;
	}

	/**
	 * Write int16le.
	 * @param {Number} value
	 */

	writeI16(value: number) {
		this.offset += 2;
		this.ops.push(new NumberOp(I16, value));
		return this;
	}

	/**
	 * Write int16be.
	 * @param {Number} value
	 */

	writeI16BE(value: number) {
		this.offset += 2;
		this.ops.push(new NumberOp(I16BE, value));
		return this;
	}

	/**
	 * Write int32le.
	 * @param {Number} value
	 */

	writeI32(value: number) {
		this.offset += 4;
		this.ops.push(new NumberOp(I32, value));
		return this;
	}

	/**
	 * Write int32be.
	 * @param {Number} value
	 */

	writeI32BE(value: number) {
		this.offset += 4;
		this.ops.push(new NumberOp(I32BE, value));
		return this;
	}

	/**
	 * Write int64le.
	 * @param {Number} value
	 */

	writeI64(value: number) {
		this.offset += 8;
		this.ops.push(new NumberOp(I64, value));
		return this;
	}

	/**
	 * Write int64be.
	 * @param {Number} value
	 */

	writeI64BE(value: number) {
		this.offset += 8;
		this.ops.push(new NumberOp(I64BE, value));
		return this;
	}

	/**
	 * Write int64le.
	 * @param {I64_t} value
	 */

	writeI64N(value: I64_t) {
		this.offset += 8;
		this.ops.push(new NumberOp(I64N, value));
		return this;
	}

	/**
	 * Write int64be.
	 * @param {I64_t} value
	 */

	writeI64BEN(value: I64_t) {
		this.offset += 8;
		this.ops.push(new NumberOp(I64BEN, value));
		return this;
	}

	/**
	 * Write float le.
	 * @param {Number} value
	 */

	writeFloat(value) {
		this.offset += 4;
		this.ops.push(new NumberOp(FL, value));
		return this;
	}

	/**
	 * Write float be.
	 * @param {Number} value
	 */

	writeFloatBE(value: number) {
		this.offset += 4;
		this.ops.push(new NumberOp(FLBE, value));
		return this;
	}

	/**
	 * Write double le.
	 * @param {Number} value
	 */

	writeDouble(value: number) {
		this.offset += 8;
		this.ops.push(new NumberOp(DBL, value));
		return this;
	}

	/**
	 * Write double be.
	 * @param {Number} value
	 */

	writeDoubleBE(value: number) {
		this.offset += 8;
		this.ops.push(new NumberOp(DBLBE, value));
		return this;
	}

	/**
	 * Write a varint.
	 * @param {Number} value
	 */

	writeVarint(value: number) {
		this.offset += encoding.sizeVarint(value);
		this.ops.push(new NumberOp(VARINT, value));
		return this;
	}

	/**
	 * Write a varint.
	 * @param {U64} value
	 */

	writeVarintN(value: U64) {
		this.offset += encoding.sizeVarintN(value);
		this.ops.push(new NumberOp(VARINTN, value));
		return this;
	}

	/**
	 * Write a varint (type 2).
	 * @param {Number} value
	 */

	writeVarint2(value: number) {
		this.offset += encoding.sizeVarint2(value);
		this.ops.push(new NumberOp(VARINT2, value));
		return this;
	}

	/**
	 * Write a varint (type 2).
	 * @param {U64} value
	 */

	writeVarint2N(value: U64) {
		this.offset += encoding.sizeVarint2N(value);
		this.ops.push(new NumberOp(VARINT2N, value));
		return this;
	}

	/**
	 * Write bytes.
	 * @param {Buffer} value
	 */

	writeBytes(value: Buffer) {
		if (value.length === 0)
			return this;

		this.offset += value.length;
		this.ops.push(new BufferOp(BYTES, value));

		return this;
	}

	/**
	 * Write bytes with a varint length before them.
	 * @param {Buffer} value
	 */

	writeVarBytes(value: Buffer) {
		this.offset += encoding.sizeVarint(value.length);
		this.ops.push(new NumberOp(VARINT, value.length));

		if (value.length === 0)
			return this;

		this.offset += value.length;
		this.ops.push(new BufferOp(BYTES, value));

		return this;
	}

	/**
	 * Copy bytes.
	 * @param {Buffer} value
	 * @param {Number} start
	 * @param {Number} end
	 */

	copy(value: Buffer, start: number, end: number) {
		assert(end >= start);
		value = value.slice(start, end);
		this.writeBytes(value);
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
		this.ops.push(new StringOp(STR, value, enc));

		return this;
	}

	/**
	 * Write a 32 byte hash.
	 * @param {Hash} value
	 */

	writeHash(value: any) { // TODO
		if (typeof value !== 'string') {
			assert(value.length === 32);
			this.writeBytes(value);
			return this;
		}
		assert(value.length === 64);
		this.writeString(value, 'hex');
		return this;
	}

	/**
	 * Write a string with a varint length before it.
	 * @param {String} value
	 * @param {String?} enc - Any buffer-supported encoding.
	 */

	writeVarString(value: string, enc?: string) {
		if (value.length === 0) {
			this.ops.push(new NumberOp(VARINT, 0));
			return this;
		}

		const size = Buffer.byteLength(value, enc);

		this.offset += encoding.sizeVarint(size);
		this.offset += size;

		this.ops.push(new NumberOp(VARINT, size));
		this.ops.push(new StringOp(STR, value, enc));

		return this;
	}

	/**
	 * Write a null-terminated string.
	 * @param {String|Buffer} value
	 * @param {String?} enc - Any buffer-supported encoding.
	 */

	writeNullString(value: string | Buffer, enc?: string) {
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
		this.ops.push(new FunctionOp(CHECKSUM, hash));
		return this;
	}

	/**
	 * Fill N bytes with value.
	 * @param {Number} value
	 * @param {Number} size
	 */

	fill(value: number, size: number) {
		assert(size >= 0);

		if (size === 0)
			return this;

		this.offset += size;
		this.ops.push(new FillOp(FILL, value, size));

		return this;
	}
}

/*
 * Helpers
 */

export class WriteOp {
	type: number;

	constructor(type: number) {
		this.type = type;
	}
}

class NumberOp extends WriteOp {
	value: any;

	constructor(type: number, value: any) {
		super(type);
		this.value = value;
	}
}

class BufferOp extends WriteOp {
	data: Buffer;

	constructor(type: number, data: Buffer) {
		super(type);
		this.data = data;
	}
}

class StringOp extends WriteOp {
	value: string | Buffer;
	enc: string;

	constructor(type: number, value: string | Buffer, enc: string) {
		super(type);
		this.value = value;
		this.enc = enc;
	}
}

class FunctionOp extends WriteOp {
	func: Function;

	constructor(type: number, func: Function) {
		super(type);
		this.func = func;
	}
}

class FillOp extends WriteOp {
	value: number;
	size: number;

	constructor(type: number, value: number, size: number) {
		super(type);
		this.value = value;
		this.size = size;
	}
}

