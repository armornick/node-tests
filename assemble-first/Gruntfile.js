module.exports = function (grunt) {
	
	//
	// Configure grunt tasks
	//
	grunt.initConfig({

		// load package.json
		pkg: grunt.file.readJSON('package.json'),

		// copy scripts to output directory
		copy: {
			scripts: {
				src: ['lib/scripts/*'],
				dest: 'dist/js/'
			}
		},

		// compile stylus files
		stylus: {
			bootstrap: {
				options: {
					paths: ['lib/styles'],
					urlfunc: 'embedurl'
				},
				files: {
					'dist/css/bootstrap.min.css': 'src/styles/bootstrap.styl'
				}
			}
		},

		// assemble pages
		assemble: {
			options: {
				layoutdir: 'src/templates',
				flatten: true
			},

			pages: {
				options: {
					layout: 'page-layout.hbs'
				},
				files: {
					'dist/': ['src/pages/*.hbs']
				}
			}
		},

		// connect preview server
		connect: {
			server: {
				options: {
					port: 8080,
					base: 'dist'
				}
			}
		},

		// watch files for changes
		watch: {
			options: {
				livereload: true
			},

			pages: {
				files: ['src/pages/*.hbs', 'src/templates/*.hbs'],
				tasks: ['assemble']
			},

			styles: {
				files: 'src/styles/*.styl',
				tasks: ['stylus']
			}
		}

	});

	//
	// Load grunt plugins
	//
	grunt.loadNpmTasks('assemble');
	// grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-watch');

	//
	// Register default tasks
	//
	grunt.registerTask('build', ['copy', 'stylus', 'assemble'])
	grunt.registerTask('default', ['build', 'connect', 'watch']);

}