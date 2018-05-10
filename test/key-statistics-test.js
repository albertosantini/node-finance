"use strict";

const test = require("tape");

const keyStats = require("../lib/key-statistics");

test("Key statistics tests", t => {
    keyStats.getKeyStatistics({ symbol: "IBM" }, (err, res) => {
        t.plan(2);

        const ketStatisticsCount = Object.keys(res).length;

        t.equal(!err && ketStatisticsCount, 48,
            "key statistics count");
        t.equal(!err && res.enterpriseValue !== undefined, true, // eslint-disable-line no-undefined
            "key enterprise value");
    });
});
