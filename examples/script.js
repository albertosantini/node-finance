"use strict";

const finance = require("../lib/finance");
const util = require("../lib/util");

const params = {
    prods: ["IBM", "GOOGL", "MSFT"],
    referenceDate: "Sat Aug 06 2011 12:00:00 GMT+0200",
    lows: [0, 0, 0],
    highs: [-1, -1, -1]
};

finance.portfolio.getScriptOptimalPortfolio(params, (err, script) => {
    if (!err) {
        util.log(script);
    } else {
        util.log("Failed to load the script:", err);
    }
});
