module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      main: {
        src: 'src/jquery.selectric.js',
        dest: 'dist/jquery.selectric.js'
      }
    },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '\/*!\r\n *         ,\/\r\n *       ,\'\/\r\n *     ,\' \/\r\n *   ,\'  \/_____,\r\n * .\'____    ,\'\r\n *      \/  ,\'\r\n *     \/ ,\'\r\n *    \/,\'\r\n *   \/\'\r\n *\r\n * Selectric \u03DE v<%= pkg.version %> - http:\/\/lcdsantos.github.io\/jQuery-Selectric\/\r\n *\r\n * Copyright (c) <%= grunt.template.today("yyyy") %> Leonardo Santos; Dual licensed: MIT\/GPL\r\n *\r\n *\/\n',
          linebreak: true
        },
        files: {
          src: 'dist/jquery.selectric.js'
        }
      }
    },

    uglify: {
      build: {
        options: {
          report: 'gzip',
          banner: '/*! Selectric ϟ v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>) - git.io/tjl9sQ - Copyright (c) <%= grunt.template.today("yyyy") %> Leonardo Santos - Dual licensed: MIT/GPL */\n'
        },
        files: {
          'dist/jquery.selectric.min.js': ['src/jquery.selectric.js']
        }
      }
    },

    jquerymanifest: {
      options: {
        source: grunt.file.readJSON('package.json'),
        overrides: {
          name: "selectric",
          title: "jQuery Selectric",
          author: {
            name: "Leonardo Santos",
            email: "leocs.1991@gmail.com"
          },
          keywords: [ "select", "selectbox", "dropdown", "form", "input", "ui" ],
          description: "Fast, simple and light jQuery plugin to customize HTML selects",
          licenses: [
            {
              type: "MIT",
              url: "http://opensource.org/licenses/MIT"
            },
            {
              type: "GPL-3.0",
              url: "http://opensource.org/licenses/GPL-3.0"
            }
          ],
          bugs: "https://github.com/lcdsantos/jQuery-Selectric/issues",
          homepage: "http://lcdsantos.github.io/jQuery-Selectric/",
          docs: "http://lcdsantos.github.io/jQuery-Selectric/",
          demo: "http://lcdsantos.github.io/jQuery-Selectric/demo.html",
          dependencies: {
            "jquery": ">=1.7"
          }
        }
      }
    },

    sass: {
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'dist/selectric.css': 'src/selectric.scss'
        }
      }
    },

    cssbeautifier: {
      options : {
        indent: '  '
      },
      files : ['dist/selectric.css']
    }
  });

  // Javascript
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jquerymanifest');

  // CSS
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-cssbeautifier');

  grunt.registerTask('default', ['copy', 'usebanner', 'uglify', 'sass', 'cssbeautifier', 'jquerymanifest']);

};
