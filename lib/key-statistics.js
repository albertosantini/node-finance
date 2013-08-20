"use strict";

var request = require("request"),
    cheerio = require("cheerio");

function getKeyStatistics(params, callback) {
    var url = "http://finance.yahoo.com/q/ks?s=",
        symbol = params.symbol;

    request({
        method: "GET",
        uri: url + symbol
    }, function (err, response, body) {
        var $,
            contents,
            headers,
            i,
            stats = [];

        if (!err) {
            $ = cheerio.load(body);
            $("font").remove();

            headers = $(".yfnc_tablehead1");
            contents = $(".yfnc_tabledata1");

            for (i = 0; i < contents.length; i = i + 1) {
                stats[i] = {
                    label: $(headers[i]).text(),
                    value: $(contents[i]).text()
                };
            }
        }
        callback(err, stats);
    });
}
exports.getKeyStatistics = getKeyStatistics;
