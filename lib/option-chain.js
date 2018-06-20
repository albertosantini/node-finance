"use strict";

const request = require("./util").request;

function getOptionChainFromYahoo(params, callback) {
    let url = `https://query1.finance.yahoo.com/v7/finance/options/${params.symbol}`,
        expiration,
        year,
        month,
        day;

    if (params.expiration) {
        expiration = params.expiration.split("-");
        year = parseInt(expiration[0], 10);
        month = parseInt(expiration[1], 10) - 1;
        day = parseInt(expiration[2], 10);
        url += `?date=${Date.UTC(year, month, day) / 1000}`;
    }

    request({
        url
    }, (err, response, body) => {
        let res,
            quote,
            optionChain;

        if (!err) {
            res = JSON.parse(body);

            if (res.optionChain.error) {
                return callback(res.optionChain.result);
            }

            quote = res.optionChain.result[0].quote;
            optionChain = res.optionChain.result[0].options[0];

            optionChain.strike = quote.regularMarketPrice;
            optionChain.expDate = new Date(optionChain.expirationDate * 1000);
            optionChain.expDateStr = optionChain.expDate.toString();
            optionChain.now = new Date();
            optionChain.now.setHours(0, 0, 0, 0);
            optionChain.diffdate = (optionChain.expDate - optionChain.now) /
                (1000 * 60 * 60 * 24);
        }

        return callback(err, optionChain);
    });
}
exports.getOptionChainFromYahoo = getOptionChainFromYahoo;
