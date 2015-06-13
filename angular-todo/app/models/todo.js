
// Configuration
var KIND_NAME = 'Todo';

// DAO Constructor
function TodoDao (db) {
	this.db = db;
}

// fetch all Objects
TodoDao.prototype.find = function(callback) {
	this.db.find({ kind: KIND_NAME }, function (err, docs) {
		callback(err, docs);
	});
};

// create new Object
TodoDao.prototype.create = function(obj, callback) {
	// register 'table name'
	obj.kind = KIND_NAME;

	this.db.insert(obj, function (err, newObj) {
		callback(err, newObj);
	});
};

// remove Object
TodoDao.prototype.remove = function(query, callback) {
	this.db.remove(query, callback);
};

// export function
module.exports = function (db) {
	
	return new TodoDao(db);

}