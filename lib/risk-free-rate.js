"use strict";

var request = require("request"),
    cheerio = require("cheerio");

function getRiskFreeRateFromYahoo(callback) {
    var url = "http://finance.yahoo.com/bonds";

    request({
        method: "GET",
        uri: url
    }, function (err, response, body) {
        var $, rf;

        if (!err) {
            $ = cheerio.load(body);

            // US Treasury Bonds Rates 3 Month
            rf = $("table.yfirttbl > tbody > " +
                "tr:nth-child(1) > td:nth-child(2)")
                    .text() / 100;

        }
        callback(err, rf);
    });
}
exports.getRiskFreeRateFromYahoo = getRiskFreeRateFromYahoo;
