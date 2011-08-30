
var SEMVER = require("../lib/semver");


exports.run = function(ASSERT, harness)
{
	harness.runAll(exports);
}

exports["test getMajor"] = function(ASSERT)
{
    ASSERT.equal(SEMVER.getMajor("1.0.1"), "1");

    ASSERT.equal(SEMVER.getMajor("v1.0.1"), "1");

    ASSERT.equal(SEMVER.getMajor("v1.0.1", true), "1");

	ASSERT.equal(SEMVER.getMajor("v1.1alpha1", true), "1.1alpha");

	ASSERT.equal(SEMVER.getMajor("v1.1alpha1rc1", true), "1.1alpha1rc");
	
    ASSERT.equal(SEMVER.getMajor("v1.0.1alpha1", true), "1.0.1alpha");

    ASSERT.equal(SEMVER.getMajor("v1.0.1alpha1rc1", true), "1.0.1alpha1rc");
}

exports["test validate"] = function(ASSERT)
{
    [
     	"0.1",
	    "0.1.0",
        "0.1.1alpha1",
        "v1.0.1alpha2",
        "1.0.1alpha2rc1",
        "v1.1alpha2",
        "1.1alpha2rc1"
    ].forEach(function(version) {
        ASSERT.ok(SEMVER.validate(version));
    });

    [
     	"1",
     	"1.",
        "0.a.0",
        "0.1.1alpha",
        "0.1a.1alpha1",
        "0.1a.alpha1",
        "v1.1alpha2.4",
        "v1.1alpha2.4bata2",
    ].forEach(function(version) {
        ASSERT.ok(!SEMVER.validate(version));        
    });

    [
        "v0.1",
        "v0.1.0",
    ].forEach(function(version) {
        ASSERT.ok(SEMVER.validate(version, {"numericOnly":true}));        
    });

    [
        "v0.1.0a1",
        "v0.0a1",
    ].forEach(function(version) {
        ASSERT.ok(!SEMVER.validate(version, {"numericOnly":true}));        
    });

    [
        "0.1.0a1",
        "0.0a1",
    ].forEach(function(version) {
        ASSERT.ok(SEMVER.validate(version, {"withSuffix":true}));        
    });

    [
        "0.1",
        "0.1.0"
    ].forEach(function(version) {
        ASSERT.ok(!SEMVER.validate(version, {"withSuffix":true}));        
    });
}

exports["test compare"] = function(ASSERT)
{
    var result;
        
    result = SEMVER.compare("1.0", "v1.1");
    ASSERT.equal(result, -1);

    result = SEMVER.compare("1.0.0", "v1.1");
    ASSERT.equal(result, -1);
    
    result = SEMVER.compare("v1.0", "1.0");
    ASSERT.equal(result, 0);

    result = SEMVER.compare("v1.0", "1.0.0");
    ASSERT.equal(result, 0);
    
    result = SEMVER.compare("1.1", "1.0");
    ASSERT.equal(result, 1);
}

exports["test sort"] = function(ASSERT)
{
    var versions = [],
        result;

    versions = [
        "v0.2.1beta1rc100",
        "0.2.1beta1rc12",
        "0.1.0",
        "0.1beta1",
        "0.1beta1rc1",
        "0.1.1",
        "1.0.0",
        "1.0.1",
        "1.0.1alpha2",
        "1.0.1alpha1",
        "2.0.0",
        "2.0.0rc1",
        "3.0.0beta15",
        "3.0.0beta2",
        "3.0.0alpha1"
    ];
    result = SEMVER.sort(versions);
    ASSERT.deepEqual(result, [
        "0.1beta1rc1",
        "0.1beta1",
        "0.1.0",
        "0.1.1",
        "0.2.1beta1rc12",
        "v0.2.1beta1rc100",
        "1.0.0",
        "1.0.1alpha1",
        "1.0.1alpha2",
        "1.0.1",
        "2.0.0rc1",
        "2.0.0",
        "3.0.0alpha1",
        "3.0.0beta2",
        "3.0.0beta15"
    ]);    
}

exports["test latestForMajor"] = function(ASSERT)
{
    var versions = [],
        version = null,
        result;
    
    result = SEMVER.latestForMajor(versions, version);
    ASSERT.strictEqual(result, false);

    versions = [
        "0.1.0"
    ];
    result = SEMVER.latestForMajor(versions, version);
    ASSERT.equal(result, "0.1.0");
    
    versions = [
        "0.1.0"
    ];
    version = "1.0.0";
    result = SEMVER.latestForMajor(versions, version);
    ASSERT.strictEqual(result, false);
    
    versions = [
        "0.1.0",
        "v1.1.0"
    ];
    version = "1.0.0";
    result = SEMVER.latestForMajor(versions, version);
    ASSERT.equal(result, "v1.1.0");
    
    versions = [
        "v0.1.10",
        "0.1.8",
        "0.1.9"
    ];
    result = SEMVER.latestForMajor(versions);
    ASSERT.equal(result, "v0.1.10");
    
    versions = [
        "0.1.0beta1",
        "1.1.0"
    ];
    version = "0.1.0";
    result = SEMVER.latestForMajor(versions, version);
    ASSERT.equal(result, false);

    version = "0.1.0alpha1";
    result = SEMVER.latestForMajor(versions, version);
    ASSERT.equal(result, "0.1.0beta1");

    versions = [
        "0.1.0beta1",
        "v1.1.0alpha1",
        "0.1.0rc2",
        "0.1.0rc1"
    ];
    version = "0.1.0rc1";
    result = SEMVER.latestForMajor(versions, version);
    ASSERT.equal(result, "0.1.0rc2");

    version = "1.0.0a";
    result = SEMVER.latestForMajor(versions, version);
    ASSERT.equal(result, "v1.1.0alpha1");
}

exports["test latestForEachMajor"] = function(ASSERT)
{
    var versions = [],
        result;

    versions = [
        "v0.1.0",
        "0.1.1",
        "1.0.0",
        "1.0.1",
        "v1.0.1alpha1"
    ];
    result = SEMVER.latestForEachMajor(versions);
    ASSERT.deepEqual(result, [
        "0.1.1",
        "1.0.1"
    ]);

    versions = [
        "0.1.0",
        "0.1.1alpha1",
        "v1.0.0",
        "1.0.1alpha2",
        "1.0.1alpha1",
        "2.0.0rc1",
        "v2.0.0",
        "3.0.0alpha1",
        "v3.0.0beta15",
        "3.0.0beta1"
    ];
    result = SEMVER.latestForEachMajor(versions, true);
    ASSERT.deepEqual(result, [
        "0.1.0",
        "0.1.1alpha1",
        "v1.0.0",
        "1.0.1alpha2",
        "v2.0.0",
        "v3.0.0beta15"
    ]);

    versions = [
        "0.3.1beta3",
        "0.3.2beta4"
    ];
    result = SEMVER.latestForEachMajor(versions, true);
    ASSERT.deepEqual(result, [
        "0.3.2beta4"
    ]);

    versions = [
        "0.3.1beta3",
        "0.4.1beta4"
    ];
    result = SEMVER.latestForEachMajor(versions, true);
    ASSERT.deepEqual(result, [
        "0.4.1beta4"
    ]);

    versions = [
        "0.3.1beta3",
        "0.4.1"
    ];
    result = SEMVER.latestForEachMajor(versions, true);
    ASSERT.deepEqual(result, [
        "0.4.1"
    ]);
    
    versions = [
        "0.1.0",
        "0.1.1alpha2",
        "0.1.1beta1"
    ];
    result = SEMVER.latestForEachMajor(versions, true);
    ASSERT.deepEqual(result, [
        "0.1.0",
        "0.1.1beta1"
    ]);    
}

exports["test versionsForTags"] = function(ASSERT)
{
    var tags = [],
        result;

    tags = [
        "v4.4",
        "v0.1.1alpha",
        "v4.3rc1",
        "v0.1.0",
        "v3.0.0alpha1",
        "dd",
        "v5.0.0beta2rc2",
        "v3.0.0alpha1dfd",
        "v5.0beta2rc1"
    ];
    result = SEMVER.versionsForTags(tags);
    ASSERT.deepEqual(result, [
        "0.1.0",
        "3.0.0alpha1",
        "4.3rc1",
        "4.4",
        "5.0beta2rc1",
        "5.0.0beta2rc2",
    ]);

    tags = [
        "v0.1.0",
        "test/path/v0.1.1alpha1",
        "test/path/v0.1.1beta1"
    ];
    result = SEMVER.versionsForTags(tags, "test/path");
    ASSERT.deepEqual(result, [
        "0.1.1alpha1",
        "0.1.1beta1"
    ]);
}
