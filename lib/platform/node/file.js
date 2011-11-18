
var FS = require("nodejs/fs");


exports.exists = function(filename)
{
    // Oh boy. nodejs throws if file does not exist
    try {
        FS.statSync(filename);
        return true;
    } catch(e) {
        return false;
    }
}

exports.isFile = function(filename)
{
    // Oh boy. nodejs throws if file does not exist
    try {
        return FS.statSync(filename).isFile();
    } catch(e) {
        return false;
    }
}

exports.isDirectory = function(filename)
{
    // Oh boy. nodejs throws if file does not exist
    try {
        return FS.statSync(filename).isDirectory();
    } catch(e) {
        return false;
    }
}

exports.mkdirs = function(filename, mode)
{
    if (typeof mode === "undefined")
        mode = 0775;

    // Oh boy. This is inefficient but should work for now.
    filename = filename.split("/");
    var parts = [];
    
    while (!exports.exists(filename.join("/")))
    {
        parts.push(filename.pop());
    }
    
    if (parts.length==0)
        return;
    
    while (parts.length > 0)
    {
        filename.push(parts.pop());
        FS.mkdirSync(filename.join("/"), mode);
    }
}

exports.remove = function(filename)
{
    return FS.unlinkSync(filename);
}

exports.read = function(filename, encoding)
{
    encoding = encoding || "utf-8";
    return FS.readFileSync(filename, encoding);
}

exports.write = function(filename, data, encoding)
{
    encoding = encoding || "utf-8";
    return FS.writeFileSync(filename, data, encoding);
}

exports.append = function(filename, data)
{
    var fd = FS.openSync(filename, "a");
    FS.writeSync(fd, data, null);
    FS.closeSync(fd);
}

exports.readdir = function(filename)
{
    return FS.readdirSync(filename);
}

exports.rename = function(from, to)
{
    return FS.renameSync(from, to);
}

exports.mtime = function(filename)
{
    // Oh boy. nodejs throws if file does not exist
    try {
        return FS.statSync(filename).mtime;
    } catch(e) {
        return false;
    }    
}

exports.size = function(filename)
{
    // Oh boy. nodejs throws if file does not exist
    try {
        return FS.statSync(filename).size;
    } catch(e) {
        return false;
    }    
}

exports.watchFile = function(filename, listener)
{
	FS.watchFile(filename, listener);
}

exports.unwatchFile = function(filename)
{
	FS.unwatchFile(filename);
}

exports.symlink = function(filename, target)
{
	FS.symlinkSync(filename, target);
}
