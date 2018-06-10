"use strict";

const os = require("os");

const request = require("./util").request;

const config = {
    liveDomain: "x.x.x",
    liveUrl: "liveUrl",
    liveDb: "myLiveDBName",
    testingUrl: "testingUrl",
    testingDb: "myTestingDBName",
    design: "design",
    configured: false
};

function configure(params) {
    config.liveDomain = params.liveDomain || config.liveDomain;
    config.liveUrl = params.liveUrl || config.liveUrl;
    config.liveDb = `/${params.liveDb || config.liveDb}`;
    config.testingUrl = params.testingUrl || config.testingUrl;
    config.testingDb = `/${params.testingDb || config.testingDb}`;
    config.design = params.design || config.design;

    config.configured = true;
}
exports.configure = configure;

function isLiveInstance() {
    return os.hostname().search(config.liveDomain) >= 0;
}

function getCouchDBInstance() {
    const isLive = isLiveInstance();
    const couchURL = isLive ? config.liveUrl : config.testingUrl;
    const couchDB = isLive ? couchURL + config.liveDb : couchURL + config.testingDb;
    const couchDesign = `/_design/${config.design}`;

    return {
        couchURL,
        couchDB,
        couchDesign
    };
}

function putPortfolioOnCRM(params, callback) {
    const couch = getCouchDBInstance();
    const symbols = params.symbols;
    const weights = params.weights;
    const ret = parseFloat(params.ret);
    const risk = params.risk;
    const perf = params.perf || [];
    const highs = params.highs;
    const lows = params.lows;
    const ref = new Date(params.ref); // from String to Date object
    const now = new Date();
    const ddNow = now.getDate();
    const mmNow = now.getMonth() + 1;
    const yyyyNow = now.getFullYear();
    const HHNow = now.getHours();
    const MMNow = now.getMinutes();
    const SSNow = now.getSeconds();
    const ddRef = ref.getDate();
    const mmRef = ref.getMonth() + 1;
    const yyyyRef = ref.getFullYear();
    const ptf = {
        /* eslint-disable camelcase */
        created_at: `${yyyyNow}/${ // yyyy/mm/dd hh:mm:ss
            mmNow < 10 ? `0${mmNow}` : mmNow}/${
            ddNow < 10 ? `0${ddNow}` : ddNow} ${
            HHNow < 10 ? `0${HHNow}` : HHNow}:${
            MMNow < 10 ? `0${MMNow}` : MMNow}:${
            SSNow < 10 ? `0${SSNow}` : SSNow}`,
        /* eslint-enable camelcase */
        assets: symbols,
        weights,
        ref: `${yyyyRef}/${ // yyyy/mm/dd
            mmRef < 10 ? `0${mmRef}` : mmRef}/${
            ddRef < 10 ? `0${ddRef}` : ddRef}`,
        ret: Math.pow(1 + ret, 52) - 1, // annualized: ret weekly
        risk: risk * Math.sqrt(52), // annualized: risk weekly
        perf: perf.length > 0 ? perf[perf.length - 1] : 0,
        constraints: {
            lowBounds: lows,
            highBounds: highs
        }
    };

    request({
        method: "POST",
        url: couch.couchDB,
        body: ptf
    }, (error, response, data) => {
        let res = {};

        res.id = "";

        if (!error) {
            res = data;
        }
        callback(error, res.id);
    });
}
exports.putPortfolioOnCRM = putPortfolioOnCRM;

function getPortfolio(params, callback) {
    const couch = getCouchDBInstance();

    request({
        method: "GET",
        url: `${couch.couchDB}/${params.id}`
    }, (error, response, data) => {
        let res = {};

        if (!error) {
            res = JSON.parse(data);
        }

        callback(error, res);
    });
}
exports.getPortfolio = getPortfolio;

function getView(name, options, callback) {
    const couch = getCouchDBInstance();
    const view = `${couch.couchDesign}/_view/${name}`;

    let opt,
        opts = "?";

    for (opt in options) {
        if (options.hasOwnProperty(opt)) {
            opts += `${opt}=${options[opt]}&`;
        }
    }

    request({
        method: "GET",
        url: couch.couchDB + view + opts
    }, (error, response, data) => {
        callback(error, JSON.parse(data));
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
    }, (error, data) => {
        let key,
            mostUsedSymbols;

        const n = 10,
            mostUsedSymbolsSortable = [];

        if (data && data.rows) {
            mostUsedSymbols = data.rows[0].value;
        } else {
            callback("Most used assets not available", null);
            return;
        }

        for (key in mostUsedSymbols) {
            if (mostUsedSymbols.hasOwnProperty(key)) {
                mostUsedSymbolsSortable.push([key, mostUsedSymbols[key]]);
            }
        }

        mostUsedSymbolsSortable.sort((a, b) => b[1] - a[1]);

        if (mostUsedSymbolsSortable.length > n) {
            mostUsedSymbolsSortable.splice(n,
                mostUsedSymbolsSortable.length - n - 1);
        }

        callback(error, mostUsedSymbolsSortable);
    });

    // key: "stock", value: {stock: frequency}
}
exports.getMostUsedAssets = getMostUsedAssets;
