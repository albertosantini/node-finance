"use strict";

const quotes = require("./quotes");
const csv = require("./parse-csv");

function getLogReturns(x) {
    const rets = [];

    for (let i = 1; i < x.length - 1; i += 1) {
        rets[i - 1] = Math.log(x[i]) - Math.log(x[i - 1]);
    }

    return rets;
}

function getClosePriceReturns(x) {
    const closes = csv.parse(x, {
            column: 4, // close prices
            replaceZeroes: true, // fill zeroes with the previous value
            reverse: false, // from newest to oldest
            skipHeader: true, // remove the header
            skipNRecords: 1 // remove the latest week
        }),
        rets = getLogReturns(closes);

    // 104,360 vs 105, 362
    // console.warn(closes[0], closes[closes.length - 1]);
    // console.warn(rets[0], rets[1], rets[rets.length - 2], rets[rets.length - 1]);

    return rets;
}

function getReturns(symbols, refDate, callback) {

    function calcReturns(err, prices) {
        const mReturns = [],
            mFutureReturns = [],
            rets = {
                beforeRefDate: [],
                afterRefDate: []
            };

        let retsLen = 0;
        let message = "";

        if (err) {
            return callback(err);
        }

        for (let i = 0; i < prices.length; i += 1) {
            if (prices[i].beforeRefDate.length === 0) {
                message = `Historical quote data is unavailable: ${symbols[i]}`;
                break;
            }
            rets.beforeRefDate = getClosePriceReturns(prices[i].beforeRefDate);

            if (prices[i].afterRefDate.length > 0) {
                rets.afterRefDate = getClosePriceReturns(prices[i]
                    .afterRefDate);
            }
            if (retsLen !== 0 && retsLen !== rets.beforeRefDate.length) {
                message = `Historical quote data is unavailable: ${symbols[i - 1]} (${retsLen}) - ${symbols[i]} (${rets.beforeRefDate.length})`;
                break;
            }
            retsLen = rets.beforeRefDate.length;

            mReturns[i] = [];
            for (let j = 0; j < rets.beforeRefDate.length; j += 1) {
                mReturns[i][j] = rets.beforeRefDate[j];
            }

            if (rets.afterRefDate.length > 0) {
                mFutureReturns[i] = [];
                for (let j = 0; j < rets.afterRefDate.length; j += 1) {
                    mFutureReturns[i][j] = rets.afterRefDate[j];
                }
            }
        }

        return callback(message !== "", {
            message,
            beforeRefDate: mReturns,
            afterRefDate: mFutureReturns
        });
    }

    quotes.getQuotes(symbols, new Date(refDate), calcReturns);
}
exports.getReturns = getReturns;
