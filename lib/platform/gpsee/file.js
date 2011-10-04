
var FS_BASE = require("gpsee/fs-base");


exports.exists = function(filename)
{
	return FS_BASE.exists(filename);
}

exports.readdir = function(filename)
{
	return FS_BASE.list(filename);
}
