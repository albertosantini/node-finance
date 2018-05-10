"use strict";

const test = require("tape");

const csv = require("../lib/parse-csv");
const quotes = require("../lib/yahoo-quotes");

test("Google Quotes tests", t => {
    const params = {
        symbol: "GOOGL",
        beginDate: new Date(2013, 0, 2), // Jan 2nd, 2013
        endDate: new Date(2013, 3, 6) // Apr 6th, 2013
    };

    t.plan(2);

    quotes.getHistoricalQuotesFromYahoo(params, (err, symbol, res) => {
        if (!err) {
            const prices = csv.parse(res, {
                skipHeader: true,
                column: 4, // close prices
                reverse: true // from oldest to newest
            });

            t.equal("391.916931", prices[0], "get oldest price");
            t.equal("367.742737", prices[prices.length - 1], "get newest price");
        }
    });
});
