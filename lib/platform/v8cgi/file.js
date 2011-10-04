
var FS = require("v8cgi/fs");


exports.exists = function(filename)
{
    return new FS.File(filename).exists();
}

exports.readdir = function(filename)
{
    return new FS.Directory(filename).listFiles();
}
