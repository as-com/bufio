/*!
 * struct.js - struct object for bcoin
 * Copyright (c) 2018, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

import BufferReader from "./reader";
import BufferWriter, {IWriter} from "./writer";
import StaticWriter from "./staticwriter";

/**
 * Struct
 */

export default class Struct {
	constructor() {
	}

	inject(obj: Struct) {
		// assert(obj instanceof this.constructor);
		return this.decode(obj.encode());
	}

	clone() {
		const copy = new Struct();
		return copy.inject(this);
	}

	/*
     * Bindable
     */

	getSize(extra?) {
		return -1;
	}

	write(bw: IWriter, extra?) {
		return bw;
	}

	read(br: BufferReader, extra?) {
		return this;
	}

	toString(): string {
		return Object.prototype.toString.call(this);
	}

	fromString(str: string, extra?) {
		return this;
	}

	getJSON() {
		return this;
	}

	fromJSON(json: any, extra?) {
		return this;
	}

	fromOptions(options: any, extra?) {
		return this;
	}

	from(options: any, extra?) {
		return this.fromOptions(options, extra);
	}

	format() {
		return this.getJSON();
	}

	/*
     * API
     */

	encode(extra?) {
		const size = this.getSize(extra);
		const bw = size === -1
			? new BufferWriter()
			: new StaticWriter(size);
		this.write(bw, extra);
		return bw.render();
	}

	decode(data: Buffer, extra?) {
		const br = new BufferReader(data);
		this.read(br, extra);
		return this;
	}

	toHex(extra?) {
		return this.encode(extra).toString('hex');
	}

	fromHex(str: string, extra?) {
		// assert(typeof str === 'string');

		const size = str.length >>> 1;
		const data = Buffer.from(str, 'hex');

		if (data.length !== size)
			throw new Error('Invalid hex string.');

		return this.decode(data, extra);
	}

	toBase64(extra?) {
		return this.encode(extra).toString('base64');
	}

	fromBase64(str: string, extra?) {
		// assert(typeof str === 'string');

		const min = (((str.length - 3) & ~3) * 3) / 4 | 0;
		const data = Buffer.from(str, 'base64');

		if (data.length < min)
			throw new Error('Invalid base64 string.');

		return this.decode(data, extra);
	}

	toJSON() {
		return this.getJSON();
	}

	inspect() {
		return this.format();
	}

	/*
     * Static API
     */

	static read(br: BufferReader, extra?) {
		return new this().read(br, extra);
	}

	static decode(data: Buffer, extra?) {
		return new this().decode(data, extra);
	}

	static fromHex(str: string, extra?) {
		return new this().fromHex(str, extra);
	}

	static fromBase64(str: string, extra?) {
		return new this().fromBase64(str, extra);
	}

	static fromString(str: string, extra?) {
		return new this().fromString(str, extra);
	}

	static fromJSON(json: any, extra?) {
		return new this().fromJSON(json, extra);
	}

	static fromOptions(options: any, extra?) {
		return new this().fromOptions(options, extra);
	}

	static from(options: any, extra?) {
		return new this().from(options, extra);
	}

	/*
     * Aliases
     */

	toWriter(bw: BufferWriter, extra?) {
		return this.write(bw, extra);
	}

	fromReader(br: BufferReader, extra?) {
		return this.read(br, extra);
	}

	toRaw(extra?) {
		return this.encode(extra);
	}

	fromRaw(data: Buffer, extra?) {
		return this.decode(data, extra);
	}

	/*
     * Static Aliases
     */

	static fromReader(br: BufferReader, extra?) {
		return this.read(br, extra);
	}

	static fromRaw(data: Buffer, extra?) {
		return this.decode(data, extra);
	}
}

