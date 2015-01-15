
var ENGINE = require("./platform/node/system");
//var ENGINE = require("./platform/{platform}/system");

exports.args = {};
exports.stdout = false;
exports.stderr = false;
exports.env = {};

exports.exec = function(command, callback)
// or exports.exec = function(command, options, callback)
{
    throw new Error("NYI - exec - in " + module.id);
}

exports.exec2 = function(command, args, options)
{
	throw new Error("NYI - exec2 - in " + module.id);
}

/**
 * enquotes a string such that it is guaranteed to be a single
 * argument with no interpolated values for a shell.
 *
 * /!\ WARNING: as yet, this implementation only handles
 * enquoting for Unix shell script style arguments.  Further
 * development is necessary to enquote and escape arguments
 * on Windows.
 */
exports.enquote = function (word) {
    return "'" + String(word).replace(/'/g, "'\"'\"'") + "'";
};

for (var name in ENGINE)
    exports[name] = ENGINE[name];
