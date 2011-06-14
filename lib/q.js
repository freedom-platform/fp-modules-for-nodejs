
var Q = require("q/q");

for (var key in Q)
    exports[key] = Q[key];
