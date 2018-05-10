"use strict";

function parse(arr, {
    skipHeader = false,
    delimeter = ",",
    reverse = false,
    column = 0,
    replaceZeroes = false,
    skipNRecords = 0
} = {}) {
    const res = [];
    const recs = arr.split("\n").filter(el => el !== "");

    if (skipHeader) {
        recs.shift();
    }

    if (skipNRecords) {
        let n = skipNRecords;

        while (n) {
            recs.shift();
            n -= 1;
        }
    }

    if (reverse) {
        recs.reverse();
    }

    if (replaceZeroes) {
        for (let i = 0; i < recs.length; i += 1) {
            if (recs[i] === "0.00") {
                if (i > 0) {
                    recs[i] = recs[i - 1];
                } else {
                    let c = 1;

                    while (recs[c] === "0.00") {
                        c += 1;
                    }
                    recs[i] = recs[c];
                }
            }
        }
    }

    recs.forEach(el => {
        res.push(el.split(delimeter)[column]);
    });

    return res;
}
exports.parse = parse;
