/*jslint node:true, sloppy:true */

var util = require("util"),
    finance = require("../lib/finance");

var params = {};

params.prods = ["IBM", "YHOO", "MSFT"];
params.referenceDate = "Sat Aug 06 2011 12:00:00 GMT+0200";
params.targetReturn = undefined;
params.lows = [0, 0, 0];
params.highs = [-1, -1, -1];

finance.portfolio.getScriptOptimalPortfolio(params, function (script) {
    console.log(script);
});

