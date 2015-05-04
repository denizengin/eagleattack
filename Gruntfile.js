'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    clean: {
      files: ['dist']
    },
    connect: {
          dev: {
                  options: {
                      port: 9001,
                      base: '',
                      keepalive:true
                  }
          },
          release: {
                  options: {
                      port: 9002,
                      base: 'dest',
                      keepalive:true
                  }
          }
    },
    copy: {
        main: {
            files: [
                {expand: true, src: ['assets/**'], dest: 'dest/'},
                {expand: true, src: ['css/**'], dest: 'dest/'},
                {expand: true, src: ['js/lib/**'], dest: 'dest/'},
                {expand: true, src: ['index.html'], dest: 'dest/'}
            ]
        }
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        mangle: true,
        compress: true
      },
      dist: {
        src: 'js/<%= pkg.name %>.js',
        dest: 'dest/js/<%= pkg.name %>.js'
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['js/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
/*  grunt.loadNpmTasks('grunt-contrib-usemin');*/

  grunt.registerTask('default', ['clean', 'copy', 'uglify']);
};
