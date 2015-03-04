var Metalsmith = require("metalsmith"),
	markdown = require("metalsmith-markdown"),
	templates = require("metalsmith-templates"),
	cleanCSS = require("metalsmith-clean-css"),
	stylus = require("metalsmith-stylus"),
	coffee = require('metalsmith-coffee'),
	uglify = require('metalsmith-uglify'),
	serve = require('metalsmith-serve'),
	watch = require('metalsmith-watch');

console.log("starting build.")

Metalsmith(__dirname)
	// build the HTML files
	.use(markdown())
	.use(templates('handlebars'))
	// build the CSS files
	.use(stylus())
	.use(cleanCSS())
	// build JavaScript files
	.use(coffee())
	.use(uglify({
		removeOriginal: true
	}))
	// serve the files for testing
	.use(serve())
	.use(watch({
		livereload: true
	}))
	// perform the final build
	.build(function (error, files) {
		if (error) throw error;
		console.log("build finished.");
		// console.log(files);
	});