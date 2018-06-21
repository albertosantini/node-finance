"use strict";

const util = require("util");

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

function getQuotesFromYahoo({ ticket, refDate }, callback) {
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
                return callback(`${symbol} ${error}`);
            }

            prices.beforeRefDate = quotes;
            yahooQuotes.getHistoricalQuotesFromYahoo({
                symbol,
                beginDate: refDate,
                endDate: now
            }, (error2, symbol2, quotes2) => {
                if (error2) {
                    return callback(`${symbol2} ${error2}`);
                }

                prices.afterRefDate = quotes2;

                return callback(error2, prices);
            });

            return symbol;
        });
    } else {
        yahooQuotes.getHistoricalQuotesFromYahoo({
            symbol: ticket,
            beginDate: subtractYearsFromDate(refDate, 2),
            endDate: now
        }, (error, symbol, quotes) => {
            if (error) {
                return callback(`${symbol} ${error}`);
            }

            prices.beforeRefDate = quotes;

            return callback(error, prices);
        });
    }
}

const getQuotesFromYahooPromisified = util.promisify(getQuotesFromYahoo);

function getQuotes(symbols, refDate, callback) {
    const series = symbols.map(symbol => getQuotesFromYahooPromisified({ ticket: symbol, refDate }));

    Promise.all(series).then(results => {
        callback(null, results);
    }).catch(err => {
        callback(err);
    });
}
exports.getQuotes = getQuotes;
