"use strict";

var finance = require("../lib/finance"),
    assert = require("assert");

var x = [],
    weights = [],
    res;

x[0] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
x[1] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

weights[0] = 0.5;
weights[1] = 0.5;

res = finance.performances.getPerformances(x, weights);

console.log(res);

assert.deepEqual([1, 3, 6, 10, 15, 21, 28, 36, 45, 55], res);
