"use strict";

var test = require("tape"),
    finance = require("../lib/finance");

test("Portfolio tests", function (t) {
    var params = {
        prods: ["IBM", "YHOO", "MSFT"],
        referenceDate: "Sat Aug 06 2011 12:00:00",
        targetReturn: undefined,
        lows: [0, 0, 0],
        highs: [-1, -1, -1]
    };

    t.plan(3);

    finance.portfolio.getOptimalPortfolio(params, function (err, res) {
        t.equal(!err && res.optim.solution[0].toFixed(5), "0.25689",
            "get optimal IBM weight");
        t.equal(!err && res.optim.solution[1].toFixed(5), "0.24762",
            "get optimal YHOO weight");
        t.equal(!err && res.optim.solution[2].toFixed(5), "0.49549",
            "get optimal MSFT weight");
    });
});
