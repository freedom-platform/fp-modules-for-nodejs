
exports.setTimeout = function(callback)
{
	callback();
}

exports.enqueue = exports.setTimeout;
