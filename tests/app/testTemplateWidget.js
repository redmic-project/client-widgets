define([
	"intern!object"
	, "intern/chai!assert"
	, "app/TemplateWidget"
	, "dojo/on"
], function(
	registerSuite
	, assert
	, TemplateWidget
	, on
){
	var widget;

	registerSuite({

		name: "Test Template Widget",

		setup: function() {
			widget = new TemplateWidget ({
				itemLabel: 'scientificname'
			}, "grid");
		},

		"Construcción del widget": function() {
			assert.ok(widget);
		},

		"Evento para cuando no existen datos": function() {
			widget.emit(widget.events.RENDER, null, null);

			assert.strictEqual(widget.domNode.children.length, 1);
		},

		"Evento para limpiar los nodos": function() {
			widget.emit(widget.events.CLEARNODE, widget.domNode);
			assert.strictEqual(widget.domNode.children.length, 0);
		},

		/*"Evento, cargar datos con plantilla": function() {

			var data = {"img": "https://www.redmic.es/api/mediastorage/photobank/species/groupicon/Algas.png","index":"species","type":"specie","id":"5956","score":1.0,"source":{"id":5956,"rank":{"id":10,"name_en":"Species","name":"Species"},"peculiarity":{"endemicity":{"id":6,"name_en":"Unknown","name":"Desconocida"},"canarycatalogue":null,"interest":{"id":6,"name_en":"Ornamental","name":"Uso ornamental"},"origin":{"id":1,"name_en":"Other","name":"Otro"},"euprotection":{"id":1,"name_en":"Not recorded","name":"No registrada"},"ecology":{"id":1,"name_en":"Other","name":"Otro"},"spainprotection":{"id":4,"name_en":"Special protection","name":"Protección especial"},"permanence":{"id":1,"name_en":"Other","name":"Otra"},"canaryprotection":{"id":1,"name_en":"Not recorded","name":"No catalogada"},"spaincatalogue":null,"eudirective":null},"authorship":"(Audouin, 1826)","updated":"2015-03-06 08:47:01.300173","aphia":111229,"path":"root.1.15.164.332.773.2308.5956","children":null,"commonname":" ","scientificname":"Caberea boryi","note":" "}};

			var i18n = {
				"Published": "Publicado",
				"title": "Especie",
				"statistics": "Estadisticas",
				"map": "Mapa",
				"aphia": "Aphia",
				"authorship": "Autor",
				"note": "Nota",
				"updated": "Actualizado",
				"activity": "Actividades",
				"project": "Proyectos",
				"documents": "Documentos",
				"program": "Programas",
				"endemicity": "Endemicidad"
			};

			widget.emit(widget.events.RENDER, i18n, data);

			assert.strictEqual(widget.domNode.children.length, 2);
		},*/

		"Evento para cambiar la config": function() {

			var config = {
				template: null
			};

			widget.emit(widget.events.CONFIG, config);

			assert.strictEqual(widget.template, null);
		}

	});
});