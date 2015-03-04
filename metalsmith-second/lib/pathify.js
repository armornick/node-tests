//
// Metalsmith plugin to add 'path' metadata to files
//
module.exports = function (options) {
	
	return function (files, metalsmith, done) {
		
		Object.keys(files).forEach(function (file) {
			// console.log(file);
			files[file].path = file;
		});

		// var metadata = metalsmith.metadata(),
			// collections = metadata.collections;
		// console.log(collections);

		done();

	}

};