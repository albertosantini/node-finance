"use strict";

var vows = require("vows"),
    assert = require("assert"),
    quotes = require("../lib/quotes");

vows.describe("Quotes tests").addBatch({
    "get quotes with ref date in the past": {
        topic: function () {
            quotes.getQuotes(["YHOO"],
                new Date("Sat Aug 06 2011 12:00:00"),
                this.callback);
        },

        "check quotes with ref date in the past": function (err, qs) {
            assert.ok(!err && qs[0].beforeRefDate.length > 0);
            assert.ok(!err && qs[0].afterRefDate.length > 0);
        }
    },

    "get quotes": {
        topic: function () {
            quotes.getQuotes(["YHOO"], new Date(), this.callback);
        },

        "check quotes": function (err, qs) {
            assert.ok(!err && qs[0].beforeRefDate.length > 0);
            assert.ok(!err && qs[0].afterRefDate.length === 0);
        }
    }

}).export(module);
