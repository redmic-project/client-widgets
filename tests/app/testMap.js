define([
	"intern!object"
	, "intern/chai!assert"
	, "app/Map"
	, "dojo/on"
], function(
	registerSuite
	, assert
	, Map
	, on
){
	var map;

	registerSuite({

		name: "Test Map",

		setup: function() {
			map = new Map ({}, "map");
		},

		"Construcción del widget": function() {
			assert.ok(map);
		},

		"Eventos": function() {
			on(map, map.events.QUERYMAP, function(data) {
				assert.ok(data);
			});

			map.emit(map.events.CHANGED);
		}
	});
});