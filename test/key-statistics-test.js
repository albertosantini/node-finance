"use strict";

var test = require("tape"),
    keyStats = require("../lib/key-statistics");

test("Key statistics tests", function (t) {
    keyStats.getKeyStatistics({symbol: "IBM"}, function (err, res) {
        t.plan(3);

        t.equal(!err && res.length, 58,
            "key statistics count");
        t.equal(!err && res[0].label, "Market Cap (intraday):",
            "key market cap label");
        t.equal(!err && res[57].value, "27 May 1999",
            "ibm last split date");
    });
});
