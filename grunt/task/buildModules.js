module.exports = function(grunt) {

	grunt.registerTask('buildModules',
		'Construye los submódulos git especificados con los comandos definidos para cada uno',
		function() {

		var modulesToBuild = grunt.config('redmicConfig.buildModules'),
			getCmd = function(args) {

				var module = args.modulePath,
					cmds = args.moduleCmds,
					firstCmd = 'cd ' + module,
					lastCmd = 'cd -';

				cmds.unshift(firstCmd);
				cmds.push(lastCmd);

				return cmds.join('; ');
			},
			subTasks = [];

		for (var modulePath in modulesToBuild) {
			var moduleCmds = modulesToBuild[modulePath],
				taskId = 'buildModules-' + modulePath;

			grunt.config('shell.' + taskId, {
				options: {
					stdout: true
				},
				command: getCmd.bind(null, {
					modulePath: modulePath,
					moduleCmds: moduleCmds
				})
			});

			subTasks.push('shell:' + taskId);
		}

		grunt.task.run(subTasks);
	});
};
