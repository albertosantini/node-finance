"use strict";

const util = require("../lib/util");
const keyStats = require("../lib/key-statistics");

keyStats.getKeyStatistics({ symbol: "IBM" }, (err, stats) => {
    if (!err) {
        util.log(stats);
    }
});
