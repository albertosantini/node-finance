"use strict";

const request = require("./util").request;

function getKeyStatistics({ symbol }, callback) {
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=defaultKeyStatistics`;

    request({
        url
    }, (err, response, body) => {
        if (err) {
            return callback(err);
        }

        const res = JSON.parse(body);

        if (res.error) {
            return callback(res.error.error.code);
        }

        if (!res.quoteSummary.result) {
            return callback(res.quoteSummary.error.code);
        }

        return callback(null, res.quoteSummary.result[0].defaultKeyStatistics);
    });
}
exports.getKeyStatistics = getKeyStatistics;
