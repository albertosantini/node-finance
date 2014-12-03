"use strict";

var fs = require("fs"),
    path = require("path"),
    rio = require("rio"),
    qp = require("quadprog"),
    stats = require("./stats.js"),
    returns = require("./returns.js"),
    performances = require("./performances.js");

function portfolioOptim(x, pm, lows, highs) {
    var i, j, k, Dmat, dvec, a1, a2, a3, a3neg, b3, Amat, bvec,
        res, pw, px, ps;

    x = stats.transpose(x);

    k = x[0].length;
    Dmat = stats.cov(x);
    dvec = stats.repInt(0, k);
    a1 = stats.repInt(1, k);
    a2 = stats.colMeans(x);
    a3 = stats.identity(k, 1);
    a3neg = stats.identity(k, -1);
    b3 = stats.repInt(0, k);
    Amat = stats.rbind(a1, a2, a3, a3, a3neg);
    Amat = stats.transpose(Amat);
    if (pm === 0 || pm === undefined) {
        pm = stats.mean(x);
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
    targetReturn = params.targetReturn === "undefined" ?
            undefined : params.targetReturn;
    lows = params.lows;
    highs = params.highs;

    returns.getReturns(symbols, referenceDate, function (err, rets) {
        var ans = {};

        if (err) {
            callback(err);
            return;
        }

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

        callback(ans.message !== "", ans);
    });
}

function getScriptOptimalPortfolio(params, callback) {
    fs.readFile(path.join(__dirname, "portfolio.R"), "ascii",
        function (err, source) {
            var cmd;

            if (!err) {
                cmd = "\nptf <- getOptimalPortfolio('" +
                    JSON.stringify(params) + "')\n";
                cmd += "fromJSON(ptf)$optim$pw\n";
                cmd += "fromJSON(ptf)$perf\n\n";
                callback(false, source + cmd);
            }
        });
}
exports.getScriptOptimalPortfolio = getScriptOptimalPortfolio;

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
        if (config.debug) {
            rio.enableDebug(true);
        }
    }

    cfg.callback = function (err, res) {
        var ans = {};

        if (!err) {
            ans = JSON.parse(res);
            ans.optim.solution = ans.optim.pw; // temporary hack
        } else {
            ans.message = "Rserve call failed";
        }

        callback(err, ans);
    };

    rio.sourceAndEval(path.join(__dirname, "portfolio.R"), cfg);
}

function getOptimalPortfolio(params, callback, config) {
    if (config instanceof Object) {
        rserveGetOptimalPortfolio(params, callback, config);
    } else {
        nativeGetOptimalPortfolio(params, callback);
    }
}
exports.getOptimalPortfolio = getOptimalPortfolio;
