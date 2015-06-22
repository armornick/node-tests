// mdoule imports --------------------------------------------------------
var sqlite = require('sqlite3').verbose();
var path = require('path');

// create database -------------------------------------------------------
var DB_FILE = path.join(process.cwd(), "videos.db");
var db = new sqlite.Database(DB_FILE);

// init database ---------------------------------------------------------
db.serialize(function () {
	db.run("CREATE TABLE IF NOT EXISTS videos (id INT PRIMARY KEY, title TEXT NOT NULL, code TEXT NOT NULL, site TEXT NOT NULL, category TEXT NOT NULL)");
	db.run("CREATE TABLE IF NOT EXISTS categories (id TEXT NOT NULL UNIQUE, description TEXT)")
});

// exported module =======================================================
var database = module.exports = {};

// get videos titles -----------------------------------------------------
database.getVideosComplete = function (callback) {
	db.serialize(function () {
		db.all("SELECT * FROM videos", function (err, rows) {
			callback(err, rows);
		});
	});
}

// get videos titles -----------------------------------------------------
database.getVideos = function (callback) {
	db.serialize(function () {
		db.all("SELECT id, title FROM videos", function (err, rows) {
			callback(err, rows);
		});
	});
}

// get video by id -------------------------------------------------------
database.getVideoById = function (id, callback) {
	db.serialize(function () {
		db.get("SELECT * FROM videos WHERE id = ?", id, function (err, row) {
			callback(err, row);
		});
	});
}

// add new video ---------------------------------------------------------
database.addVideo = function (data, callback) {
	db.serialize(function () {
		db.run("INSERT INTO videos VALUES(NULL, ?, ?, ?, ?)", 
			[data.title, data.code, data.site, data.category],
			function (err) {
				callback(err);
			});
	});
}

// get list of categories -------------------------------------------------
database.getCategories = function (callback) {
	db.serialize(function () {
		db.all("SELECT DISTINCT category FROM videos", function (err, rows) {
			callback(err, rows);
		});
	});
}

// get videos by category --------------------------------------------------
database.getVideosByCategory = function (category, callback) {
	db.serialize(function () {
		db.all("SELECT id, title FROM videos WHERE category = ?", category, function (err, rows) {
			callback(err, rows);
		});
	});
}