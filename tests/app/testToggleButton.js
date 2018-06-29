define([
	"intern!object"
	, "intern/chai!assert"
	, "app/ToggleButton"
	, "dojo/query"
	, "dojo/on"
], function(
	registerSuite
	, assert
	, ToggleButton
	, query
	, on
){
		var widget, widgetMultiple, listButton;

		registerSuite({

			name: "Text toggle button",

			setup: function() {

				listButton = [
					{
						'default': true,
						'id': 1,
						'label': '1'
					},{
						'default': true,
						'icon': 'fa-circle',
						'id': 2,
					},{
						'icon': 'fa-circle',
						'id': 3,
						'label': '3'
					},{
						'id': 4,
					}
				];

				groups = {
					1: [1, 2],
					2: [3],
					3: [4]
				};

				widget = new ToggleButton({
						listButton: listButton,
						multipleSelected: false
				});

				widgetMultiple = new ToggleButton({
						listButton: listButton,
						groups: groups,
						multipleSelected: true
				});
			},

			"Construcción del widget": function() {
				assert.ok(widget);
			},

			"Comprobación de la estructura simple": function() {

				assert.strictEqual(widget.domNode.children.length, 1);

				var parentNode = widget.domNode.children[0];

				assert.strictEqual(parentNode.nodeName, 'DIV');

				assert.strictEqual(parentNode.children.length, 4);

				assert.strictEqual(parentNode.firstChild.nodeName, 'DIV');
				assert.strictEqual(parentNode.firstChild.getAttribute('class'), 'button active');
				assert.strictEqual(parentNode.firstChild.getAttribute('data-redmic-button-id'), '1');
				assert.strictEqual(parentNode.firstChild.children.length, 1);
				assert.strictEqual(parentNode.firstChild.lastChild.nodeName, 'SPAN');

				assert.strictEqual(parentNode.children[1].nodeName, 'DIV');
				assert.strictEqual(parentNode.children[1].getAttribute('class'), 'button');
				assert.strictEqual(parentNode.children[1].getAttribute('data-redmic-button-id'), '2');
				assert.strictEqual(parentNode.children[1].children.length, 1);
				assert.strictEqual(parentNode.children[1].firstChild.nodeName, 'I');

				assert.strictEqual(parentNode.children[2].nodeName, 'DIV');
				assert.strictEqual(parentNode.children[2].getAttribute('data-redmic-button-id'), '3');
				assert.strictEqual(parentNode.children[2].children.length, 2);
				assert.strictEqual(parentNode.children[2].firstChild.nodeName, 'I');
				assert.strictEqual(parentNode.children[2].lastChild.nodeName, 'SPAN');

				assert.strictEqual(parentNode.children[3].nodeName, 'DIV');
				assert.strictEqual(parentNode.children[3].getAttribute('data-redmic-button-id'), '4');
				assert.strictEqual(parentNode.children[3].children.length, 1);
				assert.strictEqual(parentNode.children[3].lastChild.nodeName, 'SPAN');

			},

			"Comprobación de la estructura multiple": function() {

				assert.strictEqual(widgetMultiple.domNode.children.length, 1);

				var parentNode = widgetMultiple.domNode.children[0];

				assert.strictEqual(parentNode.nodeName, 'DIV');

				assert.strictEqual(parentNode.children.length, 4);

				assert.strictEqual(parentNode.firstChild.nodeName, 'DIV');
				assert.strictEqual(parentNode.firstChild.getAttribute('class'), 'button active');
				assert.strictEqual(parentNode.firstChild.getAttribute('data-redmic-button-id'), '1');
				assert.strictEqual(parentNode.firstChild.children.length, 1);
				assert.strictEqual(parentNode.firstChild.lastChild.nodeName, 'SPAN');

				assert.strictEqual(parentNode.children[1].nodeName, 'DIV');
				assert.strictEqual(parentNode.firstChild.getAttribute('class'), 'button active');
				assert.strictEqual(parentNode.children[1].getAttribute('data-redmic-button-id'), '2');
				assert.strictEqual(parentNode.children[1].children.length, 1);
				assert.strictEqual(parentNode.children[1].firstChild.nodeName, 'I');

				assert.strictEqual(parentNode.children[2].nodeName, 'DIV');
				assert.strictEqual(parentNode.children[2].getAttribute('data-redmic-button-id'), '3');
				assert.strictEqual(parentNode.children[2].children.length, 2);
				assert.strictEqual(parentNode.children[2].firstChild.nodeName, 'I');
				assert.strictEqual(parentNode.children[2].lastChild.nodeName, 'SPAN');

				assert.strictEqual(parentNode.children[3].nodeName, 'DIV');
				assert.strictEqual(parentNode.children[3].getAttribute('data-redmic-button-id'), '4');
				assert.strictEqual(parentNode.children[3].children.length, 1);
				assert.strictEqual(parentNode.children[3].lastChild.nodeName, 'SPAN');
			},

			"_selectDefault": function() {

				widget.selected = [];

				widget._selectDefault(widget.domNode.children[0].firstChild, 1);

				assert.strictEqual(widget.selected.length, 1);
				assert.strictEqual(widget.selected[0].id, 1);
			},

			"_searchNodeWithID comprobar que busque en node por el id": function() {

				var node = widget._searchNodeWithID(1);

				assert.strictEqual(node.getAttribute('data-redmic-button-id'), '1');

			},

			"_searchNodeWithID comprobar que si no existe devuelva null": function() {

				var node = widget._searchNodeWithID(0);

				assert.strictEqual(node, null);
			},

			"_eventSimpleSelected seleccionar el que ya está": function() {

				widget._eventSimpleSelected({
					'node': widget.domNode.children[0].children[0],
					'id': listButton[0].id
				});

				var resultNodes = query("div.button.active", widget.domNode);

				assert.strictEqual(widget.selected.length, 1);
				assert.strictEqual(widget.selected[0].id, 1);

				assert.strictEqual(resultNodes.length, 1);
				assert.strictEqual(resultNodes[0].getAttribute('data-redmic-button-id'), '1');
			},

			"_eventSimpleSelected seleccionar distinto al que ya está": function() {

				widget._eventSimpleSelected({
					'node': widget.domNode.children[0].children[3],
					'id': listButton[3].id
				});

				var resultNodes = query("div.button.active", widget.domNode);

				assert.strictEqual(widget.selected.length, 1);
				assert.strictEqual(widget.selected[0].id, 4);

				assert.strictEqual(resultNodes.length, 1);
				assert.strictEqual(resultNodes[0].getAttribute('data-redmic-button-id'), '4');
			},


			"event emit simple": function() {

				on(widget, widget.events.CHANGE, function(selected) {
					assert.strictEqual(selected[0].id, 2);
				})

				widget._eventSimpleSelected({
					'node': widget.domNode.children[0].children[1],
					'id': listButton[1].id
				});

				assert.strictEqual(widget.selected.length, 1);
				assert.strictEqual(widget.selected[0].id, 2);
			},

			"_eventMultipleSelected deseleccionar uno de los que esta": function() {

				var resultNodes = query("div.button.active", widgetMultiple.domNode);

				assert.strictEqual(resultNodes.length, 2);

				widgetMultiple._eventMultipleSelected({
					'node': widgetMultiple.domNode.children[0].children[1],
					'id': listButton[1].id
				});

				resultNodes = query("div.button.active", widgetMultiple.domNode);

				assert.strictEqual(widgetMultiple.selected.length, 1);
				assert.strictEqual(widgetMultiple.selected[0].id, 1);

				assert.strictEqual(resultNodes.length, 1);
				assert.strictEqual(resultNodes[0].getAttribute('data-redmic-button-id'), '1');
			},

			"_eventMultipleSelected seleccionar el que ya está": function() {

				widgetMultiple._eventMultipleSelected({
					'node': widgetMultiple.domNode.children[0].children[0],
					'id': listButton[0].id
				});

				var resultNodes = query("div.button.active", widgetMultiple.domNode);

				assert.strictEqual(widgetMultiple.selected.length, 1);
				assert.strictEqual(widgetMultiple.selected[0].id, 1);

				assert.strictEqual(resultNodes.length, 1);
				assert.strictEqual(resultNodes[0].getAttribute('data-redmic-button-id'), '1');
			},

			"_eventMultipleSelected seleccionar otro": function() {

				widgetMultiple._eventMultipleSelected({
					'node': widgetMultiple.domNode.children[0].children[1],
					'id': listButton[1].id
				});

				var resultNodes = query("div.button.active", widgetMultiple.domNode);

				assert.strictEqual(widgetMultiple.selected.length, 2);

				assert.strictEqual(resultNodes.length, 2);
				assert.strictEqual(resultNodes[0].getAttribute('data-redmic-button-id'), '1');
				assert.strictEqual(resultNodes[1].getAttribute('data-redmic-button-id'), '2');
			},

			"_eventMultipleSelected seleccionar uno de un grupo diferente": function() {

				widgetMultiple._eventMultipleSelected({
					'node': widgetMultiple.domNode.children[0].children[2],
					'id': listButton[2].id
				});

				var resultNodes = query("div.button.active", widgetMultiple.domNode);

				assert.strictEqual(widgetMultiple.selected.length, 1);
				assert.strictEqual(widgetMultiple.selected[0].id, 3);

				assert.strictEqual(resultNodes.length, 1);
				assert.strictEqual(resultNodes[0].getAttribute('data-redmic-button-id'), '3');
			},

			"_eventMultipleSelected seleccionar uno sin grupo": function() {

				widgetMultiple._eventMultipleSelected({
					'node': widgetMultiple.domNode.children[0].children[3],
					'id': listButton[3].id
				});

				var resultNodes = query("div.button.active", widgetMultiple.domNode);

				assert.strictEqual(widgetMultiple.selected.length, 1);
				assert.strictEqual(widgetMultiple.selected[0].id, 4);
				assert.strictEqual(resultNodes.length, 1);
				assert.strictEqual(resultNodes[0].getAttribute('data-redmic-button-id'), '4');
			},

			"event emit multiple": function() {

				on(widgetMultiple, widgetMultiple.events.CHANGE, function(selected) {
					assert.strictEqual(selected[0].id, 2);
				})

				widgetMultiple._eventMultipleSelected({
					'node': widgetMultiple.domNode.children[0].children[1],
					'id': listButton[1].id
				});

				assert.strictEqual(widgetMultiple.selected.length, 1);
				assert.strictEqual(widgetMultiple.selected[0].id, 2);
			}
		});
});