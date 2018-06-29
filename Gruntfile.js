module.exports = function(grunt) {

	var glob = require('glob'),
		path = require('path');

	// Lee todas las tareas presentes como dependencias
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		redmicConfig: {},
		pkg: grunt.file.readJSON('package.json')
	});

	// Lee los ficheros con configuraciones para las tareas a ejecutar (propias o de terceros)
	glob.sync('./grunt/config/*.js').forEach(function(file) {

		require(path.resolve(file))(grunt);
	});

	// Lee los ficheros con las tareas propias a ejecutar
	grunt.loadTasks('./grunt/task');

	grunt.registerTask('default', ['build']);
};
