
var ENGINE = require("./platform/node/event-queue");
//var ENGINE = require("./platform/{platform}/event-queue");

for (var key in ENGINE)
    exports[key] = ENGINE[key];
