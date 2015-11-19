'use strict';

module.exports = function(grunt) {

  var jsFiles = ['blooper.js'];

  grunt.initConfig({

    jshint: {
      all: {
        files: {
          src: jsFiles
        },
        options: {
          jshintrc: true
        }
      }
    },

    'babel': {
      options: {
        presets: ['es2015']
      },
      dist: {
        files: {
          'dist/blooper.js': 'blooper.js'
        }
      }
    },

    watch: {
      files: jsFiles,
      tasks: ['babel', 'jshint:all']
    },

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask('default', ['babel', 'jshint:all']);


};