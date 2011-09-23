
var LOADER = require("pinf/loader"),
	REQUIRE = LOADER.getAPI().ENV.platformRequire,
	SYSTEM = REQUIRE("system"),
	FS_BASE = REQUIRE("fs-base");


exports.print = SYSTEM.stdout.write;

exports.pwd = FS_BASE.workingDirectory();

exports.env = SYSTEM.env;

exports.exec = "NYI";

exports.exec2 = "NYI";
