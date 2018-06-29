module.exports = function(grunt) {

	var preBuildCmds = ['yarn install'];

	grunt.config('redmicConfig.buildModules', {
		'src/stylesheets': preBuildCmds.concat([
			'grunt addModules buildModules'
		])
	});
};
