
// process = nodejs global

/*
exports.stdout

exports.stderr

exports.env

exports.args
*/

var EXEC = require("nodejs/child_process").exec,
    LOADER = require("pinf/loader");


exports.print = LOADER.getAPI().SYSTEM.print;

exports.pwd = process.cwd();

exports.exec = function(command, options, callback)
{
	if (typeof options === "function")
	{
		callback = options;
		options = {};
	}

	EXEC(command, options, function(error, stdout, stderr)
	{
        if (typeof callback != "undefined")
            callback(stdout, stderr, error);
    });
}
