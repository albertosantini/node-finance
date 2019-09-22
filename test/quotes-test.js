"use strict";

const test = require("tape");

const quotes = require("../lib/quotes");

test("Quotes tests", t => {
    t.plan(7);

    // quotes.getQuotes(["CEC.VI"], new Date("Sat Jun 23 2018 12:00:00"), (err, res) => {
    //     t.equal(err, "CEC.VI contains missing values", "missing values");
    //     t.notOk(res, "no data for missing values");
    // });

    quotes.getQuotes(["YHOO"], new Date("Sat Aug 06 2011 12:00:00"), (err, res) => {
        t.equal(err, "YHOO Not Found", "not found for unknown symbol");
        t.notOk(res, "no data for unknown symbol");
    });

    quotes.getQuotes(["YHOO", "IBM"], new Date("Sat Aug 06 2011 12:00:00"), (err, res) => {
        t.equal(err, "YHOO Not Found", "not found for mixed unknown symbol");
        t.notOk(res, "no data for mixed unknown symbol");
    });

    // quotes.getQuotes(["IBM"], new Date("Sat Aug 06 2011 12:00:00"), (err, res) => {
    //     t.notOk(err, "check error for getting quotes before ref date in the past");
    //     t.ok(res[0].beforeRefDate.length > 0, "get quotes before ref date in the past");
    //     t.ok(res[0].afterRefDate.length > 0, "get quotes after ref date in the past");
    // });

    quotes.getQuotes(["IBM"], new Date(), (err, res) => {
        t.notOk(err, "check error for getting quotes before today");
        t.ok(res[0].beforeRefDate.length > 0, "get quotes before today");
        t.ok(res[0].afterRefDate.length === 0, "get quotes after today");
    });
});
