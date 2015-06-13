module.exports = function (app, db) {

	var Todo = require('./models/todo')(db);

	// routes  =====================================================================

	// api  ----------------------------------------------

	// get all todos
	app.get('/api/todos', function (req, res) {
		
		Todo.find(function (err, docs) {
			
			if (err) { res.send(err); };

			res.json(docs); // return todos in json format

		});

	});

	// create a new todo and return all todos
	app.post('/api/todos', function (req, res) {
		
		Todo.create({
			text: req.body.text,
			done: false
		}, function (err, todo) {
			
			if (err) { if (err) { res.send(err); }; };

			Todo.find(function (err, docs) {
				if (err) { res.send(err); };

				res.json(docs); // return todos in json format
			});

		})

	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function (req, res) {
		
		Todo.remove({
			_id: req.params.todo_id
		}, function (err, todo) {
			
			if (err) { if (err) { res.send(err); }; };

			Todo.find(function (err, docs) {
				if (err) { res.send(err); };

				res.json(docs); // return todos in json format
			});

		})

	});

	// application ---------------------------------------

	app.get('*', function (req, res) {
		res.sendfile('./public/index.html');
	});

}