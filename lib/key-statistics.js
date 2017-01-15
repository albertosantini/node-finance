"use strict";

var request = require("request");

function getKeyStatistics(params, callback) {
    var symbol = params.symbol,
        url = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/" +
            symbol + "?modules=defaultKeyStatistics";

    request({
        method: "GET",
        uri: url
    }, function (err, response, body) {
        var res,
            keyStatistics;

        if (!err) {
            res = JSON.parse(body);
            keyStatistics = res.quoteSummary.result[0].defaultKeyStatistics;
        }

        callback(err, keyStatistics);
    });
}
exports.getKeyStatistics = getKeyStatistics;
