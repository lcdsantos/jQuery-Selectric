module.exports = function(grunt) {

	// 1. All configuration goes here
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			options: {
				banner: '/*! Selectric ϟ v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>) - git.io/tjl9sQ - Copyright (c) 2013 Leonardo Santos - Dual licensed: MIT/GPL */\n'
			},
			build: {
				src: 'js/jquery.selectric.js',
				dest: 'js/jquery.selectric.min.js'
			}
		}

	});

	// 3. Where we tell Grunt we plan to use this plug-in.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
	grunt.registerTask('default', ['uglify']);

};
