"use strict";

const test = require("tape");

const keyStats = require("../lib/key-statistics");

test("Key statistics tests", t => {
    t.plan(5);

    keyStats.getKeyStatistics({ symbol: "IBM" }, (err, res) => {
        t.notOk(err, "check error for getting key stats");
        t.ok(Object.keys(res).length >= 48, "get count");
        t.ok(isFinite(res.enterpriseValue.raw), "get key enterprise value");
    });

    keyStats.getKeyStatistics({ symbol: "IBM190118C00100000" }, (err, res) => {
        t.equal(err, "Not Found", "not found for unknown symbol");
        t.notOk(res, "no data for unknown symbol");
    });
});
