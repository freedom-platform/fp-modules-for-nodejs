
var HTTP = require("nodejs/http");

exports.request = function(options, successCallback, errorCallback)
{
    var client = HTTP.createClient(options.port, options.host);
    client.on('error', errorCallback);

    var req = client.request(options.method, options.path, options.headers);
    req.on('response', function(res)
    {
        res.on('error', errorCallback);
        res.setEncoding(options.responseEncoding || "utf8");
        var data = [];
        res.on('data', function(chunk)
        {
            data.push(chunk);
        });
        res.on('end', function()
        {
            successCallback({
                status: res.statusCode,
                headers: res.headers,
                data: data.join("")
            });
        });
    });
    if (typeof options.data !== "undefined")
        req.write(options.data);
    req.end();
}
