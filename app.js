//	summary:
//		Fichero principal de ejecución de la aplicación

// Dependencias
var express = require('express'),
	http = require('http'),
	path = require('path'),
	winston = require('winston'),

// Variables
	packageJson = require('./package.json'),
	redmicVersion = packageJson.version,

	port = process.env.PORT || 3050,

// Funciones
	exposeAppContents = function(folderName) {

		var pathOptions = {
			maxAge: 600000,
			index: false
		};

		app.use(express['static'](path.join(__dirname, folderName), pathOptions));

		var absoluteFolderName = '/' + folderName;
		app.use(absoluteFolderName, express['static'](__dirname + absoluteFolderName, pathOptions));
	},

	exposeContentsForTesting = function() {

		var testsFolderName = 'tests',
			absoluteTestsFolderName = '/' + testsFolderName;

		app.use(express['static'](path.join(__dirname, testsFolderName)));
		app.use(absoluteTestsFolderName, express['static'](path.join(__dirname, absoluteTestsFolderName)));

		var modulesFolderName = 'node_modules',
			absoluteModulesFolderName = '/' + modulesFolderName;

		app.use(express['static'](path.join(__dirname, modulesFolderName)));
		app.use(absoluteModulesFolderName, express['static'](__dirname + absoluteModulesFolderName));
	},

// Instancias
	app = express(),

	logConsoleTransport = new (winston.transports.Console)({
		level: 'silly',
		colorize: true,
		timestamp: true,
		prettyPrint: true,
		humanReadableUnhandledException: true
	}),

	logger = new (winston.Logger)({
		transports: [
			logConsoleTransport
		],
		exceptionHandlers: [
			logConsoleTransport
		],
		exitOnError: false
	});



// Logging
app.use(morgan('dev', {
	skip: function(req, res) {

		return false;
	},
	stream: {
		write: function(msg) {

			logger.info(msg.slice(0, -1));
		}
	}
}));

// Rutas
exposeAppContents('src');
exposeContentsForTesting();

// Creación y arranque de servidor
http.createServer(app).listen(port, function() {

	logger.verbose('REDMIC-Widgets v%s', redmicVersion);
	logger.verbose('Express server listening on port %d', port);
});
