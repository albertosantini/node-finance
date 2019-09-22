"use strict";

const fs = require("fs");
const path = require("path");

const rio = require("rio");
const qp = require("quadprog");

const stats = require("./stats.js");
const returns = require("./returns.js");
const performances = require("./performances.js");

/* eslint no-undefined:off, default-param-last:off */
function portfolioOptim(xT, pm = stats.mean(xT), lows, highs, shorts) {
    const x = stats.transpose(xT);

    let Dmat, dvec, Amat, bvec, ps;

    const k = x[0].length;
    const a1 = stats.repInt(1, k);
    const a2 = stats.colMeans(x);
    const a3 = stats.identity(k, 1);
    const a3neg = stats.identity(k, -1);
    const b3 = stats.repInt(0, k);

    Dmat = stats.cov(x);
    dvec = stats.repInt(0, k);

    Amat = shorts
        ? stats.rbind(a1, a2, a3, a3neg)
        : stats.rbind(a1, a2, a3, a3, a3neg);

    Amat = stats.transpose(Amat);

    bvec = shorts
        ? [1].concat(pm).concat(lows).concat(highs)
        : [1].concat(pm).concat(b3).concat(lows).concat(highs);

    for (let i = 0; i < Dmat.length; i += 1) {
        Dmat[i] = [undefined].concat(Dmat[i]);
    }
    Dmat = [undefined].concat(Dmat);
    dvec = [undefined].concat(dvec);
    for (let i = 0; i < Amat.length; i += 1) {
        Amat[i] = [undefined].concat(Amat[i]);
    }
    Amat = [undefined].concat(Amat);
    bvec = [undefined].concat(bvec);

    const res = qp.solveQP(Dmat, dvec, Amat, bvec, 2);

    if (res.message) {
        return res;
    }

    // res.solution.shift(); // not used to https://github.com/nodejs/node/issues/15427
    res.solution = res.solution.slice(1, res.solution.length);

    const px = [];
    const pw = res.solution;

    // ps = 0;
    // pm = 0;
    for (let i = 0; i < x.length; i += 1) {
        px[i] = 0;
        for (let j = 0; j < pw.length; j += 1) {
            px[i] += (pw[j] * x[i][j]);
        }

        // ps += (px[i] - pm) * (px[i] - pm);
        // pm += px[i];
    }

    // ps = Math.sqrt(ps / (x.length - 1));
    // pm = pm / x.length;
    ps = 0;
    for (let i = 0; i < x.length; i += 1) {
        ps += (px[i] - pm) * (px[i] - pm);
    }
    ps = Math.sqrt(ps / (x.length - 1));

    res.pm = pm;
    res.ps = ps;

    return res;
}

function nativeGetOptimalPortfolio(params, callback) {
    const symbols = params.prods;
    const referenceDate = params.referenceDate;
    const targetReturn = (params.targetReturn === "undefined" || !params.targetReturn)
        ? undefined : params.targetReturn;
    const lows = params.lows;
    const highs = params.highs;
    const shorts = params.shorts;

    returns.getReturns(symbols, referenceDate, (err, rets) => {
        if (err) {
            callback(rets && rets.message || err);
            return;
        }

        const ans = {
            perf: [],
            message: rets.message
        };

        if (rets.message === "") {
            ans.optim = portfolioOptim(rets.beforeRefDate, targetReturn,
                lows, highs, shorts);
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
        (err, source) => {
            if (err) {
                return callback(true);
            }

            let cmd = `\nptf <- getOptimalPortfolio('${JSON.stringify(params)}')\n`;

            cmd += "fromJSON(ptf)$optim$pw\n";
            cmd += "fromJSON(ptf)$perf\n\n";

            return callback(false, source + cmd);
        });
}
exports.getScriptOptimalPortfolio = getScriptOptimalPortfolio;

function rserveGetOptimalPortfolio(params, callback, config) {
    const cfg = {
        filename: path.join(__dirname, "portfolio.R"),
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

    cfg.callback = function(err, res) {
        let ans = {};

        if (!err) {
            ans = JSON.parse(res);
            ans.optim.solution = ans.optim.pw;
        } else {
            ans.message = "Rserve call failed";
        }

        callback(err, ans);
    };

    rio.e(cfg);
}

function getOptimalPortfolio(params, callback, config) {
    if (config instanceof Object) {
        rserveGetOptimalPortfolio(params, callback, config);
    } else {
        nativeGetOptimalPortfolio(params, callback);
    }
}
exports.getOptimalPortfolio = getOptimalPortfolio;
