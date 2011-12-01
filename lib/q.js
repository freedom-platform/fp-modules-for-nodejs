
var Q = require("q/q");

for (var key in Q)
    exports[key] = Q[key];


exports.when = function(value, fulfilled, rejected)
{
	if (typeof rejected === "object" &&
		Q.isPromise(rejected.promise))
	{
		var promise = Q.when(value, fulfilled, rejected.reject);

		promise.then(void 0, function(e)
		{
			rejected.reject(e);
		});

		return promise;
	}
	return Q.when(value, fulfilled, rejected);
}
