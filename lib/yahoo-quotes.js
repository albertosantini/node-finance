"use strict";

const request = require("./util").request;

function getHistoricalQuotesFromYahoo(params, callback) {
    var antiCacheString = Math.random().toString(36).replace(/[^a-z]+/g, "").slice(0, 4),
        cookieUrl = `https://finance.yahoo.com/${antiCacheString}`,
        crumbUrl = "https://query1.finance.yahoo.com/v1/test/getcrumb",
        queryUrl = "https://query1.finance.yahoo.com/v7/finance/download/";

    request({
        url: cookieUrl
    }, function (err1, res1) {
        const cookie = res1.headers["set-cookie"][0];

        request({
            url: crumbUrl,
            headers: {
                cookie
            }
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
                url,
                headers: {
                    cookie
                }
            }, function (err2, res2, prices) {
                callback(err2, symbol, prices);
            });

            return symbol;
        });
    });
}
exports.getHistoricalQuotesFromYahoo = getHistoricalQuotesFromYahoo;
