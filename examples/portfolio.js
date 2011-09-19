/*jslint node:true, sloppy:true */

var finance = require("../lib/finance");

var params = {};

params.prods = ["IBM", "YHOO", "MSFT"];
params.referenceDate = new Date("Sat, 06 Aug 2011 12:00:00 GMT");
params.targetReturn = undefined;
params.lows = [0, 0, 0];
params.highs = [-1, -1, -1];

finance.portfolio.getOptimalPortfolio(params, function (res) {
    var i;

    console.log("Portfolio assets are the following: " + params.prods);
    for (i = 0; i < params.prods.length; i += 1) {
        console.log("Optimal weight for " + params.prods[i] +
            " is " + res.optim.solution[i]);
    }
    console.log(res);
    // Optimal weights: 0.27107,0.2688,0.46013
});
