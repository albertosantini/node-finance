"use strict";

const test = require("tape");

const optionChain = require("../lib/option-chain");

test("Option Chain tests", t => {
    t.plan(10);

    optionChain.getOptionChainFromYahoo({
        symbol: "IBM"
    }, (err, res) => {
        t.notOk(err, "check error for getting option chain");

        const expiration = res.expDate.toString();
        const date = new Date(expiration);
        const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        t.ok(isFinite(res.strike), "strike is a number");
        t.ok(expiration !== "Invalid Date", "expire date");
        t.ok(isFinite(res.calls.length && res.calls[0].strike), "first call strike is a number");
        t.ok(isFinite(res.puts.length && res.puts[0].strike), "first put strike is a number");

        optionChain.getOptionChainFromYahoo({
            symbol: "IBM",
            expiration: dateStr
        }, (err2, res2) => {
            t.notOk(err2, "check error for getting option chain with expiration date");

            t.ok(isFinite(res2.strike), "strike is a number with expiration date");
            t.ok(res2.expDate.toString() !== "Invalid Date", "expire date with expiration date");
            t.ok(isFinite(res2.calls.length && res2.calls[0].strike), "first call strike is a number with expiration date");
            t.ok(isFinite(res2.puts.length && res2.puts[0].strike), "first put strike is a number with expiration date");
        });
    });
});
