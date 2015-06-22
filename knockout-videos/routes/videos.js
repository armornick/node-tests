var express = require('express');
var router = express.Router();

var db = require('./database');

function JsonReturnHandler (res) {
	return function (err, data) {
		if (err) {
			res.sendStatus(400);
		} else {
			res.json(data);
		}
	}
}

function StatuscodeReturnHandler (res) {
	return function (err) {
		if (err) {
			res.sendStatus(400);
		} else {
			res.sendStatus(200);
		}
	}
}


/* GET video listing. */
router.get('/videos', function(req, res, next) {
	db.getVideos(JsonReturnHandler(res));
});

/* GET complete video data. */
router.get('/videos/all', function(req, res, next) {
	db.getVideosComplete(JsonReturnHandler(res));
});

/* GET video information. */
router.get('/video/:id', function(req, res, next) {
	db.getVideoById(req.params.id, JsonReturnHandler(res));
});

/* POST add new video. */
router.post('/video/add', function (req, res, next) {
	var data = req.body;
	console.log(data);
	db.addVideo(data, StatuscodeReturnHandler(res));
});

/* GET list of categories */
router.get('/categories', function (req, res, next) {
	db.getCategories(JsonReturnHandler(res));
});

module.exports = router;
