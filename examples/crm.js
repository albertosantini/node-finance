"use strict";

const os = require("os");
const crm = require("../lib/crm");

crm.configure({

    liveDomain: os.hostname(),

    // liveDomain: "foo.com",
    liveUrl: process.env.CONPA_LIVE_URL || "http://localhost:5984",
    liveDb: "conpa",
    testingUrl: process.env.CONPA_TEST_URL || "http://localhost:5984",
    testingDb: "conpa-staging",
    design: "ConPA"
});

crm.queryByDate({
    metric: "ret",
    beginRefDate: "2017/01/01",
    endRefDate: "2017/12/31",
    limit: 3,
    sort: "asc"
}, (err, res) => {
    if (err) {
        console.warn(err);
        return;
    }

    console.warn(res);
});
