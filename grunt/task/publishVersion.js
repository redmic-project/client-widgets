module.exports = function(grunt) {

	grunt.registerTask('publishVersion',
		'Publica nueva versión (--ver=newVersion)',
		function() {

		var version = grunt.option('ver'),
			tagVersion = 'v' + version;

		if (!version) {
			console.log('Es necesario pasar el identificador de la nueva versión (--ver=newVersion)');
			return;
		}

		grunt.config('shell.editVersion', {
			options: {
				callback: function(err, stdout, stderr, cb) {

					err && console.error(stderr);
					cb();
				}
			},
			command: function() {

				return [
					'npm version ' + version,
					'git push'
				].join('&&');
			}
		});

		grunt.config('gitpush.publishVersion', {
			options: {
				verbose: true,
				branch: tagVersion
			}
		});

		grunt.task.run(['shell:editVersion', 'gitpush:publishVersion']);
	});
};
