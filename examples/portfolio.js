"use strict";

const assert = require("assert");

const finance = require("../lib/finance");
const util = require("../lib/util");

const params = {
    prods: ["IBM", "GOOGL", "MSFT"],
    referenceDate: "Sat Aug 06 2011 12:00:00",
    lows: [0, 0, 0],
    highs: [-1, -1, -1]
};

finance.portfolio.getOptimalPortfolio(params, (err, res) => {
    if (!err) {
        util.log(`Portfolio assets are the following: ${params.prods}`);
        for (let i = 0; i < params.prods.length; i += 1) {
            util.log(`Optimal weight for ${params.prods[i]} is ${res.optim.solution[i]}`);
        }
        assert.strictEqual(0.47201, +res.optim.solution[0].toFixed(5));
        assert.strictEqual(0.02359, +res.optim.solution[1].toFixed(5));
        assert.strictEqual(0.50439, +res.optim.solution[2].toFixed(5));
    } else {
        util.log(err);
    }
});
