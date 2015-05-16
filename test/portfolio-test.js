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
                assert(Math.abs(0.2710700942608004 - topic.optim.solution[0])
                    < 1e-15);
                assert(Math.abs(0.2687956256571377 - topic.optim.solution[1])
                    < 1e-15);
                assert(Math.abs(0.4601342800820619 - topic.optim.solution[2])
                    < 1e-15);
            }
        }
    }

}).export(module);
