"use strict";

var util = require("util"),
    riskFreeRate = require("../lib/risk-free-rate"),
    optionChain = require("../lib/option-chain");

riskFreeRate.getRiskFreeRateFromYahoo(function (err, res) {
    console.log("Risk Free Rate (3 months): " + res);
});

optionChain.getOptionChainFromYahoo("IBM", function (err, res) {
    console.log("Strike: " + res.strike);
    console.log("Expire Date: " + res.expDateStr);
    console.log("First call: " + util.inspect(res.calls[0]));
    console.log("First put: " + util.inspect(res.puts[0]));
});
