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
    };
    const now = new Date();

    if (isPastDate(refDate)) {
        yahooQuotes.getHistoricalQuotesFromYahoo({
            symbol: ticket,
            beginDate: subtractYearsFromDate(refDate, 2),
            endDate: refDate
        }, (error, symbol, quotes) => {
            if (error) {
                return callback(error);
            }

            prices.beforeRefDate = quotes;
            yahooQuotes.getHistoricalQuotesFromYahoo({
                symbol,
                beginDate: refDate,
                endDate: now
            }, (err, sym, qs) => {
                prices.afterRefDate = qs;

                callback(err, sym, prices);
            });

            return symbol;
        });
    } else {
        yahooQuotes.getHistoricalQuotesFromYahoo({
            symbol: ticket,
            beginDate: subtractYearsFromDate(refDate, 2),
            endDate: now
        }, (err, symbol, quotes) => {
            prices.beforeRefDate = quotes;

            callback(err, symbol, prices);
        });
    }
}

function getQuotes(symbols, refDate, callback) {
    const prices = {};
    const data = [];

    let counter = symbols.length;

    function next(err, symbol, quotes) {
        if (err) {
            counter = -1;
            return callback(err);
        }

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
