"use strict";

var vows = require("vows"),
    assert = require("assert"),
    csv = require("../lib/parse-csv");

vows.describe("CSV tests").addBatch({
    "get count": {
        topic: function () {
            var str = "1, 2, 3\n4, 5, 6\n7, 8, 9\n";

            return csv.parse(str, {
                skipHeader: false
            });
        },

        "is three": function (topic) {
            assert.equal(3, topic.length);
        }
    },

    "get count with skip header": {
        topic: function () {
            var str = "a, b, c\n1, 2, 3\n4, 5, 6\n7, 8, 9\n";

            return csv.parse(str, {
                skipHeader: true
            });
        },

        "is three": function (topic) {
            assert.equal(3, topic.length);
        }
    }

}).export(module);
