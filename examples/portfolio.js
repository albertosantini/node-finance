/*jslint node:true, sloppy:true */

var assert = require("assert"),
    finance = require("../lib/finance");

var params = {};

params.prods = ["IBM", "YHOO", "MSFT"];
params.referenceDate = "Sat Aug 06 2011 12:00:00";
params.targetReturn = undefined;
params.lows = [0, 0, 0];
params.highs = [-1, -1, -1];

finance.portfolio.getOptimalPortfolio(params, function (res) {
    var i;

    if (res.message === "") {
        console.log("Portfolio assets are the following: " + params.prods);
        for (i = 0; i < params.prods.length; i += 1) {
            console.log("Optimal weight for " + params.prods[i] +
                " is " + res.optim.solution[i]);
        }
        assert.deepEqual([
            0.27107002864827245,
            0.26879557077764216,
            0.4601344005740855
        ], res.optim.solution);
    } else {
        console.log(res.message);
    }
});
