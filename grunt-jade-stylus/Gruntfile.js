

module.exports = function(grunt) {

  // project configuration
  grunt.initConfig({

  	pkg: grunt.file.readJSON('package.json'),

  	stylus: {
  		compile: {

  			options: {
  				paths: ['lib'],
  				compress: false
  			},

  			files: {
  				"dist/css/test01.css": "src/css/test01.styl"
  			}

  		}
  		
  	},

  	watch: {
      scripts : {
        files: ['src/**/*.styl', 'src/templates/template.jade', 'src/**/*.md'],
        tasks: ['stylus', 'jade', 'markdown']
      }
  	},

    jade: {
      compile: {
        options: {
          data: {
            pretty: false
          }
        },
        files: {
          ".build/template.html": "src/templates/template.jade"
        }
      }
    },

    markdown: {
      all: {
        files: [
          {
            expand: true,
            src: "src/**/*.md",
            dest: "dist/",
            ext: ".html",
            rename: function (dest, src) {
              return src.replace('src/', dest);
            }
          }
        ],

        options: {
          template: '.build/template.html'
        }
      }
    },

    clean: {
      dev: ['.build'],
      output: ['dist']
    }

  });


  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-markdown');
  grunt.loadNpmTasks('grunt-contrib-clean');


  // Default task(s)
  grunt.registerTask('default', ['stylus', 'jade', 'markdown', 'clean:dev']);

};