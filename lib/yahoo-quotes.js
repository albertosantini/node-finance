"use strict";

var request = require("request");

function getHistoricalQuotesFromYahoo(params, callback) {
    var cookieUrl = "https://finance.yahoo.com",
        crumbUrl = "https://query1.finance.yahoo.com/v1/test/getcrumb",
        queryUrl = "https://query1.finance.yahoo.com/v7/finance/download/";

    request({
        method: "GET",
        uri: cookieUrl,
        jar: true
    }, function () {
        request({
            method: "GET",
            uri: crumbUrl,
            jar: true
        }, function (err, res, crumb) {
            var symbol = params.symbol || "YHOO",
                begin = Math.trunc(params.beginDate.getTime() / 1000),
                end = Math.trunc(params.endDate.getTime() / 1000),
                frequency = params.frequency || "1wk",
                url = `${queryUrl + symbol}?period1=${begin}&period2=${end}&interval=${frequency}&events=history&crumb=${crumb}`;

            if (err) {
                return callback(err);
            }

            request({
                method: "GET",
                uri: url,
                jar: true
            }, function (err2, res2, prices) {
                callback(err2, symbol, prices);
            });

            return symbol;
        });
    });
}
exports.getHistoricalQuotesFromYahoo = getHistoricalQuotesFromYahoo;
