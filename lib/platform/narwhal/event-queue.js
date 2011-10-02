
var EVENT_LOOP = require("narwhal/event-loop");

exports.setTimeout = EVENT_LOOP.setTimeout;
exports.setInterval = EVENT_LOOP.setInterval;
exports.clearTimeout = EVENT_LOOP.clearTimeout;
exports.clearInterval = EVENT_LOOP.clearTimeout;
exports.enqueue = EVENT_LOOP.enqueue;
