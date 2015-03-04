var Metalsmith = require("metalsmith"),
	markdown = require("metalsmith-markdown"),
	less = require("metalsmith-less"),
	templates = require("metalsmith-templates"),
	serve = require('metalsmith-serve'),
	watch = require('metalsmith-watch'),
	collections = require('metalsmith-collections'),
	pathify = require('./lib/pathify.js');

console.log("build starting.")

Metalsmith(__dirname)
	.metadata(require("./config.json"))
	.use(collections({
		posts: 'posts/*.md'
	}))
	.use(markdown())
	.use(less())
	.use(pathify())
	.use(templates('jade'))
	.use(serve())
	.use(watch({
		livereload: true
	}))
	.build(function (error, files) {
		if (error) throw error;
		console.log("build finished.");
		// console.log(files);
	});
