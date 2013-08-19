"use strict";

var request = require("request"),
    jQuery = require("jquery");

function getRiskFreeRateFromYahoo(callback) {
    var url = "http://finance.yahoo.com/bonds";

    request({
        method: "GET",
        uri: url
    }, function (err, response, data) {
        var rf;

        rf = jQuery("table.yfirttbl > tbody > tr:nth(0) > td:nth(1)", data)
            .text() / 100;
        callback(err, rf);
    });
}
exports.getRiskFreeRateFromYahoo = getRiskFreeRateFromYahoo;

