"use strict";

var test = require("tape"),
    rf = require("../lib/risk-free-rate");

test("Risk free rate tests", function (t) {
    t.plan(1);

    rf.getRiskFreeRateFromYahoo(function (err, res) {
        t.ok(!err && isFinite(res), "get risk free from YAHOO");

    });
});
