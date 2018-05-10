"use strict";

const request = require("./util").request;

function getHistoricalQuotesFromYahoo(params, callback) {
    const antiCacheString = Math.random().toString(36).replace(/[^a-z]+/g, "").slice(0, 4),
        cookieUrl = `https://finance.yahoo.com/${antiCacheString}`,
        crumbUrl = "https://query1.finance.yahoo.com/v1/test/getcrumb",
        queryUrl = "https://query1.finance.yahoo.com/v7/finance/download/";

    request({
        url: cookieUrl
    }, (err1, res1) => {
        const cookie = res1.headers["set-cookie"][0];

        request({
            url: crumbUrl,
            headers: {
                cookie
            }
        }, (err, res, crumb) => {
            const symbol = params.symbol || "GOOGL",
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
            }, (err2, res2, prices) => {
                callback(err2, symbol, prices);
            });

            return symbol;
        });
    });
}
exports.getHistoricalQuotesFromYahoo = getHistoricalQuotesFromYahoo;
