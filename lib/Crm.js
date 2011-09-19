/*jslint node: true, sloppy: true, unparam:true */

var os = require('os'),
    request = require('request');

var config = {
    liveDomain: "x.x.x",
    keylive: "user:password",
    dbLive: "myLiveDBName",
    keyTesting: "user:password",
    dbTesting: "myTestingDBName",
    configured: false
};

function configure(params) {
    config.liveDomain = params.liveDomain || config.liveDomain;
    config.keyLive = params.keyLive || config.keyLive;
    config.dbLive = "/" + (params.dbLive || config.dbLive);
    config.keyTesting = params.keyTesting || config.keyTesting;
    config.dbTesting = "/" + (params.dbTesting || config.dbTesting);

    config.configured = true;
}
exports.configure = configure;

function isLiveInstance() {
    var hostname = os.hostname();
    if (hostname.search(config.liveDomain) >= 0) {
        return true;
    } else {
        return false;
    }
}

function getCouchDBInstance() {
    var isLive, couchURL, couchDB, couchDesign;

    isLive = isLiveInstance();

    couchURL = (isLive ?
            "http://" + config.keyLive + "@proplus.cloudant.com" :
            "http://" + config.keyTesting + "@proplus.cloudant.com");

    couchDB =  (isLive ?
            couchURL + config.dbLive : couchURL + config.dbTesting);

    couchDesign = "/_design/ConPA";

    return {
        couchURL: couchURL,
        couchDB: couchDB,
        couchDesign: couchDesign
    };
}

function putPortfolioOnCRM(params, callback) {
    var couch = getCouchDBInstance(),
        symbols,
        weights,
        ref,
        ret,
        risk,
        perf,
        highs,
        lows,
        ptf,
        now,
        ddNow,
        mmNow,
        yyyyNow,
        HHNow,
        MMNow,
        SSNow,
        ddRef,
        mmRef,
        yyyyRef;

    symbols = params.symbols;
    weights = params.weights;
    ref = params.ref;
    ret = parseFloat(params.ret);
    risk = params.risk;
    perf = params.perf || [];
    highs = params.highs;
    lows = params.lows;

    ref = new Date(ref); // from String to Date object
    now = new Date();

    ddNow = now.getDate();
    mmNow = now.getMonth() + 1;
    yyyyNow = now.getFullYear();
    HHNow = now.getHours();
    MMNow = now.getMinutes();
    SSNow = now.getSeconds();

    ddRef = ref.getDate();
    mmRef = ref.getMonth() + 1;
    yyyyRef = ref.getFullYear();

    ptf = {
        created_at: yyyyNow + "/" + // yyyy/mm/dd hh:mm:ss
            (mmNow < 10 ? "0" + mmNow : mmNow) + "/" +
            (ddNow < 10 ? "0" + ddNow : ddNow) + " " +
            (HHNow < 10 ? "0" + HHNow : HHNow) + ":" +
            (MMNow < 10 ? "0" + MMNow : MMNow) + ":" +
            (SSNow < 10 ? "0" + SSNow : SSNow),
        assets: symbols,
        weights: weights,
        ref: yyyyRef + "/" + // yyyy/mm/dd
            (mmRef < 10 ? "0" + mmRef : mmRef) + "/" +
            (ddRef < 10 ? "0" + ddRef : ddRef),
        ret: Math.pow(1 + ret, 52) - 1, // annualized: ret weekly
        risk: risk * Math.sqrt(52), // annualized: risk weekly
        perf: perf.length > 0 ? perf[perf.length - 1] : 0,
        constraints: {
            lowBounds: lows,
            highBounds: highs
        }
    };

    request({
        method: 'POST',
        uri: couch.couchDB + "/",
        json: ptf
    }, function (error, response, data) {
        var res = {};

        res.id = "";

        if (!error) {
            res = data;
        }
        callback(res.id);
    });
}
exports.putPortfolioOnCRM = putPortfolioOnCRM;

function getView(name, options, callback) {
    var couch = getCouchDBInstance(),
        view = couch.couchDesign + "/_view/" + name,
        opt,
        opts = "?";

    for (opt in options) {
        if (options.hasOwnProperty(opt)) {
            opts += opt + "=" + options[opt] + "&";
        }
    }

    request({
        method: 'GET',
        uri: couch.couchDB + view + opts,
        json: true
    }, function (error, response, data) {
        callback(data);
    });
}

function getPortfolioCount(callback) {
    getView("viewByRef", {
        group: false,
        reduce: true
    }, callback); // rows[0].value
}
exports.getPortfolioCount = getPortfolioCount;

function getLastCreatedPortfolios(limit, callback) {
    getView("viewByCreatedAt", {
        limit: limit || 5,
        descending: true
    }, callback);
}
exports.getLastCreatedPortfolios = getLastCreatedPortfolios;

function getHighProfileRiskPortfolios(limit, callback) {
    getView("viewByRisk", {
        limit: limit || 3,
        descending: true
    }, callback);
}
exports.getHighProfileRiskPortfolios = getHighProfileRiskPortfolios;

function getLowProfileRiskPortfolios(limit, callback) {
    getView("viewByRisk", {
        limit: limit || 3,
        ascending: true
    }, callback);
}
exports.getLowProfileRiskPortfolios = getLowProfileRiskPortfolios;

function getHighProfileReturnPortfolios(limit, callback) {
    getView("viewByRet", {
        limit: limit || 3,
        descending: true
    }, callback);
}
exports.getHighProfileReturnPortfolios = getHighProfileReturnPortfolios;

function getLowProfileReturnPortfolios(limit, callback) {
    getView("viewByRet", {
        limit: limit || 3,
        ascending: true
    }, callback);
}
exports.getLowProfileReturnPortfolios = getLowProfileReturnPortfolios;

function getBestPerformingPortfolios(limit, callback) {
    getView("viewByPerf", {
        limit: limit || 3,
        descending: true
    }, callback);
}
exports.getBestPerformingPortfolios = getBestPerformingPortfolios;

function getWorstPerformingPortfolios(limit, callback) {
    return getView("viewByPerf", {
        limit: limit || 3,
        ascending: true
    }, callback);
}
exports.getWorstPerformingPortfolios = getWorstPerformingPortfolios;

function getMostUsedAssets(callback) {
    getView("viewMostUsedAssets", {
        group: false,
        reduce: true
    }, function (data) {
        var key, n = 10, mostUsedSymbols, mostUsedSymbolsSortable = [];

        mostUsedSymbols = data.rows[0].value;

        for (key in mostUsedSymbols) {
            if (mostUsedSymbols.hasOwnProperty(key)) {
                mostUsedSymbolsSortable.push([key, mostUsedSymbols[key]]);
            }
        }

        mostUsedSymbolsSortable.sort(function (a, b) {
            return b[1] - a[1];
        });

        if (mostUsedSymbolsSortable.length > n) {
            mostUsedSymbolsSortable.splice(n,
                mostUsedSymbolsSortable.length - n - 1);
        }

        callback(mostUsedSymbolsSortable);
    });
    // key: "stock", value: {stock: frequency}
}
exports.getMostUsedAssets = getMostUsedAssets;


