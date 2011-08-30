
/*
 * @see http://semver.org/
 * 
 * This lib builds on semver to support:
 * 
 *   - Versions without a patch part
 *   - Split sorting for suffixes: `alpha1`, `alpha1rc1`
 *   
 */

var UTIL = require("./util");

/**
 * Determine the kind of version selector we have
 */
exports.parse = function(revision)
{
	var info = {
		revision: revision
	};

	// v?x.x*
	var m = revision.match(/^(v?)((\d*)(\.(\d*)(\.(\d*)(([A-Za-z-]*)(\d*)?)?)?)?)$/);
	if (m && m[4])
	{
		if (m[1]) info.prefix = m[1];
		info.version = m[2];
	} else
	if (revision.length === 40)
	{
		// GIT ref
		// TODO: Check characters to ensure we don't have a 40 character branch name
		info.commit = revision;
	} else
	if (m)
	{
		if (m[1]) info.prefix = m[1];
		info.version = m[2];
		info.stream = true;
	} else {
		info.branch = revision;
		info.stream = true;
	}
	return info;
}


exports.validate = function(version, options) {
	if(typeof version === "undefined" || version === null || version === false || typeof version != "string") return false;
    if(!/^v?(\d+)\.(\d+)(([A-Za-z-]+)(\d+)){0,2}$/.test(version) &&
       !/^v?(\d+)\.(\d+)\.(\d+)(([A-Za-z-]+)(\d+)){0,2}$/.test(version)) return false;
    if(!options) return true;
    if(options.numericOnly) {
        if(!/^v?[\d\.]*$/.test(version)) return false;
    }
    if(options.withSuffix) {
        if(/^v?(\d*)\.(\d*)$/.test(version) ||
    	   /^v?(\d*)\.(\d*)\.(\d*)$/.test(version)) return false;
    }
    return true;
}

// @see http://www.php.net/manual/en/function.version-compare.php
exports.compare = function(a, b) {
	return compareVersion(a, b);
}

// NOTE: We also sort the alphanumeric string by detaching the numeric suffix if applicable
exports.sort = function(versions) {
    versions.sort(function(a, b) {
    	return compareVersion(a, b);
    });
    return versions;
}

function compareVersion(aO, bO)
{
	var cmp;

    var a = aO.replace(/^v/, "").split(".");
    var b = bO.replace(/^v/, "").split(".");
            
    a[0] = parseInt(a[0]);
    b[0] = parseInt(b[0]);
    
    if(a[0]>b[0]) return 1;
    if(a[0]<b[0]) return -1;

	if ((cmp = comparePart(a[1], b[1])) !== 0) return cmp;
    
    if(a.length === 2 && b.length === 3 && b[2] == 0) return 0;
    if(b.length === 2 && a.length === 3 && a[2] == 0) return 0;
    
    if(a.length === 2 && b.length === 3) return 1;
    if(b.length === 2 && a.length === 3) return -1;
    
    if ((cmp = comparePart(a[2], b[2])) !== 0) return cmp;
    
    return 0;
}

function comparePart(aO, bO)
{
	if (!aO && !aO) return 0;

    var a = aO.match(/^(\d+)(([A-Za-z-]+)(\d+))?(([A-Za-z-]+)(\d+))?$/);
    if(!a) {
        throw new Error("Invalid version: " + aO);
    }

    var b = bO.match(/^(\d+)(([A-Za-z-]+)(\d+))?(([A-Za-z-]+)(\d+))?$/);
    if(!b) {
        throw new Error("Invalid version: " + bO);
    }
    /*
    Example: 
		[ 
		0  '1beta1rc100',
		1  '1',
		2  'beta1',
		3  'beta',
		4  '1',
		5  'rc100',
		6  'rc',
		7  '100'
	    ]
    */

    a[1] = parseInt(a[1]);
    b[1] = parseInt(b[1]);
    
    if(a[1]>b[1]) return 1;
    if(a[1]<b[1]) return -1;

    if(!a[2] && !b[2]) return 0;    
    if(!a[2] && b[2]) return 1;
    if(a[2] && !b[2]) return -1;
    
    if(a[3]>b[3]) return 1;
    if(a[3]<b[3]) return -1;

    a[4] = parseInt(a[4]);
    b[4] = parseInt(b[4]);

    if(a[4]>b[4]) return 1;
    if(a[4]<b[4]) return -1;

    if(!a[5] && !b[5]) return 0;
    if(!a[5] && b[5]) return 1;
    if(a[5] && !b[5]) return -1;
    
    if(a[6]>b[6]) return 1;
    if(a[6]<b[6]) return -1;

    a[7] = parseInt(a[7]);
    b[7] = parseInt(b[7]);

    if(a[7]>b[7]) return 1;
    if(a[7]<b[7]) return -1;
	
    return 0;
}


exports.latestForMajor = function(versions, version) {
    if(!versions || versions.length==0) {
        return false;
    }
    if (typeof version === "string")
    	version = version.replace(/^v/, "");
    versions = exports.sort(versions);
    if(!version) {
        return versions.pop();
    }
    var majorVersion = version.split(".")[0],
        numeric = exports.validate(version, {"numericOnly":true}),
        m;
    versions = versions.filter(function(version) {
        version = version.replace(/^v/, "");
        if(version.split(".")[0] != majorVersion) {
            return false;
        }
        m = version.match(/^v?([\d\.]*)(\D*)?(\d*)?$/);
        if(!numeric) {
        	// ensure tag is not numeric
        	// TODO: Not sure if this is entirely correct. Need more tests.
            if(!m[2]) return false;
        } else {
        	// ensure tag is numeric only. i.e. x.x.x NOT x.xBETAx
            if(m[2]) return false;
        }
        return true;
    });
    if(!versions || versions.length==0) return false;
    return versions.pop();
}

exports.latestForEachMajor = function(versions, includeAlphanumeric) {
    if(!versions || versions.length==0) {
        return false;
    }
    versions = exports.sort(versions);

    versions.reverse();
    var found = {},
        major,
        numeric,
        m;
    versions = versions.filter(function(version) {
        if (typeof version === "string")
        	version = version.replace(/^v/, "");
        numeric = exports.validate(version, {"numericOnly":true});
        if(!(includeAlphanumeric || numeric))
            return false;
        major = version.split(".")[0];
        if(includeAlphanumeric && !numeric) {
            m = version.match(/^v?(\d*)(\.\d*\.\d*)(\D*)(\d*)?$/);
            major = m[1] + "A";
            if(found[m[1]]) return false;
        }
        if(found[major]) return false;
        found[major] = true;
        return true;
    });
    versions.reverse();
    return versions;
}

exports.getMajor = function(version, includeAlphanumeric) {
    if(!version) return false;
    if(!includeAlphanumeric) return version.split(".").shift().replace(/^v/, "");

    var m = version.match(/^v?((\d+)\.\d+(\.\d+)?)$/);
    if (m) return m[2];
    
    var m = version.match(/^v?(\d+)\.(\d+)([A-Za-z-\d]*)(.(\d+)([A-Za-z-\d]*))?$/);
    if (!m)
    	throw new Error("Invalid version: " + version);
    	
    if (m[6]) {
    	return m[1] + "." + m[2] + m[3] + "." + m[5] + m[6].replace(/\d+$/, "");
    } else {
    	return m[1] + "." + m[2] + m[3].replace(/\d+$/, "");
    }
}


exports.versionsForTags = function(tags, path) {
    if(!tags) return false;
    var versions = UTIL.map(tags, function(tag) {
        if(path) {
            if(tag.length < (path.length+1)) return false;
            tag = tag.substr(path.length+1);
        }
        if(/^v?(\d+)\.(\d+)(([A-Za-z-]+)(\d+)){0,2}(\.(\d+)(([A-Za-z-]+)(\d+)){0,2})?$/.test(tag)) {
            // remove "v" prefix to get valid version string
            return tag.substr(1);
        }
        return false;
    });
    versions = versions.filter(function(version) {
        return !!version;
    });
    if(!versions) return false;
    versions = exports.sort(versions);    
    return versions;
}

