"use strict";

var test = require("tape"),
    returns = require("../lib/returns");

test("Returns tests", function (t) {
    t.plan(9);

    returns.getReturns(["GOOGL", "IBM"], new Date("Sat Aug 06 2011 12:00:00"),
        function (err, res) {

            t.ok(!err && res.beforeRefDate.length === 2,
                "get returns for two assets before ref date in the past");
            t.ok(!err && res.beforeRefDate[0].length > 0,
                "get returns for first assets before ref date in the past");
            t.ok(!err && res.beforeRefDate[1].length > 0,
                "get returns for second assets before ref date in the past");
            t.ok(!err && res.afterRefDate[0].length > 0,
                "get returns for first assets after ref date in the past");
            t.ok(!err && res.afterRefDate[1].length > 0,
                "get returns for second assets after ref date in the past");
        });

    returns.getReturns(["GOOGL", "IBM"], new Date(), function (err, res) {
        t.ok(!err && res.beforeRefDate.length === 2,
            "get returns for two assets before today");
        t.ok(!err && res.beforeRefDate[0].length > 0,
            "get returns for first assets before today");
        t.ok(!err && res.beforeRefDate[1].length > 0,
            "get returns for second assets before today");
        t.ok(!err && res.afterRefDate.length === 0,
            "get returns after today");
    });

});
