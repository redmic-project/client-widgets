define([
	"intern!object"
	, "intern/chai!assert"
	, "app/ContainerFacets"
	, "dojo/on"
], function(
		registerSuite
		, assert
		, ContainerFacets
		, on
){
		registerSuite({

			name: "Container Facets Test",

			"Comprueba la funcion add": function(){
				widget = new ContainerFacets();

				widget.add("endemicity", {"endemicity": ["canaria"]});

				assert.strictEqual(Object.keys(widget.query).length, 1);

				var result = {"endemicity":["canaria"]};
				assert.strictEqual(widget.query["endemicity"].key, result.key);
				assert.strictEqual(widget.query["endemicity"].value, result.value);
			},

			"Comprueba la funcion remove": function(){
				widget = new ContainerFacets();

				widget.add("endemicity", {"endemicity": ["canaria"]});

				widget.remove("endemicity");

				assert.strictEqual(Object.keys(widget.query).length, 0);
			},

			"Comprueba que la funcion updateQuery añada": function(){
				widget = new ContainerFacets();
				var inEvent = false;

				on(widget, widget.events.UPDATECONSULT, function(queryTerm) {
					inEvent = true;
				});

				widget.updateQuery({"endemicity": ["canaria"]}, "endemicity");
				assert.strictEqual(Object.keys(widget.query).length, 1);

				var result = {"endemicity": ["canaria"]};
				assert.strictEqual(widget.query["endemicity"].key, result.key);
				assert.strictEqual(widget.query["endemicity"].value, result.value);
				assert.isTrue(inEvent, "Deberia ser true");
			},

			"Comprueba que la funcion updateQuery elimine": function(){
				widget = new ContainerFacets();
				var inEvent = false;
				on(widget, widget.events.UPDATECONSULT, function(queryTerm) {
					inEvent = true;
				});

				widget.updateQuery({"endemicity": ["canaria"]}, "endemicity");

				widget.updateQuery(null, "endemicity");
				widget.remove("endemicity");

				assert.strictEqual(Object.keys(widget.query).length, 0);
				assert.isTrue(inEvent, "Deberia ser true");
			},

			"Comprueba que la funcion updateQuery actualice uno": function(){
				widget = new ContainerFacets();
				var inEvent = false;
				on(widget, widget.events.UPDATECONSULT, function(queryTerm) {
					inEvent = true;
				});

				widget.updateQuery({"endemicity": ["canaria"]}, "endemicity");

				var result = {"endemicity": ["canaria"]};
				assert.strictEqual(widget.query["endemicity"].key, result.key);
				assert.strictEqual(widget.query["endemicity"].value, result.value);
				assert.isTrue(inEvent, "Deberia ser true");

				inEvent = false;
				widget.updateQuery({"endemicity": ["dos"], "coche": ['rojo']}, "endemicity");

				result = {"endemicity": ["dos"], "coche": ['rojo']}
				assert.strictEqual(Object.keys(widget.query).length, 1);
				assert.strictEqual(Object.keys(widget.query["endemicity"]).length, 2);
				assert.strictEqual(widget.query["endemicity"]['endemicity'].key, result['endemicity'].key);
				assert.strictEqual(widget.query["endemicity"]['endemicity'].value, result['endemicity'].value);
				assert.strictEqual(widget.query["endemicity"]['coche'].key, result['coche'].key);
				assert.strictEqual(widget.query["endemicity"]['coche'].value, result['coche'].value);
				assert.isTrue(inEvent, "Deberia ser true");
			},

			"Construccion correcta del widget": function() {
				config = {"took":8,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":7417,"max_score":0.0,"hits":[]},"aggregations":{"endemicity":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Desconocida","doc_count":6539},{"key":"Canaria","doc_count":88},{"key":"Otra","doc_count":78},{"key":"Atlántica","doc_count":43},{"key":"Macaronésica","doc_count":1}]},"interest":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Uso ornamental","doc_count":6539},{"key":"Especie peligrosa","doc_count":88},{"key":"Otro","doc_count":78},{"key":"Uso industrial","doc_count":43},{"key":"Interés pesquero","doc_count":1}]},"ecology":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Otro","doc_count":3620},{"key":"Desconocida","doc_count":2958},{"key":"Béntica","doc_count":131},{"key":"Pelágica","doc_count":29},{"key":"Demersal","doc_count":11}]}}}

				widget = new ContainerFacets({
					order: ["endemicity", "interest", "ecology"]
				});

				widget.setConfig(config);

				assert.strictEqual(widget.config, config, 'Debería ser igual la configuracion en ambos');
			}

		});
});