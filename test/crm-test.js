"use strict";

const os = require("os");
const test = require("tape");
const nock = require("nock");

const finance = require("../lib/finance");

nock("http://localhost:5984")
    .get("/conpa/_design/ConPA/_view/viewByRef?group=false&reduce=true&")
    .reply(200, {
        rows: [
            { value: 3888, key: null }
        ]
    });

finance.crm.configure({
    liveDomain: os.hostname(),

    // liveDomain: "foo.com",
    liveUrl: process.env.CONPA_LIVE_URL || "http://localhost:5984",
    liveDb: "conpa",
    testingUrl: process.env.CONPA_TEST_URL || "http://localhost:5984",
    testingDb: "conpa-staging",
    design: "ConPA"
});

test("CRM tests", t => {
    t.plan(1);

    finance.crm.getPortfolioCount((err, res) => {
        if (!err) {
            t.equal(res.rows[0].value, 3888);
        }
    });
});
