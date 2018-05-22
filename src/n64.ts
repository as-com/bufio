declare module "n64" {
	class N64 {
		shrn(n: number): this;

		sign: number;

		lo: number;
		hi: number;

		readLE(data: Buffer, off: number): this;

		readBE(data: Buffer, off: number): this;

		writeLE(data: Buffer, off: number): number;

		writeBE(data: Buffer, off: number): number;

		iaddn(num: number): this;

		eq(obj: N64): boolean;

		lte(obj: N64): boolean;

		lten(num: number): boolean;

		ishln(num: number): this;

		iorn(num: number): this;

		andln(num: number): number;

		ishrn(num: number): this;

		isubn(num: number): this;


		clone(): this;

		toInt(): number;
	}

	export class I64 extends N64 {
		static readLE(data: Buffer, off: number): I64;

		static readBE(data: Buffer, off: number): I64;

		static writeLE(data: Buffer, off: number): I64;

		static writeBE(data: Buffer, off: number): I64;

		static fromInt(lo: number): I64;
	}

	export class U64 extends N64 {
		static UINT64_MAX: U64;

		static readLE(data: Buffer, off: number): U64;

		static readBE(data: Buffer, off: number): U64;

		static writeLE(data: Buffer, off: number): U64;

		static writeBE(data: Buffer, off: number): U64;

		static fromInt(lo: number): U64;
	}
}
