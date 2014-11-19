"use strict";

var vows = require("vows"),
    assert = require("assert"),
    optionChain = require("../lib/option-chain");

var expiration;

vows.describe("Option Chain tests").addBatch({
    "get option chain from YAHOO": {
        topic: function () {
            optionChain.getOptionChainFromYahoo("IBM", this.callback);
        },

        "strike is a number": function (err, topic) {
            if (err) {
                throw err;
            }
            assert.ok(isFinite(topic.strike));
        },

        "expire date": function (err, topic) {
            if (err) {
                throw err;
            }
            expiration = topic.expDate.toString();
            assert.ok(expiration !== "Invalid Date");
        },

        "first call strike is a number": function (err, topic) {
            if (err) {
                throw err;
            }
            assert.ok(isFinite(topic.calls[0].strike));
        },

        "first put strike is a number": function (err, topic) {
            if (err) {
                throw err;
            }
            assert.ok(isFinite(topic.puts[0].strike));
        },

        "with expiration date": {
            topic: function () {
                var date = new Date(expiration),
                    dateStr = date.getFullYear() + "-" +
                        (date.getMonth() + 1) + "-" + date.getDate();

                optionChain.getOptionChainFromYahoo({
                    symbol: "IBM",
                    expiration: dateStr
                }, this.callback);
            },

            "strike is a number": function (err, topic) {
                if (err) {
                    throw err;
                }
                assert.ok(isFinite(topic.strike));
            },

            "expire date": function (err, topic) {
                if (err) {
                    throw err;
                }
                assert.ok(topic.expDate.toString() !== "Invalid Date");
            },

            "first call strike is a number": function (err, topic) {
                if (err) {
                    throw err;
                }
                assert.ok(isFinite(topic.calls[0].strike));
            },

            "first put strike is a number": function (err, topic) {
                if (err) {
                    throw err;
                }
                assert.ok(isFinite(topic.puts[0].strike));
            }
        }
    }

}).export(module);
