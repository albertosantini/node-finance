"use strict";

function parse(arr, options) {
    var opts = options || {},
        skipHeader = opts.skipHeader || false,
        delimeter = opts.delimeter || ",",
        reverse = opts.reverse || false,
        column = opts.column || 0,
        replaceZeroes = opts.replaceZeroes || false,
        skipNRecords = opts.skipNRecords || 0,
        i,
        c,
        recs,
        res = [];

    recs = arr.split("\n").filter(function (el) {
        return (el !== "");
    });

    if (skipHeader) {
        recs.shift();
    }

    if (skipNRecords) {
        while (skipNRecords > 0) {
            recs.shift();
            skipNRecords -= 1;
        }
    }

    if (reverse) {
        recs.reverse();
    }

    if (replaceZeroes) {
        for (i = 0; i < recs.length; i += 1) {
            if (recs[i] === "0.00") {
                if (i > 0) {
                    recs[i] = recs[i - 1];
                } else {
                    c = 1;
                    while (recs[c] === "0.00") {
                        c = c + 1;
                    }
                    recs[i] = recs[c];
                }
            }
        }
    }

    recs.forEach(function (el) {
        res.push(el.split(delimeter)[column]);
    });

    return res;
}
exports.parse = parse;
