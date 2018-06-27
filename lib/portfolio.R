require(tseries)
require(RJSONIO)

hackZeroes <- function (x) {
    for (i in which(x == 0)) {
        if (i == 1) {
            c = i
            while (x[c] == 0) {
                c = c + 1
            }
            x[i] <- x[c]
        } else {
            x[i] <- x[i - 1]
        }
    }
    x
}

getLogReturns <- function (symbol, start, end, skipPrices=-1) {
    prices = try(get.hist.quote(symbol, start=start, end=end,
        compression="w", quote="Close", quiet=TRUE))

    prices <- tail(prices, skipPrices)

    if (class(prices) == "try-error") {
        assetReturns = NULL
    } else {
        assetPrice <- hackZeroes(as.numeric(prices))
        assetReturns <- diff(log(assetPrice[1:(length(assetPrice)-1)]))
    }

    assetReturns
}

getReturns <- function (symbol, refDate) {
    ddNow = format(Sys.Date(), "%d")
    mmNow = format(Sys.Date(), "%m")
    yyNow = format(Sys.Date(), "%Y")

    refDate = as.POSIXct(refDate, format="%a %b %d %Y %H:%M:%S", tz="GMT")
    ddRef = format(refDate, "%d")
    mmRef = format(refDate, "%m")
    yyRef = format(refDate, "%Y")

    start = paste(as.numeric(yyRef) - 2, mmRef, ddRef, sep="-")
    end = paste(yyRef, mmRef, ddRef, sep="-")
    retsBefore = getLogReturns(symbol, start, end, skipPrices=-1)

    retsAfter = NULL
    if (ddNow != ddRef || mmNow != mmRef || yyNow != yyRef) {
        start = paste(yyRef, mmRef, ddRef, sep="-")
        end = paste(yyNow, mmNow, ddNow, sep="-")
        retsAfter = getLogReturns(symbol, start, end, skipPrices=-2)
    }

    list(beforeRefDate=retsBefore, afterRefDate=retsAfter)
}

getOptimalPortfolio <- function (jsonObj) {
    x <- c()
    p <- c()

    o = fromJSON(jsonObj)

    symbols <- o$prods
    referenceDate <- o$referenceDate
    targetReturn <- o$targetReturn # weekly target return
    lows <- as.numeric(o$lows)
    highs <- as.numeric(o$highs) * -1
    shorts <- ifelse(is.null(o$shorts) || is.na(as.logical(o$shorts)),
        FALSE, as.logical(o$shorts))

    for (asset in symbols) {
        rets = getReturns(asset, referenceDate)
        x <- cbind(x, rets$beforeRefDate)
        if (length(rets$afterRefDate)) {
            p <- cbind(p, rets$afterRefDate)
        }
    }

    if (is.null(targetReturn) || targetReturn == "undefined") {
        pm = mean(x)
    } else {
        pm = as.numeric(targetReturn)
    }

    res <- list()
    res$optim <- try(portfolio.optim(x, pm=pm, reslow=lows, reshigh=highs, shorts=shorts), TRUE)
    if (class(res$optim) == "try-error") {
        res$message <- res$optim[1]
        res$optim <- list()
    } else {
        res$message <- ""
        if (!is.null(p)) {
            res$perf <- cumsum(p %*% res$optim$pw) # performances calc
        }
    }

    return(toJSON(res))
}
