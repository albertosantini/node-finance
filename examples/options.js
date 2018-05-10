"use strict";

const util = require("../lib/util");
const riskFreeRate = require("../lib/risk-free-rate");
const optionChain = require("../lib/option-chain");

riskFreeRate.getRiskFreeRateFromYahoo((err, res) => {
    if (!err) {
        util.log(`Risk Free Rate (3 months): ${res}`);
    }
});

optionChain.getOptionChainFromYahoo({ symbol: "IBM" }, (err, res) => {
    if (!err) {
        util.log(`Strike: ${res.strike}`);
        util.log(`Expire Date: ${res.expDateStr}`);
        util.log(`First call strike: ${res.calls[0].strike}`);
        util.log(`First put strike: ${res.puts[0].strike}`);
    }
});
