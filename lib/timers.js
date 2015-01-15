
var ENGINE = require("./platform/node/timers");
//var ENGINE = require("./platform/{platform}/timers");

// @see http://nodejs.org/docs/v0.4.11/api/timers.html

exports.setTimeout = null;  // function(callback, delay, arg1, arg2) {}
exports.clearTimeout = null;  // function(timeoutId) {}
exports.setInterval = null;  // function(callback, delay, arg1, arg2) {}
exports.clearInterval = null;  // function(intervalId) {};

for (var name in ENGINE)
    exports[name] = ENGINE[name];
