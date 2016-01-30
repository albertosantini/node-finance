"use strict";

var test = require("tape"),
    csv = require("../lib/parse-csv");

test("CSV tests", function (t) {
    var str, res;

    t.plan(2);

    str = "1, 2, 3\n4, 5, 6\n7, 8, 9\n";
    res = csv.parse(str, {
        skipHeader: false
    });

    t.equal(res.length, 3, "get count");

    str = "a, b, c\n1, 2, 3\n4, 5, 6\n7, 8, 9\n";
    res = csv.parse(str, {
        skipHeader: true
    });

    t.equal(res.length, 3, "get count with skip header");
});
