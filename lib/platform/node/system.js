
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

exports.exec = function(command, callback)
{
    EXEC(command, function (error, stdout, stderr) {
        if (typeof callback != "undefined")
            callback(stdout, stderr, error);
    });
}
