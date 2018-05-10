"use strict";

const test = require("tape");

const rf = require("../lib/risk-free-rate");

test("Risk free rate tests", t => {
    t.plan(1);

    rf.getRiskFreeRateFromYahoo((err, res) => {
        t.ok(!err && isFinite(res), "get risk free from YAHOO");
    });
});
