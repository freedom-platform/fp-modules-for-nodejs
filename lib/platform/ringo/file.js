
var FS = require("ringo/fs");


exports.exists = function(filename)
{
    return FS.exists(filename);
}

exports.readdir = function(filename)
{
    return FS.list(filename);
}

