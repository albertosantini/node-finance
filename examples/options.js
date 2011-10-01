/*jslint node:true, sloppy:true */

var util = require("util"),
    finance = require("../lib/finance");

finance.quotes.getRiskFreeRateFromYahoo(function (res) {
    console.log("Risk Free Rate (3 months): " + res);
});

finance.quotes.getOptionChainFromYahoo("IBM", function (res) {
    console.log("Strike: " + res.strike);
    console.log("Expire Date: " + res.expDateStr);
    console.log("First call: " + util.inspect(res.calls[0]));
    console.log("First put: " + util.inspect(res.puts[0]));
});
