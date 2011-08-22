
var ENGINE = require("./platform/{platform}/http-client");
var URI = require("./uri");

/**
 * @param options object
 *   host: 'www.google.com'
 *   port: 80
 *   path: '/upload'
 *   method: 'POST'
 *   headers: {}
 *   data: request (post) data
 *   responseEncoding: 'utf8'
 */
exports.request = function(options, successCallback, errorCallback)
{
    if (typeof options.url !== "undefined")
    {
        if (typeof options.host !== "undefined")
            throw new Error("Cannot set 'host' when 'url' is set!");
        if (typeof options.path !== "undefined")
            throw new Error("Cannot set 'path' when 'url' is set!");
        if (typeof options.port !== "undefined")
            throw new Error("Cannot set 'port' when 'url' is set!");

        var uri = URI.URI(options.url);
        
        options.host = uri.authority;
        options.port = uri.port || 80;
        options.path = uri.path;
    }
    options.method = options.method || "GET";
    options.port = options.port || 80;
    options.path = options.path || "/";
    options.url = options.url || ("http://" + options.host + ":" + options.port + options.path);
    options.headers = options.headers || { host: options.host };

    return ENGINE.request(options, successCallback, errorCallback);
}
