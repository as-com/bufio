/*!
 * encoding.js - encoding utils for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

import {I64, U64} from "n64";

import EncodingError from "./error";
/*
 * Constants
 */

const BASE128_MAX = U64.UINT64_MAX.shrn(7);
const {MAX_SAFE_INTEGER} = Number;

/*
 * Module
 */

/**
 * Read uint64le as a js number.
 * @param {Buffer} data
 * @param {Number} off
 * @returns {Number}
 * @throws on num > MAX_SAFE_INTEGER
 */

export function readU64(data: Buffer, off: number) {
	const hi = data.readUInt32LE(off + 4, true);
	const lo = data.readUInt32LE(off, true);
	enforce((hi & 0xffe00000) === 0, off, 'Number exceeds 2^53-1');
	return hi * 0x100000000 + lo;
}

/**
 * Read uint64be as a js number.
 * @param {Buffer} data
 * @param {Number} off
 * @returns {Number}
 * @throws on num > MAX_SAFE_INTEGER
 */

export function readU64BE(data: Buffer, off: number) {
	const hi = data.readUInt32BE(off, true);
	const lo = data.readUInt32BE(off + 4, true);
	enforce((hi & 0xffe00000) === 0, off, 'Number exceeds 2^53-1');
	return hi * 0x100000000 + lo;
}

/**
 * Read int64be as a js number.
 * @param {Buffer} data
 * @param {Number} off
 * @returns {Number}
 * @throws on num > MAX_SAFE_INTEGER
 */

export function readI64(data: Buffer, off: number) {
	const hi = data.readInt32LE(off + 4, true);
	const lo = data.readUInt32LE(off, true);
	enforce(isSafe(hi, lo), 'Number exceeds 2^53-1');
	return hi * 0x100000000 + lo;
}

/**
 * Read int64be as a js number.
 * @param {Buffer} data
 * @param {Number} off
 * @returns {Number}
 * @throws on num > MAX_SAFE_INTEGER
 */

export function readI64BE(data: Buffer, off: number) {
	const hi = data.readInt32BE(off, true);
	const lo = data.readUInt32BE(off + 4, true);
	enforce(isSafe(hi, lo), 'Number exceeds 2^53-1');
	return hi * 0x100000000 + lo;
}

/**
 * Write a javascript number as a uint64le.
 * @param {Buffer} dst
 * @param {Number} num
 * @param {Number} off
 * @returns {Number} Buffer offset.
 * @throws on num > MAX_SAFE_INTEGER
 */

export function writeU64(dst: Buffer, num: number, off: number) {
	return write64(dst, num, off, false);
}

/**
 * Write a javascript number as a uint64be.
 * @param {Buffer} dst
 * @param {Number} num
 * @param {Number} off
 * @returns {Number} Buffer offset.
 * @throws on num > MAX_SAFE_INTEGER
 */

export function writeU64BE(dst: Buffer, num: number, off: number) {
	return write64(dst, num, off, true);
}

/**
 * Write a javascript number as an int64le.
 * @param {Buffer} dst
 * @param {Number} num
 * @param {Number} off
 * @returns {Number} Buffer offset.
 * @throws on num > MAX_SAFE_INTEGER
 */

export function writeI64(dst: Buffer, num: number, off: number) {
	return write64(dst, num, off, false);
}

/**
 * Write a javascript number as an int64be.
 * @param {Buffer} dst
 * @param {Number} num
 * @param {Number} off
 * @returns {Number} Buffer offset.
 * @throws on num > MAX_SAFE_INTEGER
 */

export function writeI64BE(dst: Buffer, num: number, off: number) {
	return write64(dst, num, off, true);
}

/**
 * Read uint64le.
 * @param {Buffer} data
 * @param {Number} off
 * @returns {U64}
 */

export function readU64N(data: Buffer, off: number) {
	return U64.readLE(data, off);
}

/**
 * Read uint64be.
 * @param {Buffer} data
 * @param {Number} off
 * @returns {U64}
 */

export function readU64BEN(data: Buffer, off: number) {
	return U64.readBE(data, off);
}

/**
 * Read int64le.
 * @param {Buffer} data
 * @param {Number} off
 * @returns {I64}
 */

export function readI64N(data: Buffer, off: number) {
	return I64.readLE(data, off);
}

/**
 * Read int64be.
 * @param {Buffer} data
 * @param {Number} off
 * @returns {I64}
 */

export function readI64BEN(data: Buffer, off: number) {
	return I64.readBE(data, off);
}

/**
 * Write uint64le.
 * @param {Buffer} dst
 * @param {U64} num
 * @param {Number} off
 * @returns {Number} Buffer offset.
 */

export function writeU64N(dst: Buffer, num: U64, off: number): number {
	enforce(!num.sign, off, 'Signed');
	return num.writeLE(dst, off);
}

/**
 * Write uint64be.
 * @param {Buffer} dst
 * @param {U64} num
 * @param {Number} off
 * @returns {Number} Buffer offset.
 */

export function writeU64BEN(dst: Buffer, num: U64, off: number) {
	enforce(!num.sign, off, 'Signed');
	return num.writeBE(dst, off);
}

/**
 * Write int64le.
 * @param {Buffer} dst
 * @param {U64} num
 * @param {Number} off
 * @returns {Number} Buffer offset.
 */

export function writeI64N(dst: Buffer, num: U64, off: number) {
	enforce(num.sign, off, 'Not signed');
	return num.writeLE(dst, off);
}

/**
 * Write int64be.
 * @param {Buffer} dst
 * @param {I64} num
 * @param {Number} off
 * @returns {Number} Buffer offset.
 */

export function writeI64BEN(dst: Buffer, num: I64, off: number) {
	enforce(num.sign, off, 'Not signed');
	return num.writeBE(dst, off);
}

/**
 * Read a varint.
 * @param {Buffer} data
 * @param {Number} off
 * @returns {Object}
 */

export function readVarint(data: Buffer, off: number): Varint {
	let value, size;

	check(off < data.length, off);

	switch (data[off]) {
		case 0xff:
			size = 9;
			check(off + size <= data.length, off);
			value = readU64(data, off + 1);
			enforce(value > 0xffffffff, off, 'Non-canonical varint');
			break;
		case 0xfe:
			size = 5;
			check(off + size <= data.length, off);
			value = data.readUInt32LE(off + 1, true);
			enforce(value > 0xffff, off, 'Non-canonical varint');
			break;
		case 0xfd:
			size = 3;
			check(off + size <= data.length, off);
			value = data[off + 1] | (data[off + 2] << 8);
			enforce(value >= 0xfd, off, 'Non-canonical varint');
			break;
		default:
			size = 1;
			value = data[off];
			break;
	}

	return new Varint(size, value);
}

/**
 * Write a varint.
 * @param {Buffer} dst
 * @param {Number} num
 * @param {Number} off
 * @returns {Number} Buffer offset.
 */

export function writeVarint(dst: Buffer, num: number, off: number) {
	if (num < 0xfd) {
		dst[off++] = num & 0xff;
		return off;
	}

	if (num <= 0xffff) {
		dst[off++] = 0xfd;
		dst[off++] = num & 0xff;
		dst[off++] = (num >> 8) & 0xff;
		return off;
	}

	if (num <= 0xffffffff) {
		dst[off++] = 0xfe;
		dst[off++] = num & 0xff;
		dst[off++] = (num >> 8) & 0xff;
		dst[off++] = (num >> 16) & 0xff;
		dst[off++] = num >>> 24;
		return off;
	}

	dst[off++] = 0xff;
	off = writeU64(dst, num, off);
	return off;
}

/**
 * Calculate size of varint.
 * @param {Number} num
 * @returns {Number} size
 */

export function sizeVarint(num: number) {
	if (num < 0xfd)
		return 1;

	if (num <= 0xffff)
		return 3;

	if (num <= 0xffffffff)
		return 5;

	return 9;
}

/**
 * Read a varint.
 * @param {Buffer} data
 * @param {Number} off
 * @returns {Object}
 */

export function readVarintN(data: Buffer, off: number): Varint {
	check(off < data.length, off);

	if (data[off] === 0xff) {
		const size = 9;
		check(off + size <= data.length, off);
		const value = readU64N(data, off + 1);
		enforce(value.hi !== 0, off, 'Non-canonical varint');
		return new Varint(size, value);
	}

	const {size, value} = readVarint(data, off);

	return new Varint(size, U64.fromInt(value as number)); // TODO
}

/**
 * Write a varint.
 * @param {Buffer} dst
 * @param {U64} num
 * @param {Number} off
 * @returns {Number} Buffer offset.
 */

export function writeVarintN(dst: Buffer, num: U64, off: number): number {
	enforce(!num.sign, off, 'Signed');

	if (num.hi !== 0) {
		dst[off++] = 0xff;
		return writeU64N(dst, num, off);
	}

	return writeVarint(dst, num.toInt(), off);
}

/**
 * Calculate size of varint.
 * @param {U64} num
 * @returns {Number} size
 */

export function sizeVarintN(num: U64) {
	enforce(!num.sign, 0, 'Signed');

	if (num.hi !== 0)
		return 9;

	return sizeVarint(num.toInt());
}

/**
 * Read a varint (type 2).
 * @param {Buffer} data
 * @param {Number} off
 * @returns {Object}
 */

export function readVarint2(data: Buffer, off: number) {
	let num = 0;
	let size = 0;

	for (; ;) {
		check(off < data.length, off);

		const ch = data[off++];
		size += 1;

		// Number.MAX_SAFE_INTEGER >>> 7
		enforce(num <= 0x3fffffffffff - (ch & 0x7f), off, 'Number exceeds 2^53-1');

		// num = (num << 7) | (ch & 0x7f);
		num = (num * 0x80) + (ch & 0x7f);

		if ((ch & 0x80) === 0)
			break;

		enforce(num !== MAX_SAFE_INTEGER, off, 'Number exceeds 2^53-1');
		num += 1;
	}

	return new Varint(size, num);
}

/**
 * Write a varint (type 2).
 * @param {Buffer} dst
 * @param {Number} num
 * @param {Number} off
 * @returns {Number} Buffer offset.
 */

export function writeVarint2(dst: Buffer, num: number, off: number) {
	const tmp = [];

	let len = 0;

	for (; ;) {
		tmp[len] = (num & 0x7f) | (len ? 0x80 : 0x00);
		if (num <= 0x7f)
			break;
		// num = (num >>> 7) - 1;
		num = ((num - (num % 0x80)) / 0x80) - 1;
		len += 1;
	}

	check(off + len + 1 <= dst.length, off);

	do {
		dst[off++] = tmp[len];
	} while (len--);

	return off;
}

/**
 * Calculate size of varint (type 2).
 * @param {Number} num
 * @returns {Number} size
 */

export function sizeVarint2(num: number) {
	let size = 0;

	for (; ;) {
		size += 1;
		if (num <= 0x7f)
			break;
		// num = (num >>> 7) - 1;
		num = ((num - (num % 0x80)) / 0x80) - 1;
	}

	return size;
}

/**
 * Read a varint (type 2).
 * @param {Buffer} data
 * @param {Number} off
 * @returns {Object}
 */

export function readVarint2N(data: Buffer, off: number) {
	const num = new U64();

	let size = 0;

	for (; ;) {
		check(off < data.length, off);

		const ch = data[off++];
		size += 1;

		enforce(num.lte(BASE128_MAX), off, 'Number exceeds 2^64-1');

		num.ishln(7).iorn(ch & 0x7f);

		if ((ch & 0x80) === 0)
			break;

		enforce(!num.eq(U64.UINT64_MAX), off, 'Number exceeds 2^64-1');
		num.iaddn(1);
	}

	return new Varint(size, num);
}

/**
 * Write a varint (type 2).
 * @param {Buffer} dst
 * @param {U64} num
 * @param {Number} off
 * @returns {Number} Buffer offset.
 */

export function writeVarint2N(dst: Buffer, num: U64, off: number) {
	enforce(!num.sign, off, 'Signed');

	if (num.hi === 0)
		return writeVarint2(dst, num.toInt(), off);

	num = num.clone();

	const tmp = [];

	let len = 0;

	for (; ;) {
		tmp[len] = num.andln(0x7f) | (len ? 0x80 : 0x00);
		if (num.lten(0x7f))
			break;
		num.ishrn(7).isubn(1);
		len += 1;
	}

	enforce(off + len + 1 <= dst.length, off, 'Out of bounds write');

	do {
		dst[off++] = tmp[len];
	} while (len--);

	return off;
}

/**
 * Calculate size of varint (type 2).
 * @param {U64} num
 * @returns {Number} size
 */

export function sizeVarint2N(num: U64) {
	enforce(!num.sign, 0, 'Signed');

	if (num.hi === 0)
		return sizeVarint2(num.toInt());

	num = num.clone();

	let size = 0;

	for (; ;) {
		size += 1;
		if (num.lten(0x7f))
			break;
		num.ishrn(7).isubn(1);
	}

	return size;
}

/**
 * Get size of varint-prefixed bytes.
 * @param {Buffer} data
 * @returns {Number}
 */

export function sizeVarBytes(data: Buffer): number {
	return sizeVarint(data.length) + data.length;
}

/**
 * Get size of varint-prefixed length.
 * @param {Number} len
 * @returns {Number}
 */

export function sizeVarlen(len: number) {
	return sizeVarint(len) + len;
}

/**
 * Get size of varint-prefixed string.
 * @param {String} str
 * @param {String} enc
 * @returns {Number}
 */

export function sizeVarString(str: string | Buffer, enc: string): number {
	if (typeof str !== 'string')
		return sizeVarBytes(str);

	const len = Buffer.byteLength(str, enc);

	return sizeVarint(len) + len;
}

/*
 * Helpers
 */

function isSafe(hi: number, lo: number) {
	if (hi < 0) {
		hi = ~hi;
		if (lo === 0)
			hi += 1;
	}

	return (hi & 0xffe00000) === 0;
}

function write64(dst: Buffer, num: number, off: number, be: boolean) {
	let neg = false;

	if (num < 0) {
		num = -num;
		neg = true;
	}

	let hi = (num * (1 / 0x100000000)) | 0;
	let lo = num | 0;

	if (neg) {
		if (lo === 0) {
			hi = (~hi + 1) | 0;
		} else {
			hi = ~hi;
			lo = ~lo + 1;
		}
	}

	if (be) {
		off = dst.writeInt32BE(hi, off, true);
		off = dst.writeInt32BE(lo, off, true);
	} else {
		off = dst.writeInt32LE(lo, off, true);
		off = dst.writeInt32LE(hi, off, true);
	}

	return off;
}

export class Varint {
	size: number;
	value: number | U64;

	constructor(size: number, value: number | U64) {
		this.size = size;
		this.value = value;
	}
}

function check(value, offset) {
	if (!value)
		throw new EncodingError(offset, 'Out of bounds read', check);
}

function enforce(value, offset, reason?) {
	if (!value)
		throw new EncodingError(offset, reason, enforce);
}
