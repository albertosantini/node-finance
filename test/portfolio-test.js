"use strict";

const test = require("tape");

const finance = require("../lib/finance");

test("Portfolio tests", t => {
    const params = {
        prods: ["IBM", "GOOGL", "MSFT"],
        referenceDate: "Sat Aug 06 2011 12:00:00",
        targetReturn: undefined, // eslint-disable-line no-undefined
        lows: [0, 0, 0],
        highs: [-1, -1, -1]
    };

    t.plan(3);

    finance.portfolio.getOptimalPortfolio(params, (err, res) => {
        t.equal(!err && res.optim.solution[0].toFixed(5), "0.48948",
            "get optimal IBM weight");
        t.equal(!err && res.optim.solution[1].toFixed(5), "0.02308",
            "get optimal GOOGL weight");
        t.equal(!err && res.optim.solution[2].toFixed(5), "0.48744",
            "get optimal MSFT weight");
    });
});
