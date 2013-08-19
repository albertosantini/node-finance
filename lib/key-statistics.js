function getKeyStatistics(params, callback) {
    var url = "http://finance.yahoo.com/q/ks?s=",
        symbol = params.symbol;

    request({
        method: "GET",
        uri: url + symbol
    }, function (err, response, data) {
        var contents,
            headers,
            i,
            stats = [];

        headers = jQuery(".yfnc_tablehead1", data).find("font").remove().end();
        contents = jQuery(".yfnc_tabledata1", data).find("font").remove().end();

        for (i = 0; i < contents.length; i = i + 1) {
            stats[i] = {
                type: "uneditable",
                inputParams: {
                    label: headers[i].innerHTML,
                    value: contents[i].innerHTML
                }
            };
        }

        callback(err, stats);
    });
}
exports.getKeyStatistics = getKeyStatistics;

