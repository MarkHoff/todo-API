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
	var queryParams = req.query;
	var filteredTodos = todos;
	
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	}										
	res.json(filteredTodos);
});

//GET /todos/:id

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	
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

app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var deleteTodo = _.findWhere(todos, {id: todoId});
	if(deleteTodo) {
		todos = _.without(todos, deleteTodo);
		res.json(deleteTodo);
	} else {
		return res.status(400).send();
	}
	
});

app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};
	
	if (!matchedTodo) {
		return res.status(404).send();
	}
	
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}
	
	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}
	
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
});