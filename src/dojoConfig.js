if (!lang)
	var lang = "en";

var dojoConfig = {
	locale: lang,
	baseUrl: '/',
	packages: [{
		name: "dojo",
		location: "src/dojo"
	},{
		name: "dijit",
		location: "src/dijit"
	},{
		name: "app",
		location: "src/app"
	},{
		name: "put-selector",
		location: "src/put-selector"
	},{
		name: "leaflet",
		location: "src/leaflet/dist",
		main: "leaflet"
	},{
		name: "L-areaselect",
		location: "src/leaflet-plugins/areaselect/src",
		main: "leaflet-areaselect"
	},{
		name: "proj4js",
		location: "src/proj4js/dist",
		main: "proj4"
	},{
		name: "dstore",
		location: "src/dstore"
	},{
		name: "tests",
		location: "tests"
	},{
		name: "moment",
		location: "src/moment/min",
		main: "moment.min"
	},{
		name: "deepmerge",
		location: "src/deepmerge/dist",
		main: "umd"
	}],

	deps: ["leaflet"],

	requestProvider: 'dojo/request/registry',
	parseOnLoad: false,
	selectorEngine: 'lite',
	tlmSiblingOfDojo: false
};
