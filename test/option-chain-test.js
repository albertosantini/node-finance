"use strict";

var test = require("tape"),
    optionChain = require("../lib/option-chain");

test("Option Chain tests", function (t) {
    t.plan(8);

    optionChain.getOptionChainFromYahoo("IBM", function (err, res) {
        var expiration = !err && res.expDate.toString(),
            date = new Date(expiration),
            dateStr = date.getFullYear() + "-" +
                (date.getMonth() + 1) + "-" + date.getDate();

        t.ok(!err && isFinite(res.strike),
            "strike is a number");
        t.ok(!err && expiration !== "Invalid Date",
            "expire date");
        t.ok(!err && isFinite(res.calls[0].strike),
            "first call strike is a number");
        t.ok(!err && isFinite(res.puts[0].strike),
            "first put strike is a number");

        optionChain.getOptionChainFromYahoo({
            symbol: "IBM",
            expiration: dateStr
        }, function (err2, res2) {
            t.ok(!err2 && isFinite(res2.strike),
                "strike is a number with expiration date");
            t.ok(!err2 && res2.expDate.toString() !== "Invalid Date",
                "expire date with expiration date");
            t.ok(!err2 && isFinite(res2.calls[0].strike),
                "first call strike is a number with expiration date");
            t.ok(!err2 && isFinite(res2.puts[0].strike),
                "first put strike is a number with expiration date");
        });
    });
});
