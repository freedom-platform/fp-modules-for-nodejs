
var ENGINE = require("./platform/node/engine");
//var ENGINE = require("./platform/{platform}/engine");

//exports.os

for (var name in ENGINE)
    exports[name] = ENGINE[name];
