
var HTTP = require("nodejs/http"),
	HTTPS = require("nodejs/https");

exports.request = function(options, successCallback, errorCallback)
{
    delete options.url;

	var CLIENT = HTTP;
	if (options.port === 443)
	{
		CLIENT = HTTPS;
	}
	
    var req = CLIENT.request(options, function(res)
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
    
    req.on('error', errorCallback);
    
    if (typeof options.data !== "undefined")
        req.write(options.data);

    req.end();
}
