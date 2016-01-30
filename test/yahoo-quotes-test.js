"use strict";

var test = require("tape"),
    csv = require("../lib/parse-csv"),
    quotes = require("../lib/yahoo-quotes");

test("YAHOO Quotes tests", function (t) {
    var params = {
        symbol: "YHOO",
        beginDate: new Date(2013, 0, 2), // Jan 2nd, 2013
        endDate: new Date(2013, 3, 6) // Apr 6th, 2013
    };

    t.plan(2);

    quotes.getHistoricalQuotesFromYahoo(params, function (err, symbol, res) {
        var prices;

        if (!err) {
            prices = csv.parse(res, {
                skipHeader: true,
                column: 4, // close prices
                reverse: true // from oldest to newest
            });
            t.equal(prices[0], "19.860001", "get oldest price");
            t.equal(prices[prices.length - 1], "23.299999", "get newest price");
        }
    });
});
