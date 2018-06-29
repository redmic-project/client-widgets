define([
	"intern!object"
	, "intern/chai!assert"
	, "app/Facet"
	, "dojo/on"
], function(
		registerSuite
		, assert
		, Facet
		, on
){
		var widget, content;

		registerSuite({

			name: "Facet Test",

			setup: function() {
				content = {"doc_count_error_upper_bound":0,
						"sum_other_doc_count":0,
						"buckets":[
						{"key":"Desconocida","doc_count":6539},
						{"key":"Canaria","doc_count":88},
						{"key":"Otra","doc_count":78},
						{"key":"Atlántica","doc_count":43},
						{"key":"Macaronésica","doc_count":1}]};

				widget = new Facet({
					title: "endemicity",
					config: content
				})
			},

			"Construcción del widget": function() {
				assert.ok(widget);
			},

			"Construccion correcta del widget": function() {

				assert.strictEqual(widget.config, content, 'Debería ser igual la configuracion en ambos');
			},

			"Construccion correcta del la estructura del widget": function() {

				assert.strictEqual(widget.containerBucketsNode.children.length, 5, 'Debería ser igual el numero de hijos en los buckets');
				assert.strictEqual(widget.containerBucketsNode.children[0].firstChild.nodeName, 'INPUT', 'Debería ser igual a input');
				assert.strictEqual(widget.containerBucketsNode.children[0].lastChild.nodeName, 'LABEL', 'Debería ser igual a span');
				assert.strictEqual(widget.containerBucketsNode.children[0].lastChild.lastChild.nodeName, '#text', 'Debería ser igual a text');
			},

			"Insertar un bucket": function() {
				bucket = {"key":"prueba","doc_count":9999}

				widget._insertBucket(bucket);

				assert.strictEqual(widget.containerBucketsNode.lastChild.children.length, 3, 'Tiene que tener dos hijos');
				assert.strictEqual(widget.containerBucketsNode.children.length, 6, 'Tiene que tener 6 hijo');
				assert.strictEqual(widget.containerBucketsNode.lastChild.children[0].nodeName, 'INPUT', 'Debería ser igual a input');
				assert.strictEqual(widget.containerBucketsNode.lastChild.children[1].nodeName, 'LABEL', 'Debería ser igual a input');
				assert.strictEqual(widget.containerBucketsNode.lastChild.children[1].lastChild.nodeName, '#text', 'Debería ser igual a input');
			},

			"Comprueba la funcion add": function(){

				widget._add("prueba");

				assert.strictEqual(widget.termSelection.indexOf("prueba"), 0);
			},

			"Comprueba la funcion exist": function(){

				assert.isTrue(widget._exist("prueba"), "Deberia ser true");
			},

			"Comprueba la funcion remove": function(){

				widget._remove("prueba");

				assert.strictEqual(widget.termSelection.length, 0);
				assert.isFalse(widget._exist("prueba"), "Deberia ser false");

			},

			"Comprueba la funcion eventClickCheckBox y generateQery escucha lo que emite esta": function() {

				var inEvent = false;

				on(widget, widget.events.TERMSCHANGED, function() {
					inEvent = true;
				})

				widget.label = 'Canarias';

				widget._eventClickCheckBox("Canaria");

				assert.isTrue(widget._exist("Canaria"), "Deberia ser true");
				assert.strictEqual(widget.termSelection.length, 1);
				assert.isTrue(inEvent, "Deberia ser true");
			},

			"Comprueba la funcion generateQery que escucha lo que emite eventClickCheckBox": function() {

				var result = {},
					title = null;

				on(widget, widget.events.UPDATEQUERY, function(queryTerm, configTitle) {
					result = queryTerm;
					title = configTitle;
				});

				assert.isFalse(widget._exist("Otro"), "Deberia ser false");

				widget._eventClickCheckBox("Otro");

				assert.isTrue(widget._exist("Canaria"), "Deberia ser true");
				assert.isTrue(widget._exist("Otro"), "Deberia ser true");

				assert.strictEqual(Object.keys(result).length, 1);
			}

		});
});
