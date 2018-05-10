"use strict";

const stats = require("./stats.js");

function cumsum(x, base = 0) {
    const res = [];

    let sum = base;

    for (let i = 0; i < x.length; i += 1) {
        sum += x[i];
        res[i] = sum;
    }

    return res;
}

function pfolioReturn(x, weights) {
    const res = [],
        nrows = x.length,
        ncols = x[0].length;

    for (let i = 0; i < nrows; i += 1) {
        let sum = 0;

        for (let j = 0; j < ncols; j += 1) {
            sum += (x[i][j] * weights[j]);
        }
        res[i] = sum;
    }

    return res;
}

function getPerformances(xT, weights) {
    const x = stats.transpose(xT);
    const ptfReturns = pfolioReturn(x, weights);
    const res = cumsum(ptfReturns, 0);

    return res;
}
exports.getPerformances = getPerformances;
