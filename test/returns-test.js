"use strict";

var vows = require("vows"),
    assert = require("assert"),
    returns = require("../lib/returns");

vows.describe("Returns tests").addBatch({
    "get returns": {
        topic: function () {
            returns.getReturns(["YHOO", "IBM"], new Date(), this.callback);
        },

        "check returns": function (err, returns) {
            if (!err) {
            }
        }
    }

}).export(module);

