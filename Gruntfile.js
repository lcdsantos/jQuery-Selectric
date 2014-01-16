module.exports = function(grunt) {

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

	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['uglify']);

};
