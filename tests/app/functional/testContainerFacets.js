define([
	'intern!object'
	, 'intern/chai!assert'
	, 'require'
], function (
	registerSuite
	, assert
	, require
) {

	registerSuite({
		name: 'Test container facets',

		"label click and checkBox checked": function() {
			return this.remote
				.get(require.toUrl('./testContainerFacets.html'))
					.setFindTimeout(5000)
					.findByCssSelector("div[data-redmic-id='endemicity'] > div label").click().end()
					.findByCssSelector("div input[data-redmic-id='Desconocida']").getProperty('checked').then(
						function (checked) {
							assert.strictEqual(checked, true, 'Debería ser igual, true los dos');
						}
				).end();
		}
	});
});