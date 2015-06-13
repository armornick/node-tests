// module imports  =============================================================

var express = require('express'),
	Datastore = require('nedb'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

// set up objects  =============================================================

var app = express(),
	db = new Datastore({ filename: 'data/todo.db', autoload: true });

// configuration  ==============================================================

app.use(express.static(__dirname + '/public'));  // serve static files
app.use(morgan('dev'));  // log requests to console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// routes  =====================================================================

require('./app/routes')(app, db);

// launch application  =========================================================

app.listen(8080);
console.log('application listening on port 8080');