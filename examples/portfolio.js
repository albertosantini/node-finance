/*jshint node:true */

"use strict";

var assert = require("assert"),
    finance = require("../lib/finance");

var params = {};

params.prods = ["IBM", "YHOO", "MSFT"];
params.referenceDate = "Sat Aug 06 2011 12:00:00";
params.targetReturn = undefined;
params.lows = [0, 0, 0];
params.highs = [-1, -1, -1];

finance.portfolio.getOptimalPortfolio(params, function (err, res) {
    var i;

    if (!err) {
        console.log("Portfolio assets are the following: " + params.prods);
        for (i = 0; i < params.prods.length; i += 1) {
            console.log("Optimal weight for " + params.prods[i] +
                " is " + res.optim.solution[i]);
        }
        assert.deepEqual([
            0.27107009426080064,
            0.26879562565713805,
            0.46013428008206114
        ], res.optim.solution);
    } else {
        console.log(res.message);
    }
});
