"use strict";

var request = require("request");

function getRiskFreeRateFromYahoo(callback) {

    // US Treasury Bonds Rates 3 Month
    var url = "https://query1.finance.yahoo.com/v8/finance/chart/%5EIRX";

    request({
        method: "GET",
        uri: url
    }, function (err, response, body) {
        var res,
            rf;

        if (!err) {
            res = JSON.parse(body);
            rf = res.chart.result[0].indicators.quote[0].close[0];
        }

        callback(err, rf);
    });
}
exports.getRiskFreeRateFromYahoo = getRiskFreeRateFromYahoo;
