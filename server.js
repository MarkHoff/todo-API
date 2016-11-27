var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
var _ = require('underscore');

app.use(bodyParser.json());

//GET /todos
app.get('/todos', function(req, res) {
	res.json(todos);
});
//GET /todos/:id

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
//	var matchedTodo;
//	todos.forEach(function(todo) {
//		if (todoId === todo.id) {
//			matchedTodo = todo;
//		} 
//	});
	
	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, ['description', 'completed']);  //use _.pick to only pick description and completed
	
	
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}
	
	// set body.description t be trimmed value
	body.description = body.description.trim();
	
	// add id field
	body.id = todoNextId++;
	
	// push body into array
	todos.push(body);
	res.json(body);
	
});

app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
});