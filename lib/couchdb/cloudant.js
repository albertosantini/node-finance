/*global emit, sum */

// viewByRef
function (doc) {
    if (doc.ref) {
        emit(doc.ref, 1);
    }
}

function (keys, values, rereduce) {
    return sum(values);
}

// viewByCreatedAt
function (doc) {
    if (doc.created_at) {
        emit(doc.created_at, doc);
    }
}

// viewByRet
function (doc) {
    if (doc.ret) {
        emit(parseFloat(doc.ret), doc);
    }
}

// viewByRisk
function (doc) {
    if (doc.risk) {
        emit(parseFloat(doc.risk), doc);
    }
}

// viewByPerf
function (doc) {
    if (doc.perf) {
        emit(parseFloat(doc.perf), doc);
    }
}

// viewMostUsedAssets - copied by http://wiki.apache.org/couchdb/View_Snippets
function (doc) {
    if (doc.assets) {
        doc.assets.forEach(function (asset) {
            emit(asset, 1);
        });
    }
}

function (keys, values, rereduce) {
    var MAX = 10, tags = {}, lastkey = null, top = [],
        k, v, t, n;

    if (!rereduce) {
        for (k in keys) {
            if (tags[keys[k][0]]) {
                tags[keys[k][0]] += values[k];
            } else {
                tags[keys[k][0]] = values[k];
            }
        }
        lastkey = keys[keys.length - 1][0];
    } else {
        tags = values[0];
        for (v = 1; v < values.length; v += 1) {
            for (t in values[v]) {
                if (tags[t]) {
                    tags[t] += values[v][t];
                } else {
                    tags[t] = values[v][t];
                }
            }
        }
    }

    for (t in tags) {
        if (t) {
            top[top.length] = [t, tags[t]];
        }
    }

    function sort_tags(a, b) {
        return b[1] - a[1];
    }

    top.sort(sort_tags);

    for (n = MAX; n < top.length; n += 1) {
        if (top[n][0] !== lastkey) {
            tags[top[n][0]] = undefined;
        }
    }

    return tags;
}
