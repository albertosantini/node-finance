"use strict";

const request = require("./util").request;

function getHistoricalQuotesFromYahoo({
    symbol,
    beginDate,
    endDate,
    frequency = "1wk"
}, callback) {
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
            const begin = Math.trunc(beginDate.getTime() / 1000);
            const end = Math.trunc(endDate.getTime() / 1000);
            const url = `${queryUrl}${symbol}?period1=${begin}&period2=${end}&interval=${frequency}&events=history&crumb=${crumb}`;

            if (err) {
                return callback(err);
            }

            request({
                url,
                headers: {
                    cookie
                }
            }, (err2, res2, body) => {
                if (err2) {
                    return callback(err2);
                }

                try {
                    const result = JSON.parse(body);

                    if (result.error) {
                        return callback(result.error.error.code);
                    }

                    if (!result.chart.result) {
                        return callback(result.chart.error.code);
                    }
                } catch (e) {

                    // empty block
                }

                return callback(err2, symbol, body);
            });

            return symbol;
        });
    });
}
exports.getHistoricalQuotesFromYahoo = getHistoricalQuotesFromYahoo;
