
var ENGINE = require("./platform/{platform}/os");

//exports.exit

for (var name in ENGINE)
    exports[name] = ENGINE[name];
