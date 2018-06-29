define([
	"intern!object"
	, "intern/chai!assert"
	, "app/TextSearch"
	, "dojo/on"
], function(
		registerSuite
		, assert
		, TextSearch
		, on
){
		var widget, json;

		registerSuite({

			name: "Text Search Test",

			setup: function() {
				var optionSearch = [{
					'label': 'Especies',
					'event': 'taxon',
					'default': true
				},
				{
					'label': 'Actividades',
					'event': 'activity'
				}];

				widget = new TextSearch({
					optionSearch: optionSearch
				});

				json = [
					"Porroecia",
					"Porroecia parthenoda",
					"Porroecia porrecta",
					"Porroecia spinirostris"
				];
			},

			"Construcción del widget": function() {
				assert.ok(widget);
			},

			"Comprobación de la estructura": function() {
				assert.strictEqual(widget.domNode.children.length, 3);

				assert.strictEqual(widget.domNode.children[0].nodeName, 'DIV');
				assert.strictEqual(widget.domNode.children[1].nodeName, 'DIV');
				assert.strictEqual(widget.domNode.children[2].nodeName, 'DIV');

				assert.strictEqual(widget.domNode.children[0].children.length, 2);
				assert.strictEqual(widget.domNode.children[0].firstChild.nodeName, 'DIV');
				assert.strictEqual(widget.domNode.children[0].firstChild.children.length, 2);
				assert.strictEqual(widget.domNode.children[0].firstChild.firstChild.nodeName, 'I');
				assert.strictEqual(widget.domNode.children[0].firstChild.lastChild.nodeName, 'SPAN');
				assert.strictEqual(widget.domNode.children[0].lastChild.nodeName, 'DIV');
				assert.strictEqual(widget.domNode.children[0].lastChild.children.length, 2);

				assert.strictEqual(widget.domNode.children[1].children.length, 3);
				assert.strictEqual(widget.domNode.children[1].firstChild.nodeName, 'INPUT');
				assert.strictEqual(widget.domNode.children[1].children[1].nodeName, 'INPUT');
				assert.strictEqual(widget.domNode.children[1].children[2].nodeName, 'I');

				assert.strictEqual(widget.domNode.children[2].children.length, 1);
				assert.strictEqual(widget.domNode.children[2].firstChild.nodeName, 'I');
			},

			"Comprobación del div de las sugerencias, y de la función addSuggestions": function() {

				widget._addSuggestions(json);

				var node = widget.boxSuggestionsNode;

				assert.strictEqual(node.children.length, 4);
				assert.strictEqual(node.firstChild.nodeName, 'SPAN');
			},

			"Función selectSuggestion, comprobar que seleccione uno": function() {

				var node = widget.boxSuggestionsNode;

				widget._selectSuggestion(node.lastChild.lastChild);

				assert.strictEqual(widget.inputNode.value, 'Porroecia spinirostris');
				assert.strictEqual(node.getAttribute('class')
					, 'suggestions border hidden');
			},

			"Comprobación de la función cleanCHildrenNode": function() {

				widget._addSuggestions(json);

				widget._cleanChildrenNode(widget.boxSuggestionsNode);

				assert.strictEqual(widget.boxSuggestionsNode.children.length, 0);
			},

			"Comprobación de la función closeSuggestion": function() {

				assert.strictEqual(widget.boxSuggestionsNode.getAttribute('class')
					, 'suggestions border');

				widget._closeSuggestion();

				assert.strictEqual(widget.boxSuggestionsNode.getAttribute('class')
					, 'suggestions border hidden');
				assert.strictEqual(widget.focusIn, -1);
				assert.strictEqual(widget.inputAutocompleteNode.value, '');
				assert.strictEqual(widget.boxSuggestionsNode.children.length, 0);
			},

			"Comprobación de la función openSuggestion": function() {

				assert.strictEqual(widget.boxSuggestionsNode.getAttribute('class')
					, 'suggestions border hidden');

				widget._openSuggestion();

				assert.strictEqual(widget.boxSuggestionsNode.getAttribute('class')
					, 'suggestions border');

				widget._closeSuggestion();
			},

			"Función clickSearch, comprobar que emita": function() {
				widget.inputNode.value = 'specie';

				on(widget, widget.events.NEWSEARCH, function (query) {
					assert.strictEqual(query, 'specie');
				});

				widget._clickSearch();
			},

			"Función requestSuggestions, comprobar que emita": function() {

				on(widget, widget.events.REQUESTSUGGESTS, function (query) {
					assert.strictEqual(query.text, 'specie');
				});

				widget._requestSuggestions('specie');
			},

			"Función selectNodeFocus": function() {
				widget._closeSuggestion();
				widget._addSuggestions(json);

				widget._selectNodeFocus(1);

				assert.strictEqual(widget.boxSuggestionsNode.children.length, 4);
				assert.strictEqual(widget.focusIn, widget.boxSuggestionsNode.firstChild);

				widget._selectNodeFocus(-1);
				assert.strictEqual(widget.focusIn, -1);

				widget._selectNodeFocus(-1);
				assert.strictEqual(widget.focusIn, widget.boxSuggestionsNode.lastChild);
			},

			"Función deselectSuggetFocus": function() {
				widget._deselectSuggetFocus(widget.focusIn);
				assert.strictEqual(widget.focusIn.getAttribute('class')
					, 'suggestion');
			},

			"Función selectSuggetFocus": function() {
				widget._selectSuggetFocus(widget.focusIn);
				assert.strictEqual(widget.focusIn.getAttribute('class')
					, 'suggestion hover');
			},

			"Función updateInputAutocomplete": function() {
				widget.setValueInput('Sp');

				widget._addSuggestions(json);
				widget._updateInputAutocomplete("Specie");

				assert.strictEqual(widget.inputAutocompleteNode.value, "Specie");
			},

			"Función deleteValueInputAutocomplete": function() {
				widget._deleteValueInputAutocomplete();

				assert.strictEqual(widget.inputAutocompleteNode.value, '');
			}

		});
});