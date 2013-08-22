"use strict";

var vows = require("vows"),
    assert = require("assert"),
    optionChain = require("../lib/option-chain");

vows.describe("Option Chain tests").addBatch({
    "get option chain from YAHOO": {
        topic: function () {
            optionChain.getOptionChainFromYahoo("IBM", this.callback);
        },

        "strike is a number": function (topic) {
            assert.ok(isFinite(topic.strike));
        },

        "expire date": function (topic) {
            assert.ok(topic.expDate.toString() !== "Invalid Date");
        },

        "first call strike is a number": function (topic) {
            assert.ok(isFinite(topic.calls[0].strike));
        },

        "first put strike is a number": function (topic) {
            assert.ok(isFinite(topic.puts[0].strike));
        }
    }

}).export(module);
