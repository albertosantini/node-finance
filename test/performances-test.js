"use strict";

const test = require("tape");

const finance = require("../lib/finance");

test("Performances tests", t => {
    const x = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        ],
        weights = [0.5, 0.5],
        res = finance.performances.getPerformances(x, weights);

    t.plan(1);

    t.deepEqual(res, [1, 3, 6, 10, 15, 21, 28, 36, 45, 55], "calc perf");
});
