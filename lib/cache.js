
var FILE = require("./file"),
	JSON = require("./json");

var caches = {};

exports.forBasePath = function(basePath)
{
	if (!caches[basePath])
		caches[basePath] = new Cache(basePath);
	return caches[basePath];
}

var Cache = function(basePath)
{
	this.basePath = basePath;
}

Cache.prototype.pathForKey = function(key)
{
	return this.basePath + "/" + key;
}

Cache.prototype.has = function(key)
{
	return FILE.exists(this.pathForKey(key));
}

Cache.prototype.remove = function(key)
{
	var path = this.pathForKey(key);
	if (!FILE.exists(path))
		return;
	FILE.remove(path);
}

Cache.prototype.get = function(key, type)
{
	var path = this.pathForKey(key);

	if (!FILE.exists(path))
		throw new Error("Key '" + key + "' does not exist in cache at: " + path);
	
	if (type === "json")
	{
		try {
			return JSON.decode(FILE.read(path));
		} catch(e) {
			throw new Error("Error '" + e + "' parsing JSON file: " + path);
		}
	}
	else
	{
		return FILE.read(path);
	}
}

Cache.prototype.set = function(key, value, type)
{
	var path = this.pathForKey(key);

	if (!FILE.exists(FILE.dirname(path)))
		FILE.mkdirs(FILE.dirname(path), 0775);
	
	if (type === "json")
	{
		FILE.write(path, JSON.encode(value));
	}
	else
	{
		FILE.write(path, value);
	}
}
