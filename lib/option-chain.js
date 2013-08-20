"use strict";

var request = require("request"),
    cheerio = require("cheerio");

function getOption($, opt) {
    var ans = [], i, j, l = opt.length;

    for (i = 0, j = 0; i < l; i += 8, j += 1) {
        ans[j] = {};
        ans[j].strike = parseFloat($("a", opt.eq(i).html())
            .text().replace(",", ""));
        ans[j].symbol = $("a", opt.eq(i + 1).html()).text();
        ans[j].last = parseFloat($("b", opt.eq(i + 2).html())
            .text().replace(",", ""));
        ans[j].chg = parseFloat($("span:nth-child(1)", opt.eq(i + 3).html())
            .text().replace(",", ""));
        if (opt.eq(i + 4).text() !== "N/A") {
            ans[j].bid = parseFloat(opt.eq(i + 4).text().replace(",", ""));
        } else {
            ans[j].bid = undefined;
        }
        if (opt.eq(i + 5).text() !== "N/A") {
            ans[j].ask = parseFloat(opt.eq(i + 5).text().replace(",", ""));
        } else {
            ans[j].ask = undefined;
        }
        if (ans[j].bid === undefined && ans[j].ask === undefined) {
            ans[j].bid = ans[j].last;
            ans[j].ask = ans[j].last;
        }
        ans[j].vol = parseFloat(opt.eq(i + 6).text().replace(",", ""));
        ans[j].oi = parseFloat(opt.eq(i + 7).text().replace(",", ""));
    }

    return ans;
}

function getOptionChainFromYahoo(symbol, callback) {
    var url = "http://finance.yahoo.com/q/op?s=" + symbol;

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
            expDate = $("table.yfnc_mod_table_title1 td:nth-of-type(2)");

            calls = $(".yfnc_h,.yfnc_tabledata1",
                $(".yfnc_datamodoutline1").eq(0).html());
            puts = $(".yfnc_h,.yfnc_tabledata1",
                $(".yfnc_datamodoutline1").eq(1).html());

            optionChain.strike = parseFloat(strike);
            optionChain.expDateStr = $(expDate.eq(0)).text().split("close ")[1];
            optionChain.expDate = new Date(expDate);
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
