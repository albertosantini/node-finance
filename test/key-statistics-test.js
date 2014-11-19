"use strict";

var vows = require("vows"),
    assert = require("assert"),
    keyStats = require("../lib/key-statistics");

vows.describe("Key statistics tests").addBatch({
    "get key statistics": {
        topic: function () {
            keyStats.getKeyStatistics({symbol: "IBM"}, this.callback);
        },

        "key statistics count": function (err, topic) {
            if (err) {
                throw err;
            }
            assert.equal(58, topic.length);
        },

        "key market cap label": function (err, topic) {
            if (err) {
                throw err;
            }
            assert.equal("Market Cap (intraday):", topic[0].label);
        },

        "ibm last split date": function (err, topic) {
            if (err) {
                throw err;
            }
            assert.equal("May 27, 1999", topic[57].value);
        }
    }

}).export(module);
