"use strict";

const request = require("./util").request;

function getKeyStatistics(params, callback) {
    const symbol = params.symbol,
        url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=defaultKeyStatistics`;

    request({
        url
    }, (err, response, body) => {
        let res,
            keyStatistics;

        if (!err) {
            res = JSON.parse(body);
            keyStatistics = res.quoteSummary.result[0].defaultKeyStatistics;
        }

        callback(err, keyStatistics);
    });
}
exports.getKeyStatistics = getKeyStatistics;
