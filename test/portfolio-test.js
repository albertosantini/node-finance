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
                assert.deepEqual([
                    0.27107002864827245,
                    0.26879557077764216,
                    0.4601344005740855
                ], topic.optim.solution);
            }
        }
    }

}).export(module);
