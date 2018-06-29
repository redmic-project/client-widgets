define([
	"intern!object"
	, "intern/chai!assert"
	, "app/DatePicker"
	, "dojo/on"
	, "dojo/date/locale"
], function(
	registerSuite
	, assert
	, DatePicker
	, on
	, locale
){
	var widget, node, handler;

	registerSuite({

		name: "Test Date Picker",

		setup: function() {
			widget = new DatePicker({});
		},

		afterEach: function() {

			if (handler)
				handler.remove();
		},

		"Construcción del widget": function() {
			assert.ok(widget);

			node = widget.dateDialog.containerNode;
		},

		"Estructura": function() {

			assert.strictEqual(node.children.length, 1);
			assert.strictEqual(node.children[0].getAttribute('class'), 'datePickerDialog');
			assert.strictEqual(node.children[0].children.length, 2);
				assert.strictEqual(node.children[0].children[0].getAttribute('class'), 'from');
					assert.strictEqual(node.children[0].children[0].children.length, 2);
						assert.strictEqual(node.children[0].children[0].children[1].getAttribute('class'), 'text');
						assert.strictEqual(node.children[0].children[0].children[1].children.length, 2);
							assert.strictEqual(node.children[0].children[0].children[1].children[0].nodeName, 'SPAN');
							assert.strictEqual(node.children[0].children[0].children[1].children[1].nodeName, 'DIV');

				assert.strictEqual(node.children[0].children[1].getAttribute('class'), 'to');
					assert.strictEqual(node.children[0].children[1].children.length, 2);
						assert.strictEqual(node.children[0].children[1].children[1].getAttribute('class'), 'text');
						assert.strictEqual(node.children[0].children[1].children[1].children.length, 2);
							assert.strictEqual(node.children[0].children[1].children[1].children[0].nodeName, 'SPAN');
							assert.strictEqual(node.children[0].children[1].children[1].children[1].nodeName, 'DIV');
		},

		"_setMinDate": function() {

			assert.strictEqual(widget.inputNode.value, "");
			assert.strictEqual(widget.minDate, null);

			var date = new Date();

			handler = on(widget, widget.events.CHANGE_MIN_DATE, function(value) {
				assert.strictEqual(value.toLocaleDateString(), date.toLocaleDateString());
			});

			widget._setMinDate(date);

			assert.strictEqual(widget.minDate.toLocaleDateString(), date.toLocaleDateString());
			assert.strictEqual(widget.inputFrom.get('value').toLocaleDateString(), date.toLocaleDateString());
			assert.strictEqual(widget.calendarFrom.get('value').toLocaleDateString(), date.toLocaleDateString());

			assert.strictEqual(widget.inputNode.value, locale.format(widget.minDate , {datePattern : "dd/MM/yyyy", selector : 'date'}) + " - ");
		},

		"_setMinDate event": function() {

			assert.strictEqual(widget.minDate.toLocaleDateString(), new Date().toLocaleDateString());

			handler = on(widget, widget.events.CHANGE_MIN_DATE, function(value) {
				assert.strictEqual(null, null);
			});

			widget.emit(widget.events.SET_MIN_DATE, null);

			assert.strictEqual(widget.minDate, null);
			assert.strictEqual(widget.inputFrom.get('value'), null);
			assert.strictEqual(widget.calendarFrom.get('value'), null);

			assert.strictEqual(widget.inputNode.value, "");

		},

		"_setMaxDate": function() {

			assert.strictEqual(widget.maxDate, null);

			var date = new Date();

			handler = on(widget, widget.events.CHANGE_MAX_DATE, function(value) {
				assert.strictEqual(value.toLocaleDateString(), date.toLocaleDateString());
			});

			widget._setMaxDate(date);

			assert.strictEqual(widget.maxDate.toLocaleDateString(), date.toLocaleDateString());
			assert.strictEqual(widget.inputTo.get('value').toLocaleDateString(), date.toLocaleDateString());
			assert.strictEqual(widget.calendarTo.get('value').toLocaleDateString(), date.toLocaleDateString());

			assert.strictEqual(widget.inputNode.value, " - " + locale.format(widget.maxDate , {datePattern : "dd/MM/yyyy", selector : 'date'}));

		},

		"_setMaxDate event": function() {

			assert.strictEqual(widget.maxDate.toLocaleDateString(), new Date().toLocaleDateString());

			handler = on(widget, widget.events.CHANGE_MAX_DATE, function(value) {
				assert.strictEqual(null, null);
			});

			widget.emit(widget.events.SET_MAX_DATE, null);

			assert.strictEqual(widget.maxDate, null);
			assert.strictEqual(widget.inputTo.get('value'), null);
			assert.strictEqual(widget.calendarTo.get('value'), null);

			assert.strictEqual(widget.inputNode.value, "");
		},

		"_setInputMin": function() {

			assert.strictEqual(widget.inputFrom.get('value'), null);

			var date = new Date(2015, 1, 1);

			widget._setInputMin(date);

			assert.strictEqual(widget.minDate.toLocaleDateString(), date.toLocaleDateString());
			assert.strictEqual(widget.inputFrom.get('value').toLocaleDateString(), date.toLocaleDateString());
			assert.strictEqual(widget.calendarFrom.get('value').toLocaleDateString(), date.toLocaleDateString());
		},

		"_setInputMax": function() {

			assert.strictEqual(widget.inputTo.get('value'), null);

			var date = new Date(2015, 1, 1);

			date.setHours(1, 0, 0, 0);

			widget._setInputMax(date);

			assert.strictEqual(widget.maxDate.toLocaleDateString(), date.toLocaleDateString());
			assert.strictEqual(widget.inputTo.get('value').toLocaleDateString(), date.toLocaleDateString());
			assert.strictEqual(widget.calendarTo.get('value').toLocaleDateString(), date.toLocaleDateString());
		},

		"comprobar limites en input": function() {

			var date = new Date(2015, 1, 1);

			assert.strictEqual(widget.inputFrom.get('value').toLocaleDateString(), date.toLocaleDateString());
			assert.strictEqual(widget.inputTo.get('value').toLocaleDateString(), date.toLocaleDateString());

			var dateMax = new Date(2014, 1, 1);
			var dateMin = new Date(2016, 1, 1);

			assert.strictEqual(widget.inputNode.value, locale.format(widget.minDate , {datePattern : "dd/MM/yyyy", selector : 'date'})
				+ " - " + locale.format(widget.maxDate , {datePattern : "dd/MM/yyyy", selector : 'date'}));

			widget._setInputMin(dateMin);

			assert.strictEqual(widget.minDate, null);
			assert.strictEqual(widget.inputFrom.get('value'), null);
			assert.strictEqual(widget.calendarFrom.get('value'), null);

			widget._setInputMax(dateMax);

			assert.strictEqual(widget.maxDate.toLocaleDateString(), dateMax.toLocaleDateString());
			assert.strictEqual(widget.inputTo.get('value').toLocaleDateString(), dateMax.toLocaleDateString());
			assert.strictEqual(widget.calendarTo.get('value').toLocaleDateString(), dateMax.toLocaleDateString());

			widget._setInputMax(date);
			widget._setInputMin(date);

			widget._setInputMax(dateMax);

			assert.strictEqual(widget.maxDate, null);
			assert.strictEqual(widget.inputTo.get('value'), null);
			assert.strictEqual(widget.calendarTo.get('value'), null);

			date.setHours(1, 0, 0, 0);
			widget._setInputMax(date);
		},

		"comprobar limites en calendar": function() {

			var date = new Date(2015, 1, 1);
			var dateMax = new Date(2014, 1, 1);
			var dateMin = new Date(2016, 1, 1);

			assert.strictEqual(widget.calendarFrom.get('value').toLocaleDateString(), date.toLocaleDateString());
			assert.strictEqual(widget.calendarTo.get('value').toLocaleDateString(), date.toLocaleDateString());

			widget._setCalendarMin(dateMin);

			assert.strictEqual(widget.minDate, null);
			assert.strictEqual(widget.inputFrom.get('value'), null);
			assert.strictEqual(widget.calendarFrom.get('value'), null);

			widget._setCalendarMax(dateMax);

			assert.strictEqual(widget.maxDate.toLocaleDateString(), dateMax.toLocaleDateString());
			assert.strictEqual(widget.inputTo.get('value').toLocaleDateString(), dateMax.toLocaleDateString());
			assert.strictEqual(widget.calendarTo.get('value').toLocaleDateString(), dateMax.toLocaleDateString());

			widget._setCalendarMax(date);
			widget._setCalendarMin(date);

			widget._setCalendarMax(dateMax);

			assert.strictEqual(widget.maxDate, null);
			assert.strictEqual(widget.inputTo.get('value'), null);
			assert.strictEqual(widget.calendarTo.get('value'), null);
		},

		"remove": function() {

			var date = new Date(2015, 1, 1);

			widget._setInputMax(date);
			widget._setInputMin(date);

			widget._removeInput();

			assert.strictEqual(widget.maxDate, null);
			assert.strictEqual(widget.inputTo.get('value'), null);
			assert.strictEqual(widget.calendarTo.get('value'), null);

			assert.strictEqual(widget.minDate, null);
			assert.strictEqual(widget.inputFrom.get('value'), null);
			assert.strictEqual(widget.calendarFrom.get('value'), null);
		}
	});
});