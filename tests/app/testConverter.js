define([
	"intern!object"
	, "intern/chai!assert"
	, "app/Converter"
], function(
		registerSuite
		, assert
		, Converter
){

		registerSuite({

			name: "Text Converter",

			"Función DMS2DD valor 0": function() {
				var result = Converter.DMS2DD(27, 0, 0);

				assert.equal(result, 27);
			},

			"Función DMS2DD valor null": function() {
				var result = Converter.DMS2DD('dd', 48, 2.1374);

				assert.equal(result, null);

				result = Converter.DMS2DD(27, 'dd', 2.1374);

				assert.equal(result, null);

				result = Converter.DMS2DD(27, 48, 'dd');

				assert.equal(result, null);
			},

			"Función DD2DMS": function() {

				var dataEntry= [
						27.800593722222224,
						28.216666666666665,
						28.999999999722224
					],
					results = [
						{d: 27, m: 48, s: 2.1374},
						{d: 28, m: 13, s: 0},
						{d: 29, m: 0, s: 0}
					],
					result;

				for (var i = 0; i < dataEntry.length; i++) {

					result = Converter.DD2DMS(dataEntry[i]);

					assert.equal(result.degrees, results[i].d);
					assert.equal(result.minutes, results[i].m);
					assert.equal(result.seconds.toFixed(4), results[i].s);
				}
			},

			"Función convert null value spatial reference": function() {
				var result = Converter.convert('4326', '8888', -17.884528, 27.800594);

				assert.equal(result, null);
			},

			"Función convert null value coordenada": function() {
				var result = Converter.convert('4326', '32628', 'ddd', 27.800594);

				assert.equal(result, null);
			},

			"Función convert WGS84 to UTM28": function() {
				var point = Converter.convert('4326', '32628', -17.884528, 27.800594);

				assert.equal(point.x, 215797.2553888546);
				assert.equal(point.y, 3078451.9026411166);
			},

			"Función convert UTM28N to WGS84": function() {
				var point = Converter.convert('32628', '4326', 215797.25541213644, 3078451.902414031);

				assert.equal(point.x.toFixed(5), -17.88453);
				assert.equal(point.y.toFixed(5), 27.80059);
			},

			"Función convert WGS84 to WGS84WebMercator": function() {
				var point = Converter.convert('4326', '3857', -17.884528, 27.800594);

				assert.equal(point.x, -1990896.5500380434);
				assert.equal(point.y, 3223856.4372285875);
			},

			"Función convert WGS84WebMercato To WGS84": function() {
				var point = Converter.convert('3857', '4326', -1990896.5500380434, 3223856.4372285875);

				assert.equal(point.x.toFixed(5), -17.88453);
				assert.equal(point.y.toFixed(5), 27.80059);
			},

			"Función convert UTM28N to WGS84WebMercator": function() {
				var point = Converter.convert('32628', '3857', 215797.25541213644, 3078451.902414031);

				assert.equal(point.x, -1990896.5502184462);
				assert.equal(point.y, 3223856.4369626055);
			},

			"Función convert WGS84WebMercator To UTM28N": function() {
				var point = Converter.convert('3857', '32628', -1990896.5500380434, 3223856.4372285875);

				assert.equal(point.x, 215797.2553888546);
				assert.equal(point.y, 3078451.902641116);
			},

			"Encadenando funciones de DMS a WGS84 y luego UTM28N": function() {
				var result1 = Converter.DMS2DD(-17, 58, 59.999988);

				var result = Converter.DMS2DD(28, 31, 59.999988);

				var point = Converter.convert('4326', '32628', result1, result);

				assert.equal(point.x.toFixed(4), 208055.7953);
				assert.equal(point.y.toFixed(4), 3159917.4368);
			}
		});
});