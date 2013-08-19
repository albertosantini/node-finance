"use strict";

var vows = require("vows"),
    assert = require("assert"),
    csv = require("../lib/parse-csv"),
    quotes = require("../lib/yahoo-quotes");

vows.describe("YAHOO Quotes tests").addBatch({
    "get YAHOO quotes": {
        topic: function () {
            var params = {
                symbol: "YHOO",
                beginDate: new Date(2013, 0, 2), // Jan 2nd, 2013
                endDate: new Date(2013, 3, 6) // Apr 6th, 2013
            };

            quotes.getHistoricalQuotesFromYahoo(params, this.callback);
        },

        "check YAHOO quotes": function (err, symbol, topic) {
            var prices;

            if (!err) {
                prices = csv.parse(topic, {
                    skipHeader: true,
                    column: 4, // close prices
                    reverse: true // from oldest to newest
                });
                assert.equal(prices[0], 19.86); // oldest price
                assert.equal(prices[prices.length - 1], 23.30); // newest price
            }
        }
    }

}).export(module);
