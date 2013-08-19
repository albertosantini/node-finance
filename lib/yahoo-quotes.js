"use strict";

var request = require("request");

function getHistoricalQuotesFromYahoo(params, callback) {
    var symbol = params.symbol || "YHOO",
        begin = params.beginDate,
        end = params.endDate,
        frequency = params.frequency || "w", // default weekly
        url = "http://ichart.finance.yahoo.com/table.csv?" +
            "g=" + frequency +
            "&a=" + begin.getUTCMonth() +
            "&b=" + begin.getUTCDate() +
            "&c=" + begin.getUTCFullYear() +
            "&d=" + end.getUTCMonth() +
            "&e=" + end.getUTCDate() +
            "&f=" + end.getUTCFullYear() +
            "&s=" + symbol;

    request({
        method: "GET",
        uri: url
    }, function (err, res, prices) {
        callback(err, symbol, prices);
    });
}
exports.getHistoricalQuotesFromYahoo = getHistoricalQuotesFromYahoo;
