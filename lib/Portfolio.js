/*jslint node:true, sloppy:true, nomen:true */

var rio = require("rio"),
    qp = require("quadprog"),
    returns = require('./Quotes.js'),
    performances = require('./Performances.js');

function portfolioOptim(x, pm, lows, highs) {
    var i, j, k, Dmat, dvec, a1, a2, a3, a3neg, b3, Amat, bvec,
        res, pw, px, ps;

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

    function mean(x) {
        var i, sum = 0, means;

        means = colMeans(x);
        for (i = 0; i < means.length; i = i + 1) {
            sum = sum + means[i];
        }

        return sum / means.length;
    }

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

    function repInt(n, k) {
        var i, ans = [];

        for (i = 0; i < k; i = i + 1) {
            ans[i] = n;
        }

        return ans;
    }

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

    k = x[0].length;
    Dmat = cov(x);
    dvec = repInt(0, k);
    a1 = repInt(1, k);
    a2 = colMeans(x);
    a3 = identity(k, 1);
    a3neg = identity(k, -1);
    b3 = repInt(0, k);
    Amat = rbind(a1, a2, a3, a3, a3neg);
    Amat = transpose(Amat);
    if (pm === 0 || pm === undefined) {
        pm = mean(x);
    }
    bvec = [1].concat(pm).concat(b3).concat(lows).concat(highs);

    for (i = 0; i < Dmat.length; i = i + 1) {
        Dmat[i] = [undefined].concat(Dmat[i]);
    }
    Dmat = [undefined].concat(Dmat);
    dvec = [undefined].concat(dvec);
    for (i = 0; i < Amat.length; i = i + 1) {
        Amat[i] = [undefined].concat(Amat[i]);
    }
    Amat = [undefined].concat(Amat);
    bvec = [undefined].concat(bvec);

    res = qp.solveQP(Dmat, dvec, Amat, bvec, 2);

    res.solution.shift();

    px = [];
    pw = res.solution;
    //~ ps = 0;
    //~ pm = 0;
    for (i = 0; i < x.length; i += 1) {
        px[i] = 0;
        for (j = 0; j < pw.length; j += 1) {
            px[i] += (pw[j] * x[i][j]);
        }
        //~ ps += (px[i] - pm) * (px[i] - pm);
        //~ pm += px[i];
    }
    //~ ps = Math.sqrt(ps / (x.length - 1));
    //~ pm = pm / x.length;
    ps = 0;
    for (i = 0; i < x.length; i += 1) {
        ps += (px[i] - pm) * (px[i] - pm);
    }
    ps = Math.sqrt(ps / (x.length - 1));

    res.pm = pm;
    res.ps = ps;

    return res;
}

function nativeGetOptimalPortfolio(params, callback) {
    var symbols, referenceDate, targetReturn, lows, highs;

    symbols = params.prods;
    referenceDate = params.referenceDate;
    targetReturn = params.targetReturn === 'undefined' ?
            undefined : params.targetReturn;
    lows = params.lows;
    highs = params.highs;

    returns.getReturns(symbols, referenceDate, function (rets) {
        var ans = {};

        ans.perf = [];
        ans.message = rets.message;

        if (rets.message === "") {
            ans.optim = portfolioOptim(rets.beforeRefDate, targetReturn,
                lows, highs);
            ans.message = ans.optim.message;
        }

        if (rets.message === "" && ans.optim.message === "") {
            if (rets.afterRefDate.length > 0 &&
                    rets.afterRefDate[0].length > 0) {
                ans.perf = performances.getPerformances(rets.afterRefDate,
                    ans.optim.solution);
            }
        }

        callback(ans);
    });
}

function rserveGetOptimalPortfolio(params, callback, config) {
    var cfg = {
        entryPoint: "getOptimalPortfolio",
        data: params
    };

    if (config) {
        cfg.host = config.host;
        cfg.port = config.port;
        cfg.user = config.user;
        cfg.password = config.password;
    }

    cfg.callback = function (res) {
        var ans = {};

        if (res !== false) {
            ans = JSON.parse(res);
            ans.optim.solution = ans.optim.pw; // temporary hack
        } else {
            ans.message = "Rserve call failed";
        }

        callback(ans);
    };

    rio.sourceAndEval(__dirname + "/Portfolio.R", cfg);
}

function getOptimalPortfolio(params, callback, config) {
    if (config instanceof Object) {
        rserveGetOptimalPortfolio(params, callback, config);
    } else {
        nativeGetOptimalPortfolio(params, callback);
    }
}
exports.getOptimalPortfolio = getOptimalPortfolio;
