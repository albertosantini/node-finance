"use strict";

function colMeans(x) {
    var i, j, sum, means, nrows, ncols;

    means = [];
    nrows = x.length;
    ncols = x[0].length;

    for (j = 0; j < ncols; j = j + 1) {
        sum = 0;
        for (i = 0; i < nrows; i = i + 1) {
            sum = sum + x[i][j];
        }
        means[j] = sum / nrows;
    }

    return means;
}
exports.colMeans = colMeans;

function mean(x) {
    var i, sum = 0, means;

    means = colMeans(x);
    for (i = 0; i < means.length; i = i + 1) {
        sum = sum + means[i];
    }

    return sum / means.length;
}
exports.mean = mean;

function cov(x) {
    var i, j, j2, nrows, ncols,
        sumX, sumX2, sumY, sumY2, sumXY,
        covmat = [];

    nrows = x.length;
    ncols = x[0].length;

    for (i = 0; i < ncols; i = i + 1) {
        covmat[i] = [];
    }

    for (j = 0; j < ncols - 1; j = j + 1) {
        for (j2 = j + 1; j2 < ncols; j2 = j2 + 1) {
            sumX = 0;
            sumY = 0;
            sumX2 = 0;
            sumY2 = 0;
            sumXY = 0;

            for (i = 0; i < nrows; i = i + 1) {
                sumX = sumX + x[i][j];
                sumY = sumY + x[i][j2];
                sumX2 = sumX2 + (x[i][j] * x[i][j]);
                sumY2 = sumY2 + (x[i][j2] * x[i][j2]);
                sumXY = sumXY + (x[i][j] * x[i][j2]);
            }
            covmat[j][j] = (sumX2 - (sumX * sumX) / nrows) / (nrows - 1);
            covmat[j2][j2] = (sumY2 - (sumY * sumY) / nrows) / (nrows - 1);
            covmat[j][j2] = (sumXY - (sumX * sumY) / nrows) / (nrows - 1);
            covmat[j2][j] = covmat[j][j2];
        }
    }

    return covmat;
}
exports.cov = cov;

function repInt(n, k) {
    var i, ans = [];

    for (i = 0; i < k; i = i + 1) {
        ans[i] = n;
    }

    return ans;
}
exports.repInt = repInt;

function identity(k, n) {
    var i, j, m = [];

    n = n || 1;

    for (i = 0; i < k; i = i + 1) {
        m[i] = [];
        for (j = 0; j < k; j = j + 1) {
            if (i === j) {
                m[i][j] = n;
            } else {
                m[i][j] = 0;
            }
        }
    }

    return m;
}
exports.identity = identity;

function rbind() {
    var i, j, k, n, rows, cols, arg, m = [];

    for (n = 0, k = 0; n < arguments.length; n = n + 1) {
        arg = arguments[n];
        rows = arg.length;
        cols = arg[0].length;

        if (cols === undefined) {
            m[k] = [];
            for (i = 0; i < rows; i = i + 1) {
                m[k][i] = arg[i];
            }
            k = k + 1;
        } else {
            for (i = 0; i < rows; i = i + 1) {
                m[k] = [];
                for (j = 0; j < cols; j = j + 1) {
                    m[k][j] = arg[i][j];
                }
                k = k + 1;
            }
        }
    }

    return m;
}
exports.rbind = rbind;

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
exports.transpose = transpose;
