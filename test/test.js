"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var fs = require("fs");
var cdnDler = require("../index.js");
var rmdir = require("rimraf");
var R = require("ramda");
var test_html = '<html><head><link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet"><script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script><link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"><script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script><script src="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.4/angular-material.min.js"></script><script src="https://ajax.googleapis.com/ajax/libs/angular-ui-router/1.0.0-rc.1/angular-ui-router.min.js"></script><script src="https://ajax.googleapis.com/ajax/libs/dojo/1.12.2/dojo/dojo.js"></script><script src="https://ajax.googleapis.com/ajax/libs/ext-core/3.1.0/ext-core.js"></script><script src="https://ajax.googleapis.com/ajax/libs/hammerjs/2.0.8/hammer.min.js"></script><script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script><script src="https://example.com/will-not-work.min.js"></script></head><body></body></html>';
var test_path = 'test/test.html';
var test_js_dir = 'test/js/vendor/';
var test_html_modified = '<html><head><link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet"><script src="js/vendor/bootstrap/3.3.7/js/bootstrap.min.js"></script><link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"><script src="js/vendor/angularjs/1.6.4/angular.min.js"></script><script src="js/vendor/angular_material/1.1.4/angular-material.min.js"></script><script src="js/vendor/angular-ui-router/1.0.0-rc.1/angular-ui-router.min.js"></script><script src="js/vendor/dojo/1.12.2/dojo/dojo.js"></script><script src="js/vendor/ext-core/3.1.0/ext-core.js"></script><script src="js/vendor/hammerjs/2.0.8/hammer.min.js"></script><script src="js/vendor/jquery/jquery-3.2.1.min.js"></script><script src="https://example.com/will-not-work.min.js"></script></head><body></body></html>';
var test_config = {
    jsDir: test_js_dir,
    cdnMap: [
        [/maxcdn\.bootstrapcdn\.com\//, "./"],
        [/code\.jquery\.com\//, "./jquery/"],
        [/ajax\.googleapis\.com\/ajax\/libs\//, './']
    ],
    dirdotOK: false,
    downloadOK: true,
    overwriteOK: true,
    mkdirOK: true
};
var startModuleTest = function (config) {
    var file = fs.createWriteStream(test_path);
    try {
        file.write(test_html);
        file.end();
    }
    catch (error) {
        console.error(error);
    }
    return cdnDler.processFile(test_path, config);
};
var afterSuiteRun = function () {
    if (fs.existsSync(test_path))
        fs.unlinkSync(test_path);
    if (fs.existsSync(test_js_dir))
        rmdir(test_js_dir, function (error) { if (error != null)
            console.error(error); });
};
var runTestSuite = function (message, suite, config) {
    if (config === void 0) { config = test_config; }
    return startModuleTest(config)
        .then(function (a) { suite(a); return a; })
        .then(function (a) { afterSuiteRun(); return a; })
        .then(function (a) { console.log(message + " complete."); return a; });
};
var doTest = function (message, result, expected) {
    try {
        assert.equal(result, expected, message);
    }
    catch (e) {
        console.error(e);
    }
};
var protypicalUseCase_Suite = function (info) {
    doTest("html should be modified properly", info.modifiedHtml, test_html_modified);
    info.paths.forEach(function (path) { return doTest("should exist: " + path, true, fs.existsSync(path)); });
    return info;
};
var dirdotWarning_Suite = function (info) { return info; };
exports.test = function () {
    runTestSuite("Protypical use case test", protypicalUseCase_Suite);
    runTestSuite("Dirdot Warning", dirdotWarning_Suite, R.assoc('cdnMap', [[/code\.jquery\.com\//, "./jquery./"]], test_config))
        .then(function (a) {
        assert.ok(false, "Should have thrown a Dirdot Error, but did not.");
        return 0;
    })
        .catch(function (err) {
        assert.ok(err.message.startsWith("Dirdot"), "This should be a Dirdot Error.");
        console.log("Dirdot failsafe test complete.");
        return 1;
    });
    return "Testing suite";
};
require('make-runnable/custom')({
    printOutputFrame: false
});
//# sourceMappingURL=test.js.map