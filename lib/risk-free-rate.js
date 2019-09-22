"use strict";

const request = require("./util").request;

function getRiskFreeRateFromYahoo(callback) {

    // US Treasury Bonds Rates 3 Month
    const url = "https://query1.finance.yahoo.com/v8/finance/chart/%5EIRX";

    request({
        url
    }, (err, response, body) => {
        let res,
            rf;

        if (!err) {
            res = JSON.parse(body);
            rf = res.chart.result[0].meta.regularMarketPrice;
        }

        callback(err, rf);
    });
}
exports.getRiskFreeRateFromYahoo = getRiskFreeRateFromYahoo;
