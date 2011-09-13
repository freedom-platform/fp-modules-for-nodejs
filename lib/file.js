
var ENGINE = require("./platform/{platform}/file");

exports.exists = function(filename)
{
    throw new Error("NYI - exists - in " + module.id);
}
exports.isFile = function(filename)
{
    throw new Error("NYI - isFile - in " + module.id);
}
exports.mkdirs = function(filename, mode)
{
    throw new Error("NYI - mkdirs - in " + module.id);
}
exports.remove = function(filename)
{
    throw new Error("NYI - remove - in " + module.id);
}
exports.read = function(filename, encoding)
{
    throw new Error("NYI - read - in " + module.id);
}
exports.append = function(filename, data)
{
    throw new Error("NYI - append - in " + module.id);
}
exports.write = function(filename, data, encoding)
{
    throw new Error("NYI - write - in " + module.id);
}
exports.readdir = function(filename)
{
    throw new Error("NYI - readdir - in " + module.id);
}
exports.rename = function(from, to)
{
    throw new Error("NYI - rename - in " + module.id);
}
exports.mtime = function(filename)
{
    throw new Error("NYI - mtime - in " + module.id);
}
// listener = function (curr, prev) {}
exports.watchFile = function(filename, listener)
{
    throw new Error("NYI - watchFile - in " + module.id);
}
exports.unwatchFile = function(filename)
{
    throw new Error("NYI - unwatchFile - in " + module.id);
}

exports.isAbsolute = function(path)
{
    if (path.charAt(0) == "/")
        return true;
    return false;
}

/**
 * Extract the non-directory portion of a path
 * 
 * @source http://code.google.com/p/bravojs/source/browse/bravo.js
 */
exports.basename = function(path)
{
  if (typeof path !== "string")
    path = path.toString();

  var s = path.split('/').slice(-1).join('/');
  if (!s)
    return path;
  return s;
}

/**
 * Extract the directory portion of a path.
 * 
 * @source http://code.google.com/p/bravojs/source/browse/bravo.js
 */
exports.dirname = function(path)
{
  if (typeof path !== "string")
    path = path.toString();

  if (path.charAt(path.length - 1) === '/')
    return path.slice(0,-1);

  var s = path.split('/').slice(0,-1).join('/');
  if (!s)
    return ".";

  /* If path ends in "/@/xxx.js" then s will end in /@ which needs to be fixed */
  if (s.charAt(s.length-1)=="@")
    s += "/";

  return s;
};

/**
 * Canonicalize path, compacting slashes and dots per basic UNIX rules.
 * 
 * @source http://code.google.com/p/bravojs/source/browse/bravo.js
 */
exports.realpath = function(path)
{
    if (typeof path !== "string") path = path.toString();

    var oldPath = path.split('/');
    var newPath = [];
    var i;

    for (i = 0; i < oldPath.length; i++)
    {
        if (oldPath[i] == '.' || !oldPath[i].length)
            continue;
        if (oldPath[i] == '..')
        {
            if (!newPath.length)
                throw new Error("Invalid module path: " + path);
            newPath.pop();
            continue;
        }
        newPath.push(oldPath[i]);
    }

    newPath.unshift('');
    return newPath.join('/');
}

for (var name in ENGINE)
    exports[name] = ENGINE[name];
