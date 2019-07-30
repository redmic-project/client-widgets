define([
	"dojo/_base/declare"
	, "dijit/TitlePane"
	, "dojo/_base/lang"
	, "dojo/Evented"
	, "put-selector/put"
], function(
	declare
	, TitlePane
	, lang
	, Evented
	, put
) {

	return declare([TitlePane, Evented], {

		constructor: function(args){

			this.config = {
				termsFieldFacet: null,
				termSelection: [],
				bucketsKeys: [],
				events: {
					TERMS_CHANGED: "termsChanged",
					UPDATE_QUERY: "updateQuery"
				}
			};

			lang.mixin(this, this.config, args);

			this.on(this.events.TERMS_CHANGED, this._generateQuery);

			this._render();
		},

		postCreate: function() {

			this.domNode.removeAttribute('widgetId');

			this.inherited(arguments);
		},

		_render: function() {

			this.containerBucketsNode = put("div[data-redmic-id=$].bucket", this.title);
			this.content = this.containerBucketsNode;

			var buckets = this.config.buckets;

			for (var key in buckets) {
				this._insertBucket(buckets[key]);
			}

			var copyTermSelection = this.termSelection;

			for (var i = 0; i < this.termSelection.length; i++) {
				if (this.bucketsKeys.indexOf(this.termSelection[i]) == -1) {
					copyTermSelection.splice(i, 1);
				}
			}

			this.termSelection = copyTermSelection;
		},

		_insertBucket: function(bucket) {

			var label,
				key = bucket.key;

			if (this.i18n && this.i18n[key]) {
				labelText = this.i18n[key];
			} else {
				labelText = key;
			}

			var id_random = this._generateIDRandom(),
			    bucketNode = put(this.containerBucketsNode, "div.containerBucket");
			    labelNode = put(bucketNode, "label[for=$][title=$].inlineRow.labelBucket", id_random, labelText, labelText),
			    put(bucketNode, "label[for=$].labelBucket", id_random, "(" + bucket.doc_count + ")"),
			    checkBoxNode = put(labelNode, "-input[type='checkbox'][id=$][data-redmic-id=$]", id_random, key);

			checkBoxNode.onchange = lang.hitch(this, this._eventClickCheckBox, checkBoxNode.getAttribute('data-redmic-id'));

			this.bucketsKeys.push(key);

			var indexTermSelection = this.termSelection.indexOf(key);

			if (indexTermSelection != -1) {
				checkBoxNode.checked = true;
			}
		},

		_generateIDRandom: function() {

			return Math.random().toString(36).substring(7);
		},

		_eventClickCheckBox: function(dataRedmicID) {

			this._exist(dataRedmicID) ? this._remove(dataRedmicID) : this._add(dataRedmicID);
			this.emit(this.events.TERMS_CHANGED);
		},

		_exist: function(term) {

			return this.termSelection.indexOf(term) === -1 ? false : true;
		},

		_add: function(term) {

			this.termSelection.push(term);
		},

		_remove: function(term) {

			this.termSelection.splice(this.termSelection.indexOf(term), 1);
		},

		_generateQuery: function() {

			var queryTerm = {};

			if (this.termSelection == 0) {
				queryTerm = null;
			} else {
				queryTerm[this.termsFieldFacet] = this.termSelection;
			}

			this.emit(this.events.UPDATE_QUERY, queryTerm, this.label);
		}
	});
});
