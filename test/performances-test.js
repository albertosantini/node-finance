"use strict";

var vows = require("vows"),
    assert = require("assert"),
    finance = require("../lib/finance");

vows.describe("Performances tests").addBatch({
    "getPerformances": {
        topic: function () {
            var x = [],
                weights = [];

            x[0] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            x[1] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            weights[0] = 0.5;
            weights[1] = 0.5;

            return finance.performances.getPerformances(x, weights);
        },

        "get the performances": function (topic) {
            assert.deepEqual([1, 3, 6, 10, 15, 21, 28, 36, 45, 55], topic);
        }
    }

}).export(module);
