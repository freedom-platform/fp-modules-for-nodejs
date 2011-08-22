
var {Cc, Ci} = require("jetpack/chrome");

exports.request = function(options, successCallback, errorCallback)
{
    try {
        var request = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Ci.nsIXMLHttpRequest);
        request.onreadystatechange = function (event) {
            if (request.readyState == 4) {
                var headers = {},
                    lines = request.getAllResponseHeaders().split("\n");
                for (var i=0,ic=lines.length ; i<ic ; i++ )
                {
                    if (lines[i])
                    {
                        var m = lines[i].match(/^([^:]*):\s*(.*)$/);
                        headers[m[1]] = m[2];
                    }
                }

                successCallback({
                    status: request.status,
                    headers: headers,
                    data: request.responseText
                });
            }
        };
        request.open(options.method, options.url, true);

        for (var name in options.headers)
        {
            if (name.toLowerCase() != "host")
            {
                request.setRequestHeader(name, options.headers[name]);
            }
        }

        request.send(options.data);

    } catch(e) {
        console.warn(e);
        errorCallback(e);
    }
}
