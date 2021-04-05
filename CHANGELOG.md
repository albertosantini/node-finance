5.0.0 / 2021-04-05
==================

* Remove CRM apis because they were used only in ConPA project.

4.4.4 / 2019-09-22
==================

* Fix risk free asset due to change in Yahoo legacy.

4.4.3 / 2018-07-04
==================

* Fix again data rows check in most used assets call.

4.4.2 / 2018-07-01
==================

* Use created_at date in queryByDate.

4.4.1 / 2018-06-28
==================

* Fix queryByDate doc in README.

4.4.0 / 2018-06-28
==================

* Use query views for other portfolios.

4.3.0 / 2018-06-27
==================

* Improve alignment of historical series for debugging between R and js.
* Handle null for target return in the optimization call.

4.2.4 / 2018-06-26
==================

* Fix check null values.
* Add missing values tests.
* Update eslint 5.x.

4.2.3 / 2018-06-22
==================

* Check missing values in quotes.

4.2.2 / 2018-06-21
==================

* Fix Not Found tests.

4.2.1 / 2018-06-21
==================

* Propagate symbol for error handling in quotes.

4.2.0 / 2018-06-20
==================

* Use Promise.all to get quotes.
* Improve error handling and review the tests.

4.1.3 / 2018-06-15
==================

* Fix callback error in getView.
* Refactor putPortfolioOnCRM.
* Add first crm test.

4.1.2 / 2018-06-10
==================

* Check error for returns call.
* Check properly stats data.

4.1.1 / 2018-06-10
==================

* Check properly most used assets data.

4.1.0 / 2018-05-13
==================

* Add basic authorization to request util for crm calls.

4.0.0 / 2018-05-12
==================

* Refactor the code in ES2015 fashion.
* Remove request dep using custom http util client.
* Update deps.

3.3.1 / 2017-12-09
==================

* Fix crm portfolio created_at date.

3.3.0 / 2017-10-11
==================

* Fix Yahoo get quotes and tests.
* Change linting configuration.
* Update deps.

3.2.0 / 2017-07-01
==================

* Add shorts boolean to calc short portfolios in getOptimalPortfolio api.
* Replace Yahoo symbol with Google one in the examples and in the tests due to
the problems with historical series.
* Add portfolio R script in the examples.
* Update deps.

3.1.0 / 2017-05-26
==================

* Use Finance Yahoo "query" to get quotes history.
* Update deps.

3.0.0 / 2017-01-15
==================

* Use Finance Yahoo "query" to get key statistics, option chain.
* Update deps.

2.5.0 / 2016-07-25
==================

* Fix for Yahoo Finance new layout using a localized page.
* Update deps.

2.4.7 / 2016-05-17
==================

* Check data in getMostUsedAssets.

2.4.6 / 2016-05-16
==================

* Fix put portfolio to PouchDB instance.
* Update deps.

2.4.5 / 2016-04-09
==================

* Refactor tests with tape.
* Use npm scripts.
* Update deps.

2.4.4 / 2015-12-20
==================

* Revert format date in R script.

2.4.3 / 2015-12-20
==================

* Fix reference date format in R script.

2.4.2 / 2015-12-13
==================

* Fix handling error in nativeGetOptimalPortfolio.

2.4.1 / 2015-12-13
==================

* Improve error handling and target return check.

2.4.0 / 2015-12-10
==================

* Update quadprog 1.4.0.
* Update deps.

2.3.2 / 2015-11-26
==================

* Fix rserveGetOptimalPortfolio due to update to rio 2.x.
* Fix portfolio test.
* Update TravisCI to container-based infrastructure.
* Update deps.

2.3.1 / 2015-04-23
==================

* Update Travis CI to node and iojs.
* Update grunt-eslint 11.0.0, request 2.55.0, quadprog 1.3.0, rio 1.4.0.
* Use grunt to automate linting and testing.

2.3.0 / 2014-11-19
==================

* Fix eslint errors.
* Fix option methods due to YAHOO changes.
* Update cheerio 0.18.0, request 2.48.0, vows 0.8.0, rio 1.3.1.

2.2.0 / 2014-06-07
==================

* Update quadprog 1.1.0.

2.1.1 / 2014-05-23
==================

* optionchain.getOptionChainFromYahoo: allow setting expiration date (@theosp).
* Updated dependencies.

2.0.1 / 2014-04-16
==================

* Updated dependencies.

2.0.0 / 2013-08-24
==================

* Removed jQuery dependency: replaced with cheerio.
* Refactored apis, adding error parameter to the callbacks.
* Added Travis tests.
* Added npm and dependencies badges.

1.3.1 / 2012-11-27
==================

* Updated module dependencies.

1.3.0 / 2012-07-28
==================

* Added getPortfolio by id.

1.2.13 / 2012-07-15
===================

* Removed jsdom dependency and updated modules.

1.2.12 / 2012-04-03
===================

* Fixed html scraping for option figures.

1.2.11 / 2011-11-20
===================

* Updated node-rio 0.6.0.

1.2.10 / 2011-11-17
===================

* Updated rio 0.5.6.

1.2.9 / 2011-11-17
==================

* Updated rio 0.5.5.

1.2.8 / 2011-11-17
==================

* Updated rio 0.5.3.

1.2.7 / 2011-11-15
==================

* Fixed again performance calc in Portfolio.R.
* Updated rio 0.5.2.

1.2.6 / 2011-11-14
==================

* Added debug flag in rserve configuration,
* Fixed if there are not prices after the reference date; it happens when the
start and the end date are too close.

1.2.5 / 2011-11-13
==================

* Fixed performance calc when reference date is today.

1.2.4 / 2011-10-02
==================

* Added portfolio.getScriptOptimalPortfolio.

1.2.3 / 2011-10-01
==================

* Added defaultDocumentFeatures to the jsdom in quotes methods.
* Fixed quotes methods signature in the doc.
* Added options example.

1.2.2 / 2011-09-29
==================

* Added node-conpa reference in the doc.

1.2.1 / 2011-09-28
==================

* Fixed crm configuration details in the doc.

1.2.0 / 2011-09-25
==================

* Added rserveGetOptimalPortfolio.

1.1.0 / 2011-09-24
==================

* Removed the references to cloudant db.

1.0.0 / 2011-09-19
==================

* Initial release.
