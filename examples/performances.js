"use strict";

const assert = require("assert");

const finance = require("../lib/finance");
const util = require("../lib/util");

const x = [];
const weights = [];

x[0] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
x[1] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

weights[0] = 0.5;
weights[1] = 0.5;

const res = finance.performances.getPerformances(x, weights);

util.log(res);

assert.deepStrictEqual([1, 3, 6, 10, 15, 21, 28, 36, 45, 55], res);
