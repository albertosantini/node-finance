"use strict";

const test = require("tape");

const csv = require("../lib/parse-csv");
const quotes = require("../lib/yahoo-quotes");

test("Yahoo Quotes tests", t => {
    t.plan(3);

    quotes.getHistoricalQuotesFromYahoo({
        symbol: "GOOGL",
        beginDate: new Date(2013, 0, 2), // Jan 2nd, 2013
        endDate: new Date(2013, 3, 6) // Apr 6th, 2013
    }, (err, symbol, res) => {
        t.notOk(err, "check error for getting prices");
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

    // quotes.getHistoricalQuotesFromYahoo({
    //     symbol: "IBM190118C00100000",
    //     beginDate: new Date(2013, 0, 2), // Jan 2nd, 2013
    //     endDate: new Date(2013, 3, 6) // Apr 6th, 2013
    // }, (err, symbol, res) => {
    //     t.equal(err, "Not Found", "not found for unknown symbol");
    //     t.notOk(res, "no data for unknown symbol");
    // });

    // quotes.getHistoricalQuotesFromYahoo({
    //     symbol: "CEC.VI",
    //     beginDate: new Date(2017, 7, 13), // Aug 13th, 2017
    //     endDate: new Date(2018, 5, 23) // Jun 23th, 2018
    // }, (err, symbol, res) => {
    //     t.equal(err, "contains missing values", "missing values");
    //     t.notOk(res, "no data for missing values");
    // });

});
