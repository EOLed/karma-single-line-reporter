var util = require('util');
var path = require('path');

var MSG_SUCCESS = 'PASSED - %d tests passed in %s';
var MSG_FAILURE = 'FAILED - %d/%d tests failed in %s';
var MSG_ERROR = 'ERROR - %s';

var SingleLineReporter = function(helper, logger, config) {
  var log = logger.create('reporter.singleLine');

  this.adapters = [];

  this.onBrowserComplete = function(browser) {
    var results = browser.lastResult;
    var time = helper.formatTimeInterval(results.totalTime);

    if (results.disconnected || results.error) {
      log.debug(util.format(MSG_ERROR, browser.name));
      return;
    }

    if (results.failed) {
      log.debug(util.format(MSG_FAILURE, results.failed, results.total, time));
      return;
    }

    log.debug(util.format(MSG_SUCCESS, results.success, time));
  };
};

SingleLineReporter.$inject = ['helper', 'logger', 'config.singleLineReporter'];

// PUBLISH DI MODULE
module.exports = {
  'reporter:singleLine': ['type', SingleLineReporter]
};
