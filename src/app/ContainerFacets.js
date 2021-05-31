define([
	"dojo/_base/declare"
	, "dijit/_WidgetBase"
	, "dojo/_base/lang"
	, "dojo/Evented"
	, "./Facet"
], function(
	declare
	, _WidgetBase
	, lang
	, Evented
	, Facet
) {

	return declare([_WidgetBase, Evented], {

		"class": "containerFacets",

		constructor: function(args){

			this.config = {
				maxInitialEntries: 5,
				aggs: null,
				openFacets: false,
				order: null,
				instance: {},
				i18n: null,
				events: {
					CONFIG_CHANGED: "configChanged",
					UPDATE_QUERY: "updateQuery",
					UPDATE_CONSULT: "updateConsult"
				}
			};

			lang.mixin(this, this.config, args);

			this.on(this.events.CONFIG_CHANGED, this._render);

			this.query = {};
		},

		postCreate: function() {

			this.domNode.removeAttribute('widgetId');

			this.inherited(arguments);
		},

		setConfig: function(config) {

			this.config = config;
			this.emit(this.events.CONFIG_CHANGED, config);
		},

		setI18n: function(i18n) {

			this.i18n = i18n;
		},

		_render: function() {

			if (Object.keys(this.instance).length !== 0) {
				for (var item in this.instance) {
					this.instance[item].termSelection = this.instance[item].widget.termSelection;
				}
			}

			this._cleanChildrenNode();

			for (var i = 0; i < this.order.length; i++) {
				this._renderItem(this.order[i]);
			}
		},

		_renderItem: function(item) {

			var facetsPrefix = 'sterms#',
				content = this.config.aggregations[item],
				open;

			if (!content) {
				return;
			}

			if (!content.buckets) {
				content = content[item] || content[facetsPrefix + item];
			}

			if (this.instance && this.instance[item] && (this.instance[item].termSelection.length != 0)) {
				open = true;
			} else if (this.aggs && this.aggs[item] && this.aggs[item].open) {
				open = this.aggs[item].open;
			} else {
				open = this.openFacets;
			}

			var widget = new Facet({
				termSelection: (this.instance && this.instance[item]) ? this.instance[item].termSelection : [],
				label: item,
				termsFieldFacet: (this.aggs && this.aggs[item]) ? this.aggs[item].terms.field : item,
				title: (this.i18n && this.i18n[item]) ? this.i18n[item] : item,
				i18n: this.i18n,
				open: open,
				config: content,
				maxInitialEntries: this.maxInitialEntries
			}).placeAt(this.domNode);

			this.instance[item] = {
				widget: widget,
				termSelection: []
			};

			if (widget.termSelection.length != 0) {
				widget.emit(widget.events.TERMS_CHANGED);
			}

			widget.on(this.events.UPDATE_QUERY, lang.hitch(this, this.updateQuery));
		},

		_cleanChildrenNode: function() {

			while (this.domNode.firstChild) {
				this.domNode.removeChild(this.domNode.firstChild);
			}
		},

		updateQuery: function(queryTerm, title) {

			queryTerm ? this.add(title, queryTerm) : this.remove(title);

			this.emit(this.events.UPDATE_CONSULT, this.query);
		},

		add: function(title, queryTerm) {

			this.query[title] = queryTerm;
		},

		remove: function(title) {

			delete this.query[title];
		},

		setPrefixFieldFacet: function(/*String*/ prefixFieldFacet) {

			this.prefixFieldFacet = prefixFieldFacet;
		},

		setSuffixFieldFacet: function(/*String*/ suffixFieldFacet) {

			this.suffixFieldFacet = suffixFieldFacet;
		},

		setFieldFacets: function(/*json*/ fieldFacet) {

			this.fieldFacet = fieldFacet;
		},

		setOrder: function(/*json*/ order) {

			this.order = order;
		},

		setAggs: function(/*json*/ aggs) {

			this.aggs = aggs;
			this.setOrder(Object.keys(aggs));
		}
	});
});
