/*!
 * bufio.js - buffer utilities for javascript
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const encoding = require("./encoding");
exports.encoding = encoding;
const reader_1 = require("./reader");
const staticwriter_1 = require("./staticwriter");
const writer_1 = require("./writer");
const sizewriter_1 = require("./sizewriter");
const hashwriter_1 = require("./hashwriter");
var error_1 = require("./error");
exports.EncodingError = error_1.default;
var reader_2 = require("./reader");
exports.BufferReader = reader_2.default;
var writer_2 = require("./writer");
exports.BufferWriter = writer_2.default;
var staticwriter_2 = require("./staticwriter");
exports.StaticWriter = staticwriter_2.default;
var sizewriter_2 = require("./sizewriter");
exports.SizeWriter = sizewriter_2.default;
var hashwriter_2 = require("./hashwriter");
exports.HashWriter = hashwriter_2.default;
var struct_1 = require("./struct");
exports.Struct = struct_1.default;
function read(data, zeroCopy) {
    return new reader_1.default(data, zeroCopy);
}
exports.read = read;
function write(size) {
    return size != null
        ? new staticwriter_1.default(size)
        : new writer_1.default();
}
exports.write = write;
function pool(size) {
    return staticwriter_1.default.pool(size);
}
exports.pool = pool;
function size(_size) {
    return new sizewriter_1.default(); // TODO
    // return new SizeWriter(_size);
}
exports.size = size;
function hash(ctx) {
    return new hashwriter_1.default(ctx);
}
exports.hash = hash;
//# sourceMappingURL=bufio.js.map