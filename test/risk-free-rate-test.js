"use strict";

var vows = require("vows"),
    assert = require("assert"),
    rf = require("../lib/risk-free-rate");

vows.describe("Risk free rate tests").addBatch({
    "get risk free from YAHOO": {
        topic: function () {
            rf.getRiskFreeRateFromYahoo(this.callback);
        },

        "risk free is a number": function (topic) {
            assert.ok(isFinite(topic) && topic < 1);
        }
    }

}).export(module);


