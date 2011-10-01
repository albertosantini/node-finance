/*jslint node:true, sloppy:true, unparam: true */

var request = require('request'),
    jsdom = require('jsdom'),
    jquery = require('jquery');

jsdom.defaultDocumentFeatures = {
    FetchExternalResources: false,
    ProcessExternalResources: false
};

function getQuotesFromYahoo(symbol, refDate, callback) {
    var yahoo_url = "http://chart.yahoo.com/table.csv?s=",
        yahoo_options = "&g=w&q=q&y=0&x=.csv",
        yahoo_date,
        url,
        prices,
        start1,
        start2,
        end1,
        end2,
        now = new Date(),
        ddNow = now.getDate(),
        mmNow = now.getMonth(),
        yyNow = now.getFullYear(),
        ddRef = refDate.getDate(),
        mmRef = refDate.getMonth(),
        yyRef = refDate.getFullYear();

    prices = {
        beforeRefDate: [],
        afterRefDate: []
    };

    if (ddNow !== ddRef || mmNow !== mmRef || yyNow !== yyRef) {
        start1 = "&a=" + mmRef + "&b=" + ddRef + "&c=" + (yyRef - 2);
        end1 = "&d=" + mmRef + "&e=" + ddRef + "&f=" + yyRef;
        yahoo_date = start1 + end1;

        url = yahoo_url + symbol + yahoo_date + yahoo_options;
        request({
            method: 'GET',
            uri: url
        }, function (error, response, data) {
            prices.beforeRefDate = data;

            start2 = "&a=" + mmRef + "&b=" + ddRef + "&c=" + yyRef;
            end2 = "&d=" + mmNow + "&e=" + ddNow + "&f=" + yyNow;
            yahoo_date = start2 + end2;

            url = yahoo_url + symbol + yahoo_date + yahoo_options;
            request({
                method: 'GET',
                uri: url
            }, function (error, response, data) {
                prices.afterRefDate = data;
                callback(false, symbol, prices);
            });
        });

    } else {
        start1 = "&a=" + mmRef + "&b=" + ddRef + "&c=" + (yyRef - 2);
        end1 = "&d=" + mmNow + "&e=" + ddNow + "&f=" + yyNow;
        yahoo_date = start1 + end1;

        url = yahoo_url + symbol + yahoo_date + yahoo_options;
        request({
            method: 'GET',
            uri: url
        }, function (error, response, data) {
            prices.beforeRefDate = data;
            callback(false, symbol, prices);
        });
    }
}
exports.getQuotesFromYahoo = getQuotesFromYahoo;

function getReturns(symbols, refDate, callback) {
    var mReturns = [], mFutureReturns = [],
        rets = {
            beforeRefDate: [],
            afterRefDate: []
        },
        retsLen = 0;

    refDate = new Date(refDate); // from :String to :Date

    function getLogReturns(x) {
        var i, rets = [];

        for (i = 1; i < x.length; i = i + 1) {
            rets[i - 1] = Math.log(x[i]) - Math.log(x[i - 1]);
        }

        return rets;
    }

    function getClosePriceReturns(x) {
        var j, k, c, recs, closes = [], rets;

        // skip the header and splitting the records
        recs = x.split("Adj Close\n")[1].split("\n");
        // reversing time series "... recs.length - 2; j >= 1 ...":
        // discarding the last value, because is empty, and the first week
        for (k = 0, j = recs.length - 2; j >= 1; j = j - 1, k = k + 1) {
            closes[k] = recs[j].split(",")[4];
        }

        // hack zero values in the time series
        for (k = 0; k < closes.length; k = k + 1) {
            if (closes[k] === "0.00") {
                if (k > 0) {
                    closes[k] = closes[k - 1];
                } else {
                    c = 1;
                    while (closes[c] === "0.00") {
                        c = c + 1;
                    }
                    closes[k] = closes[c];
                }
            }
        }

        rets = getLogReturns(closes);

        return rets;
    }

    function calcReturns(prices) {
        var i, j, message = "";

        for (i = 0; i < prices.length; i = i + 1) {
            if (prices[i].beforeRefDate.length === 0) {
                message = "Historical quote data is unavailable: " + symbols[i];
                break;
            }
            rets.beforeRefDate = getClosePriceReturns(prices[i].beforeRefDate);

            if (prices[i].afterRefDate.length > 0) {
                rets.afterRefDate = getClosePriceReturns(prices[i].afterRefDate);
            }
            if (retsLen !== 0 && retsLen !== rets.beforeRefDate.length) {
                message = "Historical quote data is unavailable: " +
                    symbols[i - 1] + " (" + retsLen + ")" + " - " +
                    symbols[i] + " (" + rets.beforeRefDate.length + ")";
                break;
            }
            retsLen = rets.beforeRefDate.length;

            mReturns[i] = [];
            for (j = 0; j < rets.beforeRefDate.length; j = j + 1) {
                mReturns[i][j] = rets.beforeRefDate[j];
            }

            if (rets.afterRefDate.length > 0) {
                mFutureReturns[i] = [];
                for (j = 0; j < rets.afterRefDate.length; j = j + 1) {
                    mFutureReturns[i][j] = rets.afterRefDate[j];
                }
            }
        }

        callback({
            message: message,
            beforeRefDate: mReturns,
            afterRefDate: mFutureReturns
        });
    }

    function getQuotes() {
        var i, counter = symbols.length, p = {}, data = [];

        function next(err, symbol, res) {
            counter -= 1;
            p[symbol] = res;
            if (counter === 0) {
                for (i = 0; i < symbols.length; i = i + 1) {
                    data.push(p[symbols[i]]);
                }
                calcReturns(data);
            }
        }

        for (i = 0; i < symbols.length; i = i + 1) {
            getQuotesFromYahoo(symbols[i], refDate, next);
        }
    }

    getQuotes();

}
exports.getReturns = getReturns;

function getKeyStatistics(params, callback) {
    var url = "http://finance.yahoo.com/q/ks?s=",
        symbol = params.symbol;

    request({
        method: 'GET',
        uri: url + symbol
    }, function (error, response, data) {
        var window = jsdom.jsdom(data).createWindow(),
            jQuery = jquery.create(window),
            contents,
            headers,
            i,
            stats = [];

        headers = jQuery(".yfnc_tablehead1").find("font").remove().end();
        contents = jQuery(".yfnc_tabledata1").find("font").remove().end();

        for (i = 0; i < contents.length; i = i + 1) {
            stats[i] = {
                type: 'uneditable',
                inputParams: {
                    label: headers[i].innerHTML,
                    value: contents[i].innerHTML
                }
            };
        }

        callback(stats);
    });
}
exports.getKeyStatistics = getKeyStatistics;

function getOptionChainFromYahoo(symbol, callback) {
    var url = "http://finance.yahoo.com/q/op?s=" + symbol;

    request({
        method: 'GET',
        uri: url
    }, function (error, response, data) {
        var window = jsdom.jsdom(data).createWindow(),
            jQuery = jquery.create(window),
            optionChain = {},
            calls,
            puts,
            expDate,
            strike;

        strike = jQuery("big > b > span").text();
        expDate = jQuery("table.yfnc_mod_table_title1:first").text()
            .split("close ")[1];

        calls = jQuery(".yfnc_h,.yfnc_tabledata1",
            jQuery(".yfnc_datamodoutline1").get(0));
        puts = jQuery(".yfnc_h,.yfnc_tabledata1",
            jQuery(".yfnc_datamodoutline1").get(1));

        function getOption(opt) {
            var ans = [], i, j, l = opt.length;

            for (i = 0, j = 0; i < l; i += 8, j += 1) {
                ans[j] = {};
                ans[j].strike = parseFloat(jQuery("a", opt.get(i)).text()
                    .replace(",", ""));
                ans[j].symbol = jQuery("a", opt.get(i + 1)).text();
                ans[j].last = parseFloat(jQuery("span", opt.get(i + 2)).text()
                    .replace(",", ""));
                ans[j].chg = parseFloat(jQuery("span:eq(0)", opt.get(i + 3)).text()
                    .replace(",", ""));
                if (opt.get(i + 4).innerHTML !== "N/A") {
                    ans[j].bid = parseFloat(jQuery("span", opt.get(i + 4)).text()
                        .replace(",", ""));
                } else {
                    ans[j].bid = undefined;
                }
                if (opt.get(i + 5).innerHTML !== "N/A") {
                    ans[j].ask = parseFloat(jQuery("span", opt.get(i + 5)).text()
                        .replace(",", ""));
                } else {
                    ans[j].ask = undefined;
                }
                if (ans[j].bid === undefined && ans[j].ask === undefined) {
                    ans[j].bid = ans[j].last;
                    ans[j].ask = ans[j].last;
                }
                ans[j].vol = parseFloat(jQuery("span", opt.get(i + 6)).text()
                    .replace(",", ""));
                ans[j].oi = parseFloat(opt.get(i + 7).innerHTML.replace(",", ""));
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

        callback(optionChain);
    });
}
exports.getOptionChainFromYahoo = getOptionChainFromYahoo;

function getRiskFreeRateFromYahoo(callback) {
    var url = "http://finance.yahoo.com/bonds";

    request({
        method: 'GET',
        uri: url
    }, function (error, response, data) {
        var window = jsdom.jsdom(data).createWindow(),
            jQuery = jquery.create(window),
            rf;

        rf = jQuery("table.yfirttbl > tbody > tr:nth(0) > td:nth(1)")
            .text() / 100;
        callback(rf);
    });
}
exports.getRiskFreeRateFromYahoo = getRiskFreeRateFromYahoo;
