"use strict";

var keyStats = require("../lib/key-statistics");

keyStats.getKeyStatistics({ symbol: "IBM" }, function (err, stats) {
    if (!err) {
        console.log(stats);
    }    
);
