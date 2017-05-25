"use strict";

var test = require("tape"),
    keyStats = require("../lib/key-statistics");

test("Key statistics tests", function (t) {
    keyStats.getKeyStatistics({symbol: "IBM"}, function (err, res) {
        t.plan(2);

        var ketStatisticsCount = Object.keys(res).length;

        t.equal(!err && ketStatisticsCount, 47,
            "key statistics count");
        t.equal(!err && res.enterpriseValue !== undefined, true,
            "key enterprise value");
    });
});
