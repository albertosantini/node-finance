/*jshint node:true */

"use strict";

function cumsum(x, base) {
    var i, res = [],
        sum = base || 0;

    for (i = 0; i < x.length; i = i + 1) {
        sum = sum + x[i];
        res[i] = sum;
    }

    return res;
}

function pfolioReturn(x, weights) {
    var i, j, sum, res = [],
        nrows = x.length,
        ncols = x[0].length;

    for (i = 0; i < nrows; i = i + 1) {
        sum = 0;
        for (j = 0; j < ncols; j = j + 1) {
            sum = sum + (x[i][j] * weights[j]);
        }
        res[i] = sum;
    }

    return res;
}

function getPerformances(x, weights) {
    var ptfReturns, res;

    function transpose(m) {
        var i, j, rows, cols, res = [];

        rows = m.length;
        cols = m[0].length;

        for (i = 0; i < cols; i = i + 1) {
            res[i] = [];
            for (j = 0; j < rows; j = j + 1) {
                res[i][j] = m[j][i];
            }
        }

        return res;
    }

    x = transpose(x);

    ptfReturns = pfolioReturn(x, weights);
    res = cumsum(ptfReturns, 0);

    return res;
}
exports.getPerformances = getPerformances;
