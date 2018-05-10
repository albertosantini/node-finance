"use strict";

const yahooQuotes = require("./yahoo-quotes");

function isPastDate(refDate) {
    const now = new Date(),
        ddNow = now.getUTCDate(),
        mmNow = now.getUTCMonth(),
        yyNow = now.getUTCFullYear(),
        ddRef = refDate.getUTCDate(),
        mmRef = refDate.getUTCMonth(),
        yyRef = refDate.getUTCFullYear();

    return (ddNow !== ddRef || mmNow !== mmRef || yyNow !== yyRef);
}

function subtractYearsFromDate(refDate, n) {
    return (new Date(refDate - (1000 * 86400 * n * 365)));
}

function getQuotesFromYahoo(ticket, refDate, callback) {
    const prices = {
            beforeRefDate: [],
            afterRefDate: []
        },
        now = new Date();

    let params;

    if (isPastDate(refDate)) {
        params = {
            symbol: ticket,
            beginDate: subtractYearsFromDate(refDate, 2),
            endDate: refDate
        };
        yahooQuotes.getHistoricalQuotesFromYahoo(params,
            (error, symbol, quotes) => {
                if (error) {
                    callback(error);
                    return;
                }

                prices.beforeRefDate = quotes;

                params = {
                    symbol,
                    beginDate: refDate,
                    endDate: now
                };
                yahooQuotes.getHistoricalQuotesFromYahoo(params,
                    (err, sym, qs) => {
                        prices.afterRefDate = qs;

                        callback(err, sym, prices);
                    });
            });

    } else {
        params = {
            symbol: ticket,
            beginDate: subtractYearsFromDate(refDate, 2),
            endDate: now
        };
        yahooQuotes.getHistoricalQuotesFromYahoo(params,
            (err, symbol, quotes) => {
                prices.beforeRefDate = quotes;

                callback(err, symbol, prices);
            });
    }
}

function getQuotes(symbols, refDate, callback) {
    const prices = {},
        data = [];

    let counter = symbols.length;

    function next(err, symbol, quotes) {
        counter -= 1;

        prices[symbol] = quotes;
        if (counter === 0) {
            symbols.forEach(sym => {
                data.push(prices[sym]);
            });

            return callback(err, data);
        }

        return true;
    }

    symbols.forEach(symbol => {
        getQuotesFromYahoo(symbol, refDate, next);
    });
}
exports.getQuotes = getQuotes;
