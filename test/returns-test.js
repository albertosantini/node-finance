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

        "check returns with ref date in the past": function (err, rs) {
            assert.ok(!err && rs.beforeRefDate.length === 2);
            assert.ok(!err && rs.beforeRefDate[0].length > 0);
            assert.ok(!err && rs.beforeRefDate[1].length > 0);
            assert.ok(!err && rs.afterRefDate[0].length > 0);
            assert.ok(!err && rs.afterRefDate[1].length > 0);
        }
    },

    "get returns": {
        topic: function () {
            returns.getReturns(["YHOO", "IBM"], new Date(), this.callback);
        },

        "check returns": function (err, rs) {
            assert.ok(!err && rs.beforeRefDate.length === 2);
            assert.ok(!err && rs.beforeRefDate[0].length > 0);
            assert.ok(!err && rs.beforeRefDate[1].length > 0);
            assert.ok(!err && rs.afterRefDate.length === 0);
        }
    }

}).export(module);
