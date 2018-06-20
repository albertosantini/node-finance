"use strict";

const test = require("tape");

const quotes = require("../lib/quotes");

test("Quotes tests", t => {
    t.plan(10);

    quotes.getQuotes(["YHOO"], new Date("Sat Aug 06 2011 12:00:00"), (err, res) => {
        t.equal(err, "Not Found", "not found for unknown symbol");
        t.notOk(res[0], "no data for unknown symbol");
    });

    quotes.getQuotes(["YHOO", "IBM"], new Date("Sat Aug 06 2011 12:00:00"), (err, res) => {
        t.equal(err, "Not Found", "not found for mixed unknown symbol");
        t.notOk(res[0], "no data for mixed unknown symbol");
    });

    quotes.getQuotes(["IBM"], new Date("Sat Aug 06 2011 12:00:00"), (err, res) => {
        t.notOk(err, "check error for getting quotes before ref date in the past");
        t.ok(res[0].beforeRefDate.length > 0, "get quotes before ref date in the past");
        t.ok(res[0].afterRefDate.length > 0, "get quotes after ref date in the past");
    });

    quotes.getQuotes(["IBM"], new Date(), (err, res) => {
        t.notOk(err, "check error for getting quotes before today");
        t.ok(res[0].beforeRefDate.length > 0, "get quotes before today");
        t.ok(res[0].afterRefDate.length === 0, "get quotes after today");
    });
});
