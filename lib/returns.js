"use strict";

const quotes = require("./quotes");
const csv = require("./parse-csv");

function getReturns(symbols, refDate, callback) {

    function getLogReturns(x) {
        const rets = [];

        for (let i = 1; i < x.length; i += 1) {
            rets[i - 1] = Math.log(x[i]) - Math.log(x[i - 1]);
        }

        return rets;
    }

    function getClosePriceReturns(x) {
        const closes = csv.parse(x, {
                column: 4, // close prices
                replaceZeroes: true, // fill zeroes with the previous value
                reverse: true, // from oldest to newest
                skipHeader: true, // remove the header
                skipNRecords: 1 // remove the latest week
            }),
            rets = getLogReturns(closes);

        return rets;
    }

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
            callback(err);
            return;
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

        callback(message !== "", {
            message,
            beforeRefDate: mReturns,
            afterRefDate: mFutureReturns
        });
    }

    quotes.getQuotes(symbols, new Date(refDate), calcReturns);
}
exports.getReturns = getReturns;
