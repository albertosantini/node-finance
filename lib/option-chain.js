"use strict";

var request = require("request"),
    jQuery = require("jquery");

function getOptionChainFromYahoo(symbol, callback) {
    var url = "http://finance.yahoo.com/q/op?s=" + symbol;

    request({
        method: "GET",
        uri: url
    }, function (err, response, data) {
        var optionChain = {},
            calls,
            puts,
            expDate,
            strike;

        strike = jQuery(".time_rtq_ticker > span", data).text();
        expDate = jQuery("table.yfnc_mod_table_title1:first", data).text()
            .split("close ")[1];

        calls = jQuery(".yfnc_h,.yfnc_tabledata1",
            jQuery(".yfnc_datamodoutline1", data).get(0));
        puts = jQuery(".yfnc_h,.yfnc_tabledata1",
            jQuery(".yfnc_datamodoutline1", data).get(1));

        function getOption(opt) {
            var ans = [], i, j, l = opt.length;

            for (i = 0, j = 0; i < l; i += 8, j += 1) {
                ans[j] = {};
                ans[j].strike = parseFloat(jQuery("a", opt.get(i)).text()
                    .replace(",", ""));
                ans[j].symbol = jQuery("a", opt.get(i + 1)).text();
                ans[j].last = parseFloat(jQuery("b", opt.get(i + 2)).text()
                    .replace(",", ""));
                ans[j].chg = parseFloat(jQuery("span:eq(0)", opt.get(i + 3))
                    .text()
                    .replace(",", ""));
                if (opt.get(i + 4).innerHTML !== "N/A") {
                    ans[j].bid = parseFloat(opt.get(i + 4).innerHTML
                        .replace(",", ""));
                } else {
                    ans[j].bid = undefined;
                }
                if (opt.get(i + 5).innerHTML !== "N/A") {
                    ans[j].ask = parseFloat(opt.get(i + 5).innerHTML
                        .replace(",", ""));
                } else {
                    ans[j].ask = undefined;
                }
                if (ans[j].bid === undefined && ans[j].ask === undefined) {
                    ans[j].bid = ans[j].last;
                    ans[j].ask = ans[j].last;
                }
                ans[j].vol = parseFloat(opt.get(i + 6)
                    .innerHTML.replace(",", ""));
                ans[j].oi = parseFloat(opt.get(i + 7)
                    .innerHTML.replace(",", ""));
            }

            return ans;
        }

        optionChain.strike = parseFloat(strike);
        optionChain.expDateStr = expDate;
        optionChain.expDate = new Date(expDate);
        optionChain.now = new Date();
        optionChain.now.setHours(0, 0, 0, 0);
        optionChain.diffdate = (optionChain.expDate - optionChain.now) /
            (1000 * 60 * 60 * 24);
        optionChain.calls = getOption(calls);
        optionChain.puts = getOption(puts);

        callback(err, optionChain);
    });
}
exports.getOptionChainFromYahoo = getOptionChainFromYahoo;

