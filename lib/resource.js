
var MD5 = require("./md5");

/*
// TODO: Always do this via require("pinf/loader");
// if in browser
var BRAVOJS = (typeof bravojs !== "undefined")?bravojs:false;
// if not in browser
if (require.platform !== "browser") {
    BRAVOJS = require("pinf" + "/loader").getSandbox().loader.bravojs;
}
*/


exports.forPackage = function(module, options)
{
    return new Resource(module, "package", options);
}

exports.forModule = function(module, options)
{
    return new Resource(module, "module", options);
}

var Resource = function(owner, scope, options)
{
    this.module = false;
    this.pkgHashId = false;
    this.scope = scope;
    this.ns = false;
    this.options = options || {};

    if (typeof owner === "object")
    {
    	// TODO: Ensure `owner` is a module object
        this.module = owner;
        this.pkgHashId = MD5.hash_md5(this.module.pkgId);
    } else
    if (typeof owner === "string" && scope === "package")
    {
    	this.pkgHashId = MD5.hash_md5(owner);
    }

    if (this.scope === "package") {
    	this.ns = "__" + this.pkgHashId + "__";
    } else
    if (this.scope === "module") {
    	if (!this.module)
    		throw new Error("`this.module` not set! You must initialize resource module with module object!");
    	this.ns = "__" + this.module.hashId + "__";
    } else
    	throw new Error("Invalid scope: " + scope);
}

Resource.prototype.getNS = function()
{
    return this.ns;
}

Resource.prototype.getId = function(id)
{
    return this.getNS() + id;
}

Resource.prototype.getCSSClass = function(name)
{
    return this.getNS() + name;
}

Resource.prototype.replaceVariables = function(str)
{
    str = str.replace(/__NS__/g, this.getNS());
    str = str.replace(/__RESOURCE__/g, this.getResourceBaseUrl());
    return str;
}

Resource.prototype.importCssString = function(css)
{
    importCssString(this.replaceVariables(css));
}

Resource.prototype.getProgramBaseUrl = function()
{
    if (this.options.programBaseUrl) {
        return this.options.programBaseUrl;
    } else {
        throw new Error("Use something other than BRAVOJS.url");
        //return BRAVOJS.url.replace(/\.js$/, "/");
    }
}

Resource.prototype.getResourceBaseUrl = function()
{
    return this.getProgramBaseUrl() + this.pkgHashId + "@/resources/";
}

Resource.prototype.getResourceUrl = function(path)
{
    return this.getResourceBaseUrl() + path;
}




// @see https://github.com/ajaxorg/pilot/blob/1442bd4d574686c5b300daeaaf8fbd0b73c77e21/lib/pilot/dom.js#L135
function importCssString(cssText, doc) {
    doc = doc || document;

    if (doc.createStyleSheet) {
        var sheet = doc.createStyleSheet();
        sheet.cssText = cssText;
    }
    else {
        var style = doc.createElement("style");

        style.appendChild(doc.createTextNode(cssText));

        var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
        head.appendChild(style);
    }
}
