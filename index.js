var util = require('util');
var path = require('path');
var fs = require('fs');

var MSG_SUCCESS = 'PASSED - %d tests passed in %s';
var MSG_FAILURE = 'FAILED - %d/%d tests failed in %s';
var MSG_ERROR = 'ERROR - %s';

var SingleLineReporter = function(helper, logger, config) {
  var log = logger.create('reporter.singleLine');

  this.adapters = [];

  this.onBrowserComplete = function(browser) {
    var results = browser.lastResult;
    var time = helper.formatTimeInterval(results.totalTime);
    var message;

    if (results.disconnected || results.error) {
      message = util.format(MSG_ERROR, browser.name);
    } else if (results.failed) {
      message = util.format(MSG_FAILURE, results.failed, results.total, time);
    } else {
      message = util.format(MSG_SUCCESS, results.success, time);
    }

    writeToFile(filename(config), message);
  };

  function writeToFile(filename, message) {
    fs.writeFile(filename, message, function (err) {
      onFileWriteComplete(err, filename);
    });
  }

  function onFileWriteComplete(err, filename) {
    if (err) {
      log.error('failed to write report to ' + filename +
                'because: ' + JSON.stringify(err));
    } else {
      log.trace('file written to ' + filename);
    }
  }

  function filename(config) {
    config = config || {};

    var dir = config.dir || '.';
    var file = config.file || 'tests.txt';
    return dir + '/' + file;
  }
};

SingleLineReporter.$inject = ['helper', 'logger', 'config.singleLineReporter'];

// PUBLISH DI MODULE
module.exports = {
  'reporter:singleLine': ['type', SingleLineReporter]
};
