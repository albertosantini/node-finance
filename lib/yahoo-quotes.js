"use strict";

const request = require("./util").request;

function getHistoricalQuotesFromYahoo({
    symbol,
    beginDate,
    endDate,
    frequency = "1wk"
}, callback) {
    const antiCacheString = Math.random().toString(36).replace(/[^a-z]+/gu, "").slice(0, 4),
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
            const begin = Math.trunc(beginDate.getTime() / 1000);
            const end = Math.trunc(endDate.getTime() / 1000);
            const url = `${queryUrl}${symbol}?period1=${begin}&period2=${end}&interval=${frequency}&events=history&crumb=${crumb}`;

            if (err) {
                return callback(err, symbol);
            }

            request({
                url,
                headers: {
                    cookie
                }
            }, (err2, res2, body) => {
                if (err2) {
                    return callback(err2, symbol);
                }

                try {
                    const result = JSON.parse(body);

                    if (result.error) {
                        return callback(result.error.error.code, symbol);
                    }

                    if (!result.chart.result) {
                        return callback(result.chart.error.code, symbol);
                    }
                } catch (e) {

                    // it is ok: no error, csv, not json, received
                }

                if (body.includes("null") && body.match(/null/gu).length > 6) {

                    // 2018-06-18,null,null,null,null,null,null
                    // If there is only one line, it is removed
                    // when the body is parsed in getReturns.
                    // If nulls are greater than six, it means there is
                    // more than one line containing nulls.
                    return callback("contains missing values", symbol);
                }

                return callback(err2, symbol, body);
            });

            return symbol;
        });
    });
}
exports.getHistoricalQuotesFromYahoo = getHistoricalQuotesFromYahoo;
