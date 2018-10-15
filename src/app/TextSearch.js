define([
	"dojo/_base/declare"
	, "dijit/_WidgetBase"
	, "dojo/_base/lang"
	, "dojo/Evented"
	, "put-selector/put"
	, "dojo/dom-attr"
	, "dojo/dom-geometry"
	, "dojo/query"
], function(
	declare
	, _WidgetBase
	, lang
	, Evented
	, put
	, domAttr
	, domGeom
	, query
) {
	var cleanSpace = function(text) {
		return text && text.trim();
	};

	return declare([_WidgetBase, Evented], {

		"class": "containerTextSearch",

		constructor: function(args){

			this.config = {
				itemLabel: null,
				focusIn: -1,
				lastSearch: '',
				originalValue: '',
				suggestFields: null,
				sizeSuggets: null,
				events: {
					SEARCH_CHANGED: "searchChanged",
					NEW_SEARCH: "newSearch",
					CHANGE_SEARCH_PARAMS: "changeSearchParams",
					REQUEST: "request",
					REQUEST_SUGGESTS: "requestSuggests",
					RECEIVED_SUGGESTS: "receivedSuggests",
					CLOSE: "close",
					CLOSED: "closed",
					RESET: "reset",
					OPEN: "open",
					FOCUS_INPUT: "focusInput",
					SET_DEFAULT: "setDefault",
					EXECUTE: "execute",
					REFRESH: "refresh"
				},
				createQuery: function(text, fields) {

					var query = {
						'text': text
					};

					if (fields) {
						query.fields = fields;
					}

					if (this.sizeSuggets) {
						query.size = this.sizeSuggets;
					}

					return query;
				}
			};

			lang.mixin(this, this.config, args);

			this.on(this.events.SEARCH_CHANGED, this._requestSuggestions);
			this.on(this.events.RECEIVED_SUGGESTS, this._addSuggestions);
			this.on(this.events.CLOSE, this._closeSuggestion);
			this.on(this.events.OPEN, this._openSuggestion);
			this.on(this.events.RESET, this._reset);
			this.on(this.events.FOCUS_INPUT, this._focusInput);
			this.on(this.events.SET_DEFAULT, this.setValue);
			this.on(this.events.EXECUTE, this._execute);
			this.on(this.events.REFRESH, this._refresh);
		},

		postCreate: function() {

			if (this.optionActive) {
				this._createOption();
			}

			this._createTextSearch();

			this._createButtonSearch();
		},

		startup: function() {

			this.inherited(arguments);
		},

		_createTextSearch: function() {

			this.textSearchNode = put(this.domNode, "div.textSearch");
			this.inputAutocompleteNode = put(this.textSearchNode, "input[type=search].autocomplete");
			this.inputNode = put(this.textSearchNode, "input[type=search][autofocus].inputSearch");
			this.removeTextNode = put(this.textSearchNode, "i.fa.fa-times.hidden");

			var suggestionsNodeExists = query("div.suggestions.border.hidden", document.body);

			if (suggestionsNodeExists.length !== 0) {
				this.boxSuggestionsNode = suggestionsNodeExists[0];
			} else {
				this.boxSuggestionsNode = put(document.body, "div.suggestions.border.hidden");
			}

			this.inputNode.onkeyup = lang.hitch(this, this._eventChangeText);
			this.removeTextNode.onclick = lang.hitch(this, this._removeText);

			this.domNode.onmouseleave = lang.hitch(this, this._startTimeout, 'suggestTimeout',
				this._closeSuggestion, 800);
			this.domNode.onmouseenter = lang.hitch(this, this._stopTimeout, 'suggestTimeout');
			this.inputNode.onblur = lang.hitch(this, this._inputNodeNoFocus);
		},

		_inputNodeNoFocus: function() {

			setTimeout(lang.hitch(this, this._restartLastValueInput), 300);
		},

		_restartLastValueInput: function() {

			this.setValue(this.lastSearch);
		},

		_startTimeout: function(nameTimeout, callback, time) {

			this[nameTimeout] = setTimeout(lang.hitch(this, callback), time);
		},

		_stopTimeout: function(nameTimeout) {

			clearTimeout(this[nameTimeout]);
		},

		_eventChangeText: function(e) {

			var keyCode = e.keyCode || e.which;

			if (!this._selectKeyCodeArrows(keyCode)) {
				this._selectCharCorrect(keyCode);
			}

			if (cleanSpace(this.getValueInput()).length !== 0) {
				this._activeRemoveText();
			} else {
				this._closeSuggestion();
				this._desactiveRemoveText();
				this.focusIn = -1;
			}
		},

		_selectKeyCodeArrows: function(keyCode) {

			if (keyCode === 13) {
				this._search();
			} else if (keyCode === 40) {
				this._selectNodeFocus(1);
			} else if (keyCode === 38) {
				this._selectNodeFocus(-1);
			} else if ((keyCode === 39) && (this.getValueInputAutocomplete())) {
				this.inputAutocompleteNode.value = cleanSpace(this.getValueInputAutocomplete());
				this.setValueInput(this.getValueInputAutocomplete());
				this.originalValue = this.getValueInputAutocomplete();
			} else {
				return false;
			}

			return true;
		},

		_selectCharCorrect: function(keyCode) {

			patron = /[a-zA-Z0-9\s]/;
			charSeleccionado = String.fromCharCode(keyCode);

			if ((patron.test(charSeleccionado)) || (keyCode === 46) || (keyCode === 8)) {
				this.focusIn = -1;

				clearTimeout(this.searchChangedTimeout);
				this.searchChangedTimeout = setTimeout(lang.hitch(this, this.emit,
					this.events.SEARCH_CHANGED, cleanSpace(this.getValueInput())), 200);
			}
		},

		_removeText: function() {

			this._reset();
			this.emit(this.events.NEW_SEARCH, this.getValueInput());
		},

		_activeRemoveText: function() {

			put(this.removeTextNode, "!hidden");
		},

		_desactiveRemoveText: function() {

			put(this.removeTextNode, ".hidden");
		},

		_createButtonSearch: function() {

			this.buttonSearchNode = put(this.domNode, "div.buttonSearch.border");
			put(this.buttonSearchNode, "i.fa.fa-search");
			this.buttonSearchNode.onclick = lang.hitch(this, this._onClickSearch);
		},

		_onClickSearch: function() {

			this._closeSuggestion();
			this._newSearch(true);
		},

		_execute: function() {

			this.lastSearch = null;

			this._search();
		},

		_search: function() {

			this._closeSuggestion();
			this._newSearch(false);
		},

		_newSearch: function(newSearch) {

			var value = this.getValueInput().trim();

			if (newSearch || this.lastSearch !== value) {
				if (!value || value.length > 1) {
					this.lastSearch = value;
					this.emit(this.events.NEW_SEARCH, value);
				}
			}
		},

		_selectNodeFocus: function(num) {

			if (this.boxSuggestionsNode.children.length !== 0) {
				if ((this.focusIn === -1)) {
					num === 1 ? this.focusIn = this.boxSuggestionsNode.firstChild :
						this.focusIn = this.boxSuggestionsNode.lastChild;
				} else {
					this.focusIn.onblur();

					if ((num === 1) && (this.boxSuggestionsNode.lastChild !== this.focusIn)) {
						this.focusIn = this.focusIn.nextSibling;
					} else if ((num === -1) && (this.boxSuggestionsNode.firstChild != this.focusIn)) {
						this.focusIn = this.focusIn.previousSibling;
					} else {
						this.focusIn = -1;
						this.setValueInput(this.originalValue);
						this._updateInputAutocomplete(this.boxSuggestionsNode.firstChild.textContent);
					}
				}

				if (this.focusIn != -1) {
					this.focusIn.focus();
				}
			}
		},

		_requestSuggestions: function(textValue) {

			this.originalValue = textValue;
			//Solicitar las sugerencias

			if (textValue.length > 1) {
				this.emit(this.events.REQUEST_SUGGESTS, this.createQuery(textValue, this.suggestFields));
			}
		},

		_addSuggestions: function(/*JSON*/ suggestions) {

			this._cleanChildrenNode(this.boxSuggestionsNode);

			var positionNode = domGeom.position(this.domNode);

			var obj = {top: positionNode.y + 'px', left: positionNode.x + 'px', width: (positionNode.w - 31) + 'px'};
			domAttr.set(this.boxSuggestionsNode, "style", obj);

			this._openSuggestion();

			tamSuggets = suggestions.length;

			for (var i = 0; i < tamSuggets; i++){
				var node = this._createSuggest(suggestions[i]);
				this._addEventsSugget(node);
			}

			if (tamSuggets === 0) {
				this._closeSuggestion();
			}

			if (this.boxSuggestionsNode.children.length !== 0) {
				this._updateInputAutocomplete(this.boxSuggestionsNode.firstChild.textContent);
			} else {
				this.inputAutocompleteNode.value = '';
			}
		},

		_updateInputAutocomplete: function(text) {

			text = cleanSpace(text);
			if (this.boxSuggestionsNode.children.length !== 0) {
				var spaceValue = '',
					i = 0;

				while (this.getValueInput().charAt(i) == ' ') {
					spaceValue += this.getValueInput().charAt(i);
					i++;
				}

				var tamValue = this.getValueInput().length - spaceValue.length;

				this.inputAutocompleteNode.value = this.getValueInput() + text.substring(tamValue, text.length);
			}
		},

		_deleteValueInputAutocomplete: function() {

			this.inputAutocompleteNode.value = '';
		},

		_createSuggest: function(item) {

			var spanNode = put(this.boxSuggestionsNode, "span.suggestion");
			spanNode.innerHTML = this._getLabelValue(item);
			return spanNode;
		},

		_getLabelValue: function(item) {

			if (typeof this.itemLabel === "function") {
				return this.itemLabel(item);
			}

			if (typeof this.itemLabel === "string") {
				if (this.itemLabel.indexOf("{") < 0) {
					return item[this.itemLabel];
				}

				return lang.replace(this.itemLabel, item);
			}

			return item;
		},

		_addEventsSugget: function(spanNode) {

			spanNode.onclick = lang.hitch(this, this._selectSuggestion, spanNode);
			spanNode.focus = lang.hitch(this, this._selectSuggetFocus, spanNode, true);
			spanNode.onblur = lang.hitch(this, this._deselectSuggetFocus, spanNode, true);
			spanNode.onmouseover = lang.hitch(this, this._selectSuggetFocus, spanNode, false);
			spanNode.onmouseout = lang.hitch(this, this._deselectSuggetFocus, spanNode, false);
		},

		_selectSuggetFocus: function(spanNode, change) {

			if (this.focusIn != -1) {
				this.focusIn.onblur();
			}

			this.focusIn = spanNode;
			put(spanNode, ".hover");

			if (change) {
				this.setValueInput(spanNode.textContent);
				this._updateInputAutocomplete(spanNode.textContent);
			}
		},

		_deselectSuggetFocus: function(spanNode, change) {

			if (change) {
				this.setValueInput(this.originalValue);
				if (this.boxSuggestionsNode.children.length !== 0) {
					this._updateInputAutocomplete(this.boxSuggestionsNode.firstChild.textContent);
				}
			}

			put(spanNode, "!hover");
		},

		_selectSuggestion: function(spanNode) {

			var value = spanNode.textContent;
			this.setValueInput(value);
			this.originalValue = value;
			this._closeSuggestion();

			this.emit(this.events.NEW_SEARCH, value);
		},

		_cleanChildrenNode: function(node) {

			while (node.firstChild) {
				node.removeChild(node.firstChild);
			}
		},

		_closeSuggestion: function() {

			this.focusIn = -1;
			this._deleteValueInputAutocomplete();
			this._cleanChildrenNode(this.boxSuggestionsNode);
			put(this.boxSuggestionsNode, ".hidden");

			this.emit(this.events.CLOSED);
		},

		_openSuggestion: function() {

			put(this.boxSuggestionsNode, "!hidden");
			this.boxSuggestionsNode.onmouseleave = lang.hitch(this, this._startTimeout, 'suggestTimeout',
				this._closeSuggestion, 800);
			this.boxSuggestionsNode.onmouseenter = lang.hitch(this, this._stopTimeout, 'suggestTimeout');
		},

		getValueInput: function() {

			return this.inputNode.value;
		},

		setValueInput: function(text) {

			this.inputNode.value = text;

			text = text.replace(/\"/g , '&#34;');
			text = text.replace(/\'/g , '&#39;');

			put(this.inputNode, '[value="' + text + '"]');
		},

		setValue: function(value) {

			this.setValueInput(value);
			this.lastSearch = value;
			this._closeSuggestion();

			if (!value) {
				this._desactiveRemoveText();
			}
		},

		getValueInputAutocomplete: function() {

			return this.inputAutocompleteNode.value;
		},

		setI18n: function(i18n){

			this.i18n = i18n;
		},

		_focusInput: function() {

		},

		_reset: function() {

			this.setValueInput('');
			this.lastSearch = '';
			this._closeSuggestion();
			this._desactiveRemoveText();
		},

		_refresh: function() {

			this.emit(this.events.NEW_SEARCH, this.getValueInput());
		}
	});
});
