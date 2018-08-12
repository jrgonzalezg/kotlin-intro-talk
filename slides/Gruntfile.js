/* global module:false */
module.exports = function(grunt) {
	var port = grunt.option('port') || 8000;
	var root = grunt.option('root') || '.';

	if (!Array.isArray(root)) root = [root];

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner:
				'/*!\n' +
				' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
				' * http://revealjs.com\n' +
				' * MIT licensed\n' +
				' *\n' +
				' * Copyright (C) 2018 Hakim El Hattab, http://hakim.se\n' +
				' */'
		},

		qunit: {
			files: [ 'reveal.js/test/*.html' ]
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n',
				ie8: true
			},
			build: {
				src: 'reveal.js/js/reveal.js',
				dest: 'reveal.js/js/reveal.min.js'
			}
		},

		sass: {
			core: {
				src: 'reveal.js/css/reveal.scss',
				dest: 'reveal.js/css/reveal.css'
			},
			themes: {
				expand: true,
				cwd: 'reveal.js/css/theme/source',
				src: ['*.sass', '*.scss'],
				dest: 'reveal.js/css/theme',
				ext: '.css'
			}
		},

		autoprefixer: {
			core: {
				src: 'reveal.js/css/reveal.css'
			}
		},

		cssmin: {
			options: {
				compatibility: 'ie9'
			},
			compress: {
				src: 'reveal.js/css/reveal.css',
				dest: 'reveal.js/css/reveal.min.css'
			}
		},

		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				esnext: true,
				latedef: 'nofunc',
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				globals: {
					head: false,
					module: false,
					console: false,
					unescape: false,
					define: false,
					exports: false
				}
			},
			files: [ 'Gruntfile.js', 'reveal.js/js/reveal.js' ]
		},

		connect: {
			server: {
				options: {
					port: port,
					base: root,
					livereload: true,
					open: true,
					useAvailablePort: true
				}
			}
		},

		zip: {
			bundle: {
				src: [
					'index.html',
					'reveal.js/css/**',
					'reveal.js/js/**',
					'reveal.js/lib/**',
					'images/**',
					'reveal.js/plugin/**',
					'**.md'
				],
				dest: 'reveal-js-presentation.zip'
			}
		},

		watch: {
			js: {
				files: [ 'Gruntfile.js', 'reveal.js/js/reveal.js' ],
				tasks: 'js'
			},
			theme: {
				files: [
					'reveal.js/css/theme/source/*.sass',
					'reveal.js/css/theme/source/*.scss',
					'reveal.js/css/theme/template/*.sass',
					'reveal.js/css/theme/template/*.scss',
					'css/theme/custom.css'
				],
				tasks: 'css-themes'
			},
			css: {
				files: [ 'reveal.js/css/reveal.scss' ],
				tasks: 'css-core'
			},
			html: {
				files: root.map(path => path + '/*.html')
			},
			markdown: {
				files: root.map(path => path + '/*.md')
			},
			options: {
				livereload: true
			}
		},

		retire: {
			js: ['reveal.js/js/reveal.js', 'reveal.js/lib/js/*.js', 'reveal.js/plugin/**/*.js'],
			node: ['.']
		}

	});

	// Dependencies
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-autoprefixer' );
	grunt.loadNpmTasks( 'grunt-retire' );
	grunt.loadNpmTasks( 'grunt-sass' );
	grunt.loadNpmTasks( 'grunt-zip' );

	// Default task
	grunt.registerTask( 'default', [ 'css', 'js' ] );

	// JS task
	grunt.registerTask( 'js', [ 'jshint', 'uglify', 'qunit' ] );

	// Theme CSS
	grunt.registerTask( 'css-themes', [ 'sass:themes' ] );

	// Core framework CSS
	grunt.registerTask( 'css-core', [ 'sass:core', 'autoprefixer', 'cssmin' ] );

	// All CSS
	grunt.registerTask( 'css', [ 'sass', 'autoprefixer', 'cssmin' ] );

	// Package presentation to archive
	grunt.registerTask( 'package', [ 'default', 'zip' ] );

	// Serve presentation locally
	grunt.registerTask( 'serve', [ 'connect', 'watch' ] );

	// Run tests
	grunt.registerTask( 'test', [ 'jshint', 'qunit' ] );

};
