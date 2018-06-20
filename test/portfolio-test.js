"use strict";

const test = require("tape");

const finance = require("../lib/finance");

test("Portfolio tests", t => {
    t.plan(6);

    finance.portfolio.getOptimalPortfolio({
        prods: ["IBM", "GOOGL", "MSFT"],
        referenceDate: "Sat Aug 06 2011 12:00:00",
        targetReturn: undefined, // eslint-disable-line no-undefined
        lows: [0, 0, 0],
        highs: [-1, -1, -1]
    }, (err, res) => {
        t.notOk(err, "check error for getting optimal portfolio");
        t.equal(res.optim.solution[0].toFixed(5), "0.48948", "get optimal IBM weight");
        t.equal(res.optim.solution[1].toFixed(5), "0.02308", "get optimal GOOGL weight");
        t.equal(res.optim.solution[2].toFixed(5), "0.48744", "get optimal MSFT weight");
    });

    finance.portfolio.getOptimalPortfolio({
        prods: ["YHOO", "IBM", "GOOGL", "MSFT"],
        referenceDate: "Sat Aug 06 2011 12:00:00",
        targetReturn: undefined, // eslint-disable-line no-undefined
        lows: [0, 0, 0],
        highs: [-1, -1, -1]
    }, (err, res) => {
        t.equal(err, "Not Found", "not found for unknown symbol");
        t.notOk(res, "no optimal portfolio due to unknown symbol");
    });
});
