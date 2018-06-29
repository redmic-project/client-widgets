// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.
define([
	"intern/node_modules/dojo/has"
	, "src/dojoConfig"
], function(
	has
) {

	has.add("dojo-has-api", true);
	dojoConfig.baseUrl =  has('host-browser') ? '' : '';

	return {
		proxyPort: 9000,
		proxyUrl: 'http://localhost:9000/',

		// Default desired capabilities for all environments. Individual capabilities can be overridden by any of the
		// specified browser environments in the `environments` array below as well. See
		// https://code.google.com/p/selenium/wiki/DesiredCapabilities for standard Selenium capabilities and
		// https://saucelabs.com/docs/additional-config#desired-capabilities for Sauce Labs capabilities.
		// Note that the `build` capability will be filled in with the current commit ID from the Travis CI environment
		// automatically
		capabilities: {
			'selenium-version': '2.45.0',
			'idle-timeout': 30
		},

		//OJO -> para ejecutar selenium en nuestro server hay que indicarle la localización del webdriver

		// Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
		// OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
		// capabilities options specified for an environment will be copied as-is
		environments: [
			//{ browserName: 'phantomjs' }
			// { browserName: 'firefox' },
			//{ browserName: 'internet explorer', version: '11', platform: 'Windows 8.1' },
			//{ browserName: 'internet explorer', version: '10', platform: 'Windows 8' },
			//{ browserName: 'internet explorer', version: '9', platform: 'Windows 7' },
			{ browserName: 'firefox' }
			//{ browserName: 'chrome', platform: [ 'LINUX' ] }
			/*{
				browserName: 'chrome',
				'chromeOptions': {
					args: ["test-type"]
				}
			}*/
			//{ browserName: 'safari', version: '6', platform: 'OS X 10.8' }
		],

		// Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
		maxConcurrency: 3,

		//reporters: [ "runner", "lcov" ],

		// Configuration options for the module loader; any AMD configuration options supported by the Dojo loader can be
		// used here
		loaderOptions: dojoConfig,

		// A regular expression matching URLs to files that should not be included in code coverage analysis
		//excludeInstrumentation: /^(?:dojo|dijit|dojox|idx|intern|istanbul|reporters|utilstest|widgetstest|.*nls.*messages)/,
		excludeInstrumentation: true,

		// Non-functional test suite(s) to run in each browser
		suites: [
			'tests/app/testFacet'
			, 'tests/app/testContainerFacets'
			, 'tests/app/testTextSearch'
			, 'tests/app/testMap'
			, 'tests/app/testConverter'
			, 'tests/app/testTemplateWidget'
			, 'tests/app/testFilteringSelect'
			, 'tests/app/testToggleButton'
			, 'tests/app/testList'
			, 'tests/app/testPaginationList'
			, 'tests/app/extensions/testCheckList'
			, 'tests/app/extensions/testDragAndDropList'
			, 'tests/app/extensions/testOrderList'
			, 'tests/app/extensions/testHierarchicalList'
			, 'tests/app/testDatePicker'
		],

		//: console.debug("Customized intern config for PhantomJS loaded successfully!")
		// Functional test suite(s) to run in each browser once non-functional tests are completed
		functionalSuites: [
			'tests/app/functional/testCheckBox'
			, 'tests/app/functional/testContainerFacets'
			, 'tests/app/functional/testTextSearch'
			, 'tests/app/functional/testToggleButton'
			, 'tests/app/functional/testPaginateList'
			, 'tests/app/functional/testCheckList'
			, 'tests/app/functional/testCheckSimpleList'
			, 'tests/app/functional/testDragAndDropList'
			, 'tests/app/functional/testHierarchicalList'

		]
}
});
