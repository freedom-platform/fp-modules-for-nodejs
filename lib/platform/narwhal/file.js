
var FILE = require("narwhal/file");


exports.exists = function(filename)
{
    return FILE.exists(filename);
}

exports.readdir = function(filename)
{
    return FILE.list(filename);
}

