define([
	'intern!object'
	, 'intern/chai!assert'
	, 'require'
	, 'dojo/on'
], function (
	registerSuite
	, assert
	, require
	, on
) {

	registerSuite({
		name: 'Test TextSearch',

		"click sugget": function() {
			return this.remote
				.get(require.toUrl('./testTextSearch.html'))
					.setFindTimeout(5000)
					.findByCssSelector("div[class='suggestions border'] > span").click().end()
					.findByCssSelector("input[class='inputSearch']").getProperty('value').then(
						function (value) {
							assert.strictEqual(value, 'Porroecia', 'Debería ser igual');
						}
					).end();
		},

		"click remove text": function() {
			return this.remote
				.get(require.toUrl('./testTextSearch.html'))
					.setFindTimeout(5000)
					.findByCssSelector("div[class='textSearch'] > i[class='fa fa-times']").click().end()
					.findByCssSelector("input[class='inputSearch']").getAttribute('value').then(
						function (value) {
							console.log("entre")
							assert.strictEqual(value, '', 'Debería ser igual, vacio los dos');
						}
					).end();
		}
	});
});