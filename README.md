FINANCE
=======
[![NPM version](https://badge.fury.io/js/finance.svg)](http://badge.fury.io/js/finance)
![](https://github.com/albertosantini/node-finance/workflows/CI/badge.svg)

This module contains an implementation of Markowitz algorithm for the
portfolio optimization, a routine for retrieving historical prices from Yahoo,
statistical information for stocks and a routine for calculating implied
volatility using Black and Scholes formula.

Example
========

See examples directory.

For a frontend, see [node-conpa](http://github.com/albertosantini/node-conpa).

Installation
============

To install with [npm](http://github.com/isaacs/npm):

    npm install finance

Tested with Node.js 14.x, R 3.4.3 and Rserve 1.7.3.

Methods
=======

keystatistics.getKeyStatistics(params, callback)
------------------------------

It retrieves the key statistics for the stocks and returns an array of objects
to create an uneditable form on front-end side.

**Params**

- *symbol* asset symbol.

**Callback response**

- *keyStatistics* object.

optionchain.getOptionChainFromYahoo(params, callback)
---------------------------------

It retrieves the strike values for calls and puts from Yahoo! Finance.

**Params**

- *symbol* asset symbol.
- *expiration* expiration month. Has to be in the form: "YYYY-MM-DD", example: "2016-01-03".

**Callback response**

- *optionChain*

    - *strike* strike value of the asset.
    - *expDateStr* expire date (string).
    - *expDate* expire date (Date).
    - *now* Date.
    - *calls* vector of call values.
    - *puts* vector of put values.

parsecsv.parse(arr, options)
--------------

**Arguments**

- *arr* is the string containing the comma separated value content.

- *options*

    - *skipHeader* flag to skip the first row (dafault false).
    - *delimeter* is the delimeter between the fields (default ",").
    - *reverse* to reverse the rows (default false).
    - *column* is the column to extract (default 0).
    - *replaceZeroes* flag to replace zeroes with the previous value (default false).
    - *skipNRecords* flag to skip records (default 0).

performances.getPerformances(x, weights)
----------------------------

It calculates the weighted performance for a matrix.

**Arguments**

- *x* matrix containing the values (i.e. the asset returns).
- *weights* the weights

*Returns* a vector containing the weighted perfomance of the matrix.

portfolio.getOptimalPortfolio(params, callback, config)
-----------------------------

It creates an optimal portfolio. If *config* is defined, the method call a
Rserve instance, otherwise a native implementation is used.

**Params**

- *prods* vector of symbols.
- *referenceDate* reference date (String).
- *targetReturn* weekly target return, if undefined, the mean of returns.
- *lows* vector of constraints.
- *highs* vector of constraints.
- *shorts* a logical indicating whether shortsales are allowed.

**Callback response**

- *perf* performances vector.
- *message* error message, if empty the optimization is fine.
- *optim* details of quadprog response.

    - *solution* vector of weights.
    - *value* the value of the quadratic function at the solution.
    - *unconstrained_solution* vector of the unconstrained minimizer.
    - *iterations* the number of iterations the algorithm needed.
    - *iact* vector with the indices of the active constraints at the solution.
    - *message* error message, if empty the optimization is fine.
    - *pm* portfolio return.
    - *ps* portfolio risk.

**Config**

- *host* hostname or ip address of R instance.
- *port* port of Rserve instance.
- *user* username for remote connection of Rserve instance.
- *password* password for remote connection of Rserve instance.
- *debug* boolean to enable rio logging.

portfolio.getScriptOptimalPortfolio(params, callback)
-----------------------------------

It retrieves the source code of the R script calculating the optimal portfolio.

**Params** See portfolio.getOptimalPortfolio.

**Callback response**

- *source* the source code of the script.

quotes.getQuotes(symbol, refDate, callback)
----------------

It retrieves the prices from Yahoo! finance.

**Arguments**

- *symbol* asset symbol.
- *refDate* reference date (Date).

**Callback response**

- *error* calback error.
- *symbol* asset symbol.
- *prices*

    - *beforeRefDate* CSV string of prices before reference date.
    - *afterRefDate* CSV string of prices after reference date.

returns.getReturns(symbols, refDate, callback)
------------------

It retrieves the prices from Yahoo! finance and calculates the log returns of
the close prices.

**Arguments**

- *symbols* vector containing the symbols of the assets.
- *refDate* reference date (String).

**Callback response**

- *returns*

    - *message* message error.
    - *beforeRefDate* vector of log returns of close prices before reference date.
    - *afterRefDate* vector of log returns of close prices after reference date.

riskfreerate.getRiskFreeRateFromYahoo(callback)
-------------------------------------

It retrieves the risk free rate from Yahoo! Finance.

**Callback response**

- *riskfree* risk free rate.

volatility.getImpliedVolatility(params, callback)
-------------------------------

It calculates the implied volatility for an option using Black and Scholes
formula.

**Arguments**

- *symbol* asset symbol.

**Callback response**

- *option*

    - *strike* strike of the asset.
    - *riskfree* risk free rate.
    - *expDate* expire date (string).
    - *callVolatility* implied volatility for the calls.
    - *putVolatility* implied volatility for the puts.
