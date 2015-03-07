//
// Module imports
//
var gulp = require('gulp'),
	stylus = require('gulp-stylus'),
	marked = require('gulp-marked'),
	wrap = require("gulp-wrap"),
	jade = require('gulp-jade');


//
// Task to compile stylus files
//
gulp.task('stylus', function () {
	gulp.src('src/**/*.styl')
		.pipe(stylus({
			paths: ['./lib']
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('make-template', function () {
	gulp.src('src/templates/template.jade')
		.pipe(jade())
		.pipe(gulp.dest('.build'));
})

//
// Task to compile markdown files
//
gulp.task('markdown', function () {
	gulp.src('src/**/*.md')
		.pipe(marked())
		.pipe(wrap({ src: '.build/template.html' }))
		.pipe(gulp.dest('./dist'))
		.on('error', console.error.bind(console));
});

//
// Gulp main task
//
gulp.task('default', ['stylus', 'make-template', 'markdown'])