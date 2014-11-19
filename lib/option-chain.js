"use strict";

var request = require("request"),
    cheerio = require("cheerio");

function getOption($, opt) {
    var ans = [],
        rows = $("tr", opt),
        len = rows.length,
        row,
        i;

    for (i = 0; i < len; i += 1) {
        ans[i] = {};

        row = rows.eq(i);

        ans[i].strike = parseFloat($("a", row).eq(0).text());
        ans[i].symbol = $("a", row).eq(1).text();
        ans[i].last = parseFloat($("div", row).eq(2).text());
        ans[i].bid = parseFloat($("div", row).eq(3).text());
        ans[i].ask = parseFloat($("div", row).eq(4).text());
        ans[i].chg = parseFloat($("div", row).eq(5).text());
        ans[i].chgperc = parseFloat($("div", row).eq(6).text());
        ans[i].vol = parseFloat($("div", row).eq(7).text());
        ans[i].oi = parseFloat($("div", row).eq(8).text());
        ans[i].ivperc = parseFloat($("div", row).eq(9).text());
    }

    return ans;
}

function getOptionChainFromYahoo(params, callback) {
    // backward compatibility, if params is a string, it is a symbol
    if (typeof params === "string") {
        params = {
            symbol: params
        };
    }

    var url = "http://finance.yahoo.com/q/op?s=" + params.symbol,
        expiration,
        year,
        month,
        day;

    if (params.expiration) {
        expiration = params.expiration.split("-");
        year = parseInt(expiration[0], 10);
        month = parseInt(expiration[1], 10) - 1;
        day = parseInt(expiration[2], 10);
        url += "&date=" + (Date.UTC(year, month, day) / 1000);
    }

    request({
        method: "GET",
        uri: url
    }, function (err, response, body) {
        var $,
            optionChain = {},
            calls,
            puts,
            expDate,
            strike;

        if (!err) {
            $ = cheerio.load(body);

            strike = $(".time_rtq_ticker > span").text();
            expDate = $(".Start-0 > option").eq(0).text();

            calls = $("#optionsCallsTable tbody");
            puts = $("#optionsPutsTable tbody");

            optionChain.strike = parseFloat(strike);
            optionChain.expDateStr = expDate;
            optionChain.expDate = new Date(optionChain.expDateStr);
            optionChain.now = new Date();
            optionChain.now.setHours(0, 0, 0, 0);
            optionChain.diffdate = (optionChain.expDate - optionChain.now) /
                (1000 * 60 * 60 * 24);

            optionChain.calls = getOption($, calls);
            optionChain.puts = getOption($, puts);
        }
        callback(err, optionChain);
    });
}
exports.getOptionChainFromYahoo = getOptionChainFromYahoo;
