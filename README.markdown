FINANCE
=======
[![Build Status](https://travis-ci.org/albertosantini/node-finance.png)](https://travis-ci.org/albertosantini/node-finance)
[![NPM version](https://badge.fury.io/js/finance.png)](http://badge.fury.io/js/finance)
[![NGN Dependencies](https://david-dm.org/albertosantini/node-finance.png)](https://david-dm.org/albertosantini/node-finance)

This module contains an implementation of Markowitz algorithm for the portfolio
optimization, a routine for retrieving historical prices from Yahoo,
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

Tested with node 0.10.26, R 3.1.0 and Rserve 1.7.3.

Notes
=====

Before using crm methods, you need to configure the details of the persistence
system. The portfolios are saved on a CouchDB instance. The configuration
allows a live and testing environment.

    finance.crm.configure({
        liveDomain: "x.x.x",
        liveUrl: "http://key1:pass1@p.c.com",
        liveDb: "myLiveDBName",
        testingUrl: "http://key2:pass2@p.c.com",
        testingDb: "myTestingDBName",
        design: "designName",
    });

In the support directory there is a script to install the design document with
the views used in the dashboard tab.

Methods
=======

keystatistics.getKeyStatistics(params, callback)
------------------------------

It retrieves the key statistics for the stocks and returns an array of objects
to create an uneditable form on front-end side.

**Params**

- *symbol* asset symbol.

**Callback response**

- *stats* array of statistics objects

    - *label* the label of the field.
    - *value* the value of the field.

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

crm.configure(params)
-------------

It configures a CRM database instance (i.e. a CouchDB instance).
The user can configure a testing and live instance.

**Params**

- *liveDomain* url for the live domain.
- *liveUrl* url for the live instance, eventually with the credentials.
- *liveDb* name of live instance.
- *testingUrl* url for the testing instance, eventually with the credentials.
- *testingDb* name of testing instance.
- *design* name of design document.

crm.putPortfolioOnCRM(params, callback)
---------------------

It saves a portfolio and his stats to CRM database.

**Params**

- *symbols* portfolio assets.
- *weights* weights of the portfolio assets.
- *ref* reference date (string).
- *ret*  target return of the portfolio.
- *risk* risk of the portofolio.
- *perf* performances vector.
- *highs* high constraints.
- *lows* low constraints.

**Response callback**

- *id* id of the portfolio saved.

crm.getPortfolio(params, callback)
---------------------

It retrieves a portfolio.

**Params**

- *id* portfolio id.

**Response callback**

- *assets* portfolio assets.
- *constraints* portfolio constraints.

    - *highs* high constraints.
    - *lows* low constraints.

- *created_at* creation date of the portfolio.
- *perf* performances vector.
- *ref* reference date (string).
- *ret*  target return of the portfolio.
- *risk* risk of the portofolio.
- *weights* weights of the portfolio assets.

crm.getPortfolioCount(callback)
---------------------

It retrieves the number of portfolios saved.

**Response callback**

- *rows* array of results.

    - *key* null.
    - *value* the number of portfolios.

crm.getMostUsedAssets(callback)
------------------------------

**Response callback**

- *MostUsedAssets*

    - *key* asset symbol.
    - *value*

        - *stock* asset frequency.

crm.getLastCreatedPortfolios(limit, callback)
----------------------------

It retrieves the latest portofolios created.

**Arguments**

- *limit* maximum number of records.

**Response callback**

- *rows* array of results.

    - *key* Date (string).
    - *value*  Portfolio.

        - *created_at* creation date (string).
        - *assets* vector containing the assets.
        - *weights* the weight of the assets.
        - *ref* reference date.
        - *ret* target return.
        - *risk* portfolio risk.
        - *perf* portfolio performance at reference date.
        - *constraints*

            - *lowBounds* vector containing low constraints.
            - *highBounds* vector containing high constraints.

crm.getHighProfileRiskPortfolios(limit, callback)
--------------------------------

It retrieves the portfolios with high profile risk.

For arguments and response callback see getLastCreatedPortofolios method.

crm.getLowProfileRiskPortfolios(limit, callback)
-------------------------------

It retrieves the portfolios with low profile risk.

For arguments and response callback see getLastCreatedPortofolios method.

crm.getHighProfileReturnPortfolios(limit, callback)
----------------------------------

It retrieves the portfolios with high profile return.

For arguments and response callback see getLastCreatedPortofolios method.

crm.getLowProfileReturnPortfolios(limit, callback)
------------------------------------------

It retrieves the portfolios with low profile return.

For arguments and response callback see getLastCreatedPortofolios method.

crm.getBestPerformingPortfolios(limit, callback)
-------------------------------

It retrieves the portfolios with the best performance.

For arguments and response callback see getLastCreatedPortofolios method.

crm.getWorstPerformingPortfolios(limit, callback)
--------------------------------

It retrieves the portfolios with the worst performance.

For arguments and response callback see getLastCreatedPortofolios method.

