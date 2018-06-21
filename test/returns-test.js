"use strict";

const test = require("tape");

const returns = require("../lib/returns");

test("Returns tests", t => {
    t.plan(15);

    returns.getReturns(["YHOO"], new Date("Sat Aug 06 2011 12:00:00"), (err, res) => {
        t.equal(err, "YHOO Not Found", "not found for unknown symbol");
        t.notOk(res, "no data for unknown symbol");
    });

    returns.getReturns(["YHOO", "IBM"], new Date("Sat Aug 06 2011 12:00:00"), (err, res) => {
        t.equal(err, "YHOO Not Found", "not found for mixed unknown symbol");
        t.notOk(res, "no data for mixed unknown symbol");
    });

    returns.getReturns(["GOOGL", "IBM"], new Date("Sat Aug 06 2011 12:00:00"), (err, res) => {
        t.notOk(err, "check error for getting returns before ref date in the past");
        t.ok(res.beforeRefDate.length === 2, "get returns for two assets before ref date in the past");
        t.ok(res.beforeRefDate[0].length > 0, "get returns for first assets before ref date in the past");
        t.ok(res.beforeRefDate[1].length > 0, "get returns for second assets before ref date in the past");
        t.ok(res.afterRefDate[0].length > 0, "get returns for first assets after ref date in the past");
        t.ok(res.afterRefDate[1].length > 0, "get returns for second assets after ref date in the past");
    });

    returns.getReturns(["GOOGL", "IBM"], new Date(), (err, res) => {
        t.notOk(err, "check error for getting returns before today");
        t.ok(res.beforeRefDate.length === 2, "get returns for two assets before today");
        t.ok(res.beforeRefDate[0].length > 0, "get returns for first assets before today");
        t.ok(res.beforeRefDate[1].length > 0, "get returns for second assets before today");
        t.ok(res.afterRefDate.length === 0, "get returns after today");
    });

});
