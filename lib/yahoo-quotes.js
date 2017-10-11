"use strict";

var request = require("request");

function getHistoricalQuotesFromYahoo(params, callback) {
    var antiCacheString = Math.random().toString(36).replace(/[^a-z]+/g, "").slice(0, 4),
        cookieUrl = `https://finance.yahoo.com/${antiCacheString}`,
        crumbUrl = "https://query1.finance.yahoo.com/v1/test/getcrumb",
        queryUrl = "https://query1.finance.yahoo.com/v7/finance/download/",
        jar = request.jar();

    request({
        method: "GET",
        uri: cookieUrl,
        jar
    }, function () {
        request({
            method: "GET",
            uri: crumbUrl,
            jar
        }, function (err, res, crumb) {
            var symbol = params.symbol || "GOOGL",
                begin = Math.trunc(params.beginDate.getTime() / 1000),
                end = Math.trunc(params.endDate.getTime() / 1000),
                frequency = params.frequency || "1wk",
                url = `${queryUrl}${symbol}?period1=${begin}&period2=${end}&interval=${frequency}&events=history&crumb=${crumb}`;

            if (err) {
                return callback(err);
            }

            request({
                method: "GET",
                uri: url,
                jar
            }, function (err2, res2, prices) {
                callback(err2, symbol, prices);
            });

            return symbol;
        });
    });
}
exports.getHistoricalQuotesFromYahoo = getHistoricalQuotesFromYahoo;
