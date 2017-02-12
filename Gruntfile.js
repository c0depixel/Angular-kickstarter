module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-include-source');

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn'
  });

  // Configurable paths for the application
  var appConfig = {
    ngApp: 'angular',
    app: 'app',
    dist: 'www'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    app: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      includeSource: {
        files: ['<%= app.app %>/index.html'], // '<%= app.app %>/scripts/**/*.js'
        tasks: ['includeSource:server']
      },
      js: {
        files: ['<%= app.app %>/scripts/**/*.js'],
        tasks: ['newer:jshint:all', 'newer:jscs:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/**/*.js'],
        tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
      },
      sass: {
        files: ['<%= app.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'postcss']
      },
      ngtemplates: {
        files: ['<%= app.app %>/views/**/*.html'],
        tasks: ["ngtemplates:server"]
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= app.app %>/index.html',
          '<%= app.app %>/views/**/*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= app.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },


    includeSource: {
      options: {
        basePath: 'app',
        baseUrl: ''
      },
      server: {
        files: {
          '.tmp/index.html': '<%= app.app %>/index.html'
        }
      },
      dist: {
        files: {
          '<%= app.dist %>/index.html': '<%= app.app %>/index.html'
        }
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= app.dist %>'
        }
      }
    },


    // Make sure there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= app.app %>/scripts/**/*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/**/*.js']
      }
    },

    // Make sure code styles are up to par
    jscs: {
      options: {
        config: '.jscsrc',
        verbose: true
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= app.app %>/scripts/**/*.js'
        ]
      },
      test: {
        src: ['test/spec/**/*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= app.dist %>/{,*/}*',
            '!<%= app.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          require('autoprefixer-core')({browsers: ['last 1 version']})
        ]
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= app.app %>/index.html'],
        ignorePath: /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath: /\.\.\//,
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      },
      sass: {
        src: ['<%= app.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        includePaths: [
          'bower_components'
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app.app %>/styles',
          src: ['*.scss'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= app.app %>/styles',
          src: ['*.scss'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= app.dist %>/scripts/{,*/}*.js',
          '<%= app.dist %>/styles/{,*/}*.css',
          '<%= app.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= app.dist %>/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= app.dist %>/index.html',
      options: {
        dest: '<%= app.dist %>'
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= app.dist %>/{,*/}*.html'],
      css: ['<%= app.dist %>/styles/{,*/}*.css'],
      js: ['<%= app.dist %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= app.dist %>',
          '<%= app.dist %>/images',
          '<%= app.dist %>/styles'
        ],
        patterns: {
          js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
        }
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= app.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= app.dist %>/scripts/scripts.js': [
    //         '<%= app.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= app.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= app.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= app.dist %>',
          src: ['*.html'],
          dest: '<%= app.dist %>'
        }]
      }
    },

    ngtemplates: {
      dist: {
        options: {
          module: '<%= app.ngApp %>',
          htmlmin: '<%= htmlmin.dist.options %>',
          usemin: 'scripts/scripts.js'
        },
        cwd: '<%= app.app %>',
        src: 'views/**/*.html',
        dest: '.tmp/templateCache.js'
      },
      server: {
        options: {
          module: '<%= app.ngApp %>',
          htmlmin: '<%= htmlmin.dist.options %>'
        },
        cwd: '<%= app.app %>',
        src: 'views/**/*.html',
        dest: '.tmp/templateCache.js'
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= app.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= app.app %>',
          dest: '<%= app.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*',
            'scripts/index.js'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= app.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= app.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'sass:server',
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'sass',
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'www') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'includeSource:server',
      'wiredep',
      'concurrent:server',
      'postcss:server',
      'ngtemplates:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'postcss',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'includeSource:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'ngtemplates:dist',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'newer:jscs',
    'build'
  ]);
};
