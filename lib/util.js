"use strict";

function log(...args) {
    const now = new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    console.log(now, ...args); // eslint-disable-line no-console
}

function toBase64(str) {
    return Buffer.from(str || "", "utf8").toString("base64");
}

const urlParse = require("url").parse;
const https = require("https");
const http = require("http");
const querystring = require("querystring");
const EventEmitter = require("events");
const HttpsProxyAgent = require("https-proxy-agent");

function request({
    url = "",
    method = "GET",
    headers = {},
    body = null,
    qs = {}
} = {}, callback) {
    const ee = new EventEmitter();
    const reqUrl = urlParse(url);
    const isHttps = reqUrl.protocol === "https:";
    const host = reqUrl.hostname;
    const port = reqUrl.port || (isHttps ? 443 : 80);
    const auth = reqUrl.auth;

    let path = reqUrl.path;

    if (method === "GET" && Object.keys(qs).length) {
        path += `?${querystring.stringify(qs)}`;
    }

    if (auth) {
        headers.Authorization = `Basic ${toBase64(auth)}`;
    }

    if (body) {
        headers["Content-Type"] = "application/json";
        headers["Content-Length"] = JSON.stringify(body).length;
    }

    const requestOptions = {
        host,
        port,
        path,
        method,
        headers
    };

    function requestResponse(res) {
        ee.emit("response");

        res.setEncoding("utf8");

        let rawData = "";

        res.on("data", chunk => {
            ee.emit("data", chunk);

            rawData += chunk;
        });

        res.on("end", () => callback(null, res, rawData));
    }

    const proxy = process.env.https_proxy || process.env.http_proxy;

    if (proxy) {
        requestOptions.agent = new HttpsProxyAgent(proxy);
    }

    let req;

    if (isHttps) {
        req = https.request(requestOptions, requestResponse);
    } else {
        req = http.request(requestOptions, requestResponse);
    }

    req.on("error", err => callback(err));

    if (body) {
        req.write(JSON.stringify(body));
    }

    req.end();

    return ee;
}

exports.log = log;
exports.request = request;
