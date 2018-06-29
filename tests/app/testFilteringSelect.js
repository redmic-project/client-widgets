define([
	"intern!object"
	, "intern/chai!assert"
	, "app/FilteringSelect"
	, "dojo/on"
], function(
		registerSuite
		, assert
		, FilteringSelect
		, on
){
		var widget, json;

		registerSuite({

			name: "Text Filtering Select",

			setup: function() {

				widget = new FilteringSelect();

				json = {
					data: [
						{'id': 1, 'name': "Zalophotrema", 'score': 1},
						{'id': 2, 'name': "Zalophotrema atlanticum", 'score': 1},
						{'id': 3, 'name': "Zameus", 'score': 1},
						{'id': 4, 'name': "Zanardinia", 'score': 1},
						{'id': 5, 'name': "Zanardinia typus", 'score': 1}
					],
					total: 5
				};

				widget.dialogNode = true;
			},

			"Construcción del widget": function() {
				assert.ok(widget);
			},

			"Comprobación de la estructura": function() {

				assert.strictEqual(widget.domNode.children.length, 2);

				assert.strictEqual(widget.domNode.children[0].nodeName, 'DIV');
				assert.strictEqual(widget.domNode.children[1].nodeName, 'DIV');

				assert.strictEqual(widget.domNode.children[0].children.length, 3);
				assert.strictEqual(widget.domNode.children[0].firstChild.nodeName, 'INPUT');
				assert.strictEqual(widget.domNode.children[0].children[1].nodeName, 'INPUT');
				assert.strictEqual(widget.domNode.children[0].children[2].nodeName, 'I');

				assert.strictEqual(widget.domNode.children[1].children.length, 1);
				assert.strictEqual(widget.domNode.children[1].firstChild.nodeName, 'I');
			},

			"Comprobación del div de los resultados, y de la función addResults": function() {

				widget._addResults(json);

				var nodeResult = widget.boxResultsNode;

				assert.strictEqual(nodeResult.nodeName, 'DIV');

				assert.strictEqual(nodeResult.children.length, 5);
				assert.strictEqual(nodeResult.firstChild.nodeName, 'SPAN');
			},

			"Función selectResult, comprobar que seleccione uno": function() {

				widget._selectResultClick(widget.boxResultsNode.lastChild, 'Zanardinia typus');

				assert.strictEqual(widget.inputNode.value, 'Zanardinia typus');
			},

			"Comprobación de la función cleanCHildrenNode": function() {

				widget._addResults(json);

				widget._cleanChildrenNode(widget.boxResultsNode);

				var nodeResult = widget.boxResultsNode;

				assert.strictEqual(nodeResult.children.length, 0);
			},

			"Comprobación de la función closeResults": function() {

				widget._addResults(json);

				var nodeResult = widget.boxResultsNode;

				assert.strictEqual(nodeResult.children.length, 5);

				widget._closeResults();

				assert.strictEqual(widget.focusIn, -1);
				assert.strictEqual(widget.inputAutocompleteNode.value, '');
				assert.strictEqual(widget.boxResultsNode.children.length, 0);
			},

			"Función clickFiltering, comprobar que emita": function() {

				widget.inputNode.value = 'specie';

				on(widget, "request", function (query) {
					//assert.strictEqual(query['multi_match'].query, 'specie');
				});

				widget._clickFiltering();
			},

			"Función request, comprobar que emita": function() {

				on(widget, "request", function (query) {
					//assert.strictEqual(query['my-suggest'].text, 'specie');
				});

				widget._request('specie');
			},

			"Función selectNodeFocus": function() {

				widget._closeResults();
				widget._addResults(json);

				widget._selectNodeFocus(1);

				assert.strictEqual(widget.boxResultsNode.children.length, 5);
				assert.strictEqual(widget.focusIn, widget.boxResultsNode.firstChild);

				widget._selectNodeFocus(-1);
				assert.strictEqual(widget.focusIn, -1);

				widget._selectNodeFocus(-1);
				assert.strictEqual(widget.focusIn, widget.boxResultsNode.lastChild);
			},

			"Función deselectResultFocus": function() {

				widget._deselectResultFocus(widget.focusIn);
				assert.strictEqual(widget.focusIn.getAttribute('class')
					, 'suggestion borderResult');
			},

			"Función selectResultFocus": function() {

				widget._selectResultFocus(widget.focusIn, "Zanardinia typus");
				assert.strictEqual(widget.focusIn.getAttribute('class')
					, 'suggestion borderResult hover');
			},

			"Función updateInputAutocomplete": function() {

				widget._setValueInput('Sp');
				widget._updateInputAutocomplete("specie");

				assert.strictEqual(widget.inputAutocompleteNode.value, "Specie");
			},

			"Función deleteValueInputAutocomplete": function() {

				widget._deleteValueInputAutocomplete();

				assert.strictEqual(widget.inputAutocompleteNode.value, '');
			},

			"Paginación, comprobación de que se de la opción": function() {

				json.total = 20;
				widget._addResults(json);

				console.log(widget.boxResultsNode)

				//solo una opción
				assert.strictEqual(widget.boxResultsNode.children.length, 6);
				assert.strictEqual(widget.boxResultsNode.lastChild.getAttribute('class')
					, 'suggestion spanPagination borderResult');

				json.total = 40;
				widget.start = 15;
				widget._addResults(json);

				//las dos opciones
				assert.strictEqual(widget.boxResultsNode.children.length, 7);
				assert.strictEqual(widget.boxResultsNode.firstChild.getAttribute('class')
					, 'suggestion spanPagination borderResult');
				assert.strictEqual(widget.boxResultsNode.lastChild.getAttribute('class')
					, 'suggestion spanPagination borderResult');
				widget._closeResults();
			}

		});
});