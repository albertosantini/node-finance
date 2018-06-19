"use strict";

function colMeans(x) {
    const means = [];
    const nrows = x.length;
    const ncols = x[0].length;

    let sum, i, j;

    for (j = 0; j < ncols; j += 1) {
        sum = 0;
        for (i = 0; i < nrows; i += 1) {
            sum += x[i][j];
        }
        means[j] = sum / nrows;
    }

    return means;
}
exports.colMeans = colMeans;

function mean(x) {
    const means = colMeans(x);

    let sum = 0;

    for (let i = 0; i < means.length; i += 1) {
        sum += means[i];
    }

    return sum / means.length;
}
exports.mean = mean;

function cov(x) {
    const covmat = [];
    const nrows = x.length;
    const ncols = x[0].length;
    const ncols2 = ncols - 1;

    let sumX, sumX2, sumY, sumY2, sumXY;

    for (let i = 0; i < ncols; i += 1) {
        covmat[i] = Array.from({ length: ncols }, () => 0);
    }

    for (let j = 0; j < ncols2; j += 1) {
        for (let j2 = j + 1; j2 < ncols; j2 += 1) {
            sumX = 0;
            sumY = 0;
            sumX2 = 0;
            sumY2 = 0;
            sumXY = 0;

            for (let i = 0; i < nrows; i += 1) {
                sumX += x[i][j];
                sumY += x[i][j2];
                sumX2 += (x[i][j] * x[i][j]);
                sumY2 += (x[i][j2] * x[i][j2]);
                sumXY += (x[i][j] * x[i][j2]);
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
    const ans = [];

    for (let i = 0; i < k; i += 1) {
        ans[i] = n;
    }

    return ans;
}
exports.repInt = repInt;

function identity(k, n = 1) {
    const m = [];

    for (let i = 0; i < k; i += 1) {
        m[i] = Array.from({ length: k }, () => 0);
        for (let j = 0; j < k; j += 1) {
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

function rbind(...args) {
    const m = [];

    let rows, cols, arg;

    for (let n = 0, k = 0; n < arguments.length; n += 1) {
        arg = args[n];
        rows = arg.length;
        cols = arg[0].length;

        if (cols === undefined) { // eslint-disable-line no-undefined
            m[k] = [];
            for (let i = 0; i < rows; i += 1) {
                m[k][i] = arg[i];
            }
            k += 1;
        } else {
            for (let i = 0; i < rows; i += 1) {
                m[k] = [];
                for (let j = 0; j < cols; j += 1) {
                    m[k][j] = arg[i][j];
                }
                k += 1;
            }
        }
    }

    return m;
}
exports.rbind = rbind;

function transpose(m) {
    const res = [];
    const rows = m.length;
    const cols = m[0].length;

    for (let i = 0; i < cols; i += 1) {
        res[i] = [];
        for (let j = 0; j < rows; j += 1) {
            res[i][j] = m[j][i];
        }
    }

    return res;
}
exports.transpose = transpose;
