"use strict";

var vows = require("vows"),
    assert = require("assert"),
    returns = require("../lib/returns");

vows.describe("Returns tests").addBatch({
    "get returns with ref date in the past": {
        topic: function () {
            returns.getReturns(["YHOO", "IBM"],
                new Date("Sat Aug 06 2011 12:00:00"),
                this.callback);
        },

        "check returns with ref date in the past": function (err, returns) {
            assert.ok(!err && returns.beforeRefDate.length === 2);
            assert.ok(!err && returns.beforeRefDate[0].length > 0);
            assert.ok(!err && returns.beforeRefDate[1].length > 0);
            assert.ok(!err && returns.afterRefDate[0].length > 0);
            assert.ok(!err && returns.afterRefDate[1].length > 0);
        }
    },

    "get returns": {
        topic: function () {
            returns.getReturns(["YHOO", "IBM"], new Date(), this.callback);
        },

        "check returns": function (err, returns) {
            assert.ok(!err && returns.beforeRefDate.length === 2);
            assert.ok(!err && returns.beforeRefDate[0].length > 0);
            assert.ok(!err && returns.beforeRefDate[1].length > 0);
            assert.ok(!err && returns.afterRefDate.length === 0);
        }
    }

}).export(module);

