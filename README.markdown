FINANCE
=======

This module contains an implementation of Markowitz algorithm for the portfolio
optimization, a routine for retrieving historical prices from Yahoo,
statistical information for stocks and a routine for calculating options
smile using Black and Scholes formula.

Example
========

See examples directory.

Installation
============

To install with [npm](http://github.com/isaacs/npm):

    npm install finance

Tested with node 0.4.12 and tested results with R 2.13.1.

Notes
=====

- Before using crm methods, you need to configure the details of the persistence
system. The portfolios are saved on a CouchDB instance. The configuration
allows a live and testing system.

    finance.crm.configure({
        liveDomain: "x.x.x",
        keylive: "user:password",
        dbLive: "myLiveDBName",
        keyTesting: "user:password",
        dbTesting: "myTestingDBName",
    });

- If you use crm module, in lib/couchdb there is the file containing the code 
for the views to inject to CouchDB instance.

Methods
=======

portfolio.getOptimalPortfolio(params, callback)
-----------------------------

It creates an optimal portfolio.

**Params**

- *prods* vector of symbols.

- *referenceDate*

- *targetReturn* if undefined, the mean of returns will be the default

- *lows* constraints

- *highs* constraints

**Callback response**

- *perf* performances vector.

- *message* error message, empty is ok.

- *optim* details of quadprog response.

    - *solution* vector of weights.

    - *value* the value of the quadratic function at the solution.

    - *unconstrained_solution* vector of the unconstrained minimizer.

    - *iterations* the number of iterations the algorithm needed.

    - *iact* vector with the indices of the active constraints at the solution.

    - *message* error message, empty is ok.

    - *pm* return

    - *ps* risk


portfolio.getQuotesFromYahoo(symbol, refDate, callback)
----------------------------

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


portfolio.getReturns(symbols, refDate, callback)
--------------------

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

portfolio.getKeyStatistics(params, callback)
--------------------------

It retrieves the key statistics for the stocks and returns an array of objects
to create an uneditable form on front-end side.

**Params**

- *symbol* asset symbol.

**Callback response**

- *stats* array of statistics objects

    - *type* set to 'uneditable'.

    - *inputParams*

        - *label* the label of the field.

        - *value* the value of the field.

portfolio.getOptionChainFromYahoo(symbol, callback)
---------------------------------

It retrieves the strike values for calls and puts from Yahoo! Finance.

**Arguments**

- *symbol* asset symbol.

**Callback response**

- *optionChain*

    - *strike* strike value of the asset.

    - *expDateStr* expire date (string).

    - *expDate* expire date (Date).

    - *now* Date.

    - *calls* vector of call values.

    - *puts* vector of put values.


portfolio.getRiskFreeRateFromYahoo(callback)
----------------------------------

It retrieves the risk free rate from Yahoo! Finance.

**Callback response**

    - *riskfree* risk free rate.


performances.getPerformances(x, weights)
----------------------------

It calculates the weighted performance for a matrix.

**Arguments**

- *x* matrix containing the values (i.e. the asset returns).

- *weights* the weights

*Returns* a vector containing the weighted perfomance of the matrix.


volatility.getImpliedVolatility(params, callback)
--------------------

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

It configure CRM database instance (i.e. a CouchDB instance).
The user can configure a testing and live instance.

**Params**
    - *liveDomain* url for the live domain.

    - *keylive* "user:password" string, credentials for live instance.

    - *dbLive* name of live instance.

    - *keyTesting* "user:password" string, credentials for testing instance.

    - *dbTesting* name of testing instance.

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



crm.getLastCreatedPortfolios(limit, callback) {
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


crm.getHighProfileRiskPortfolios(limit, callback) {
--------------------------------

It retrieves the portfolios with high profile risk.

For arguments and response callback see getLastCreatedPortofolios method.

crm.getLowProfileRiskPortfolios(limit, callback) {
-------------------------------

It retrieves the portfolios with low profile risk.

For arguments and response callback see getLastCreatedPortofolios method.

crm.getHighProfileReturnPortfolios(limit, callback) {
----------------------------------

It retrieves the portfolios with high profile return.

For arguments and response callback see getLastCreatedPortofolios method.

crm.getLowProfileReturnPortfolios(limit, callback) {
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

