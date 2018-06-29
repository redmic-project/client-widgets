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
		name: 'Test Toggle button',

		"click in button": function() {
			return this.remote
				.get(require.toUrl('./testToggleButton.html'))
					.setFindTimeout(100000)
					.findByCssSelector("div[data-redmic-button-id='2']").click().end()
					.findByCssSelector("div[class='button active']").getAttribute('data-redmic-button-id').then(
						function (id) {
							assert.strictEqual(id, '2');
						}
					).end();
		}
	});
});