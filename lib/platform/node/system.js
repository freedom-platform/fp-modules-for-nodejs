
// process = nodejs global

/*
exports.stdout

exports.stderr

exports.env

exports.args
*/

var EXEC = require("nodejs/child_process").exec,
	SPAWN = require("nodejs/child_process").spawn,
	LOADER = require("pinf/loader"),
    Q = require("../../q");


exports.print = LOADER.getAPI().SYSTEM.print;

exports.pwd = process.cwd();

exports.env = process.env;

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


exports.exec2 = function(command, args, options)
{
	var result = Q.defer();

	options = options || {};
	
	if (options.verbose)
	{
		module.print("\n\0cyan(" + " Command: " + command + "\0)\n");
		module.print("\0cyan(" + " CWD: " + options.cwd + "\0)\n");
		module.print("\0cyan(" + " Args: " + args.join(" ") + "\0)\n");
	}
	
	var stdout = "",
		stderr = "";

	try {
		var o = {};
		if (options.cwd) {
			o.cwd = options.cwd;
		}
		if (options.env) {
			o.env = options.env;
		}
		var child = SPAWN(command, args, o);
	
		child.stdout.on("data", function(data)
		{
			stdout += data;
			if (options.verbose)
				module.print("" + data);
		});
	
		child.stderr.on("data", function(data)
		{
			stderr += data;
			if (options.verbose)
				module.print("\0red(" + data + "\0)");
		});
	
		child.on("exit", function(code)
		{
			if (code === 0) {
				result.resolve(stdout, stderr);
			} else {
				result.reject(stdout, stderr);
			}
		});
	} catch(e) {
		result.reject(stdout, stderr, e);
	}

	return result.promise;
}
