"use strict";

var vows = require("vows"),
    assert = require("assert"),
    finance = require("../lib/finance");

vows.describe("Portfolio tests").addBatch({
    "getOptimalPortfolio": {
        topic: function () {
            var params = {};

            params.prods = ["IBM", "YHOO", "MSFT"];
            params.referenceDate = "Sat Aug 06 2011 12:00:00";
            params.targetReturn = undefined;
            params.lows = [0, 0, 0];
            params.highs = [-1, -1, -1];

            finance.portfolio.getOptimalPortfolio(params, this.callback);
        },

        "get the portfolio weights": function (err, topic) {
            if (!err) {
                assert(0.27107, topic.optim.solution[0].toFixed(5));
                assert(0.26880, topic.optim.solution[1].toFixed(5));
                assert(0.46013, topic.optim.solution[2].toFixed(5));
            }
        }
    }

}).export(module);
