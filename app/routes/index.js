var api_url = require("../../config").api_url;
var request = require("request");
module.exports = function(app){
	app.post("/api/users/new", function(req, res){
		var postEmail = req.body.email;
		var postPassword = req.body.password;
		if (!postEmail || !postPassword){
			res.send(400, "Not enough information");
			return;
		}
		request({
			method: "POST",
			url: api_url + "/users",
			json: {email: postEmail, password: postPassword}
		}, function(err, response, data){
			console.log(data);
			if (err || data.email[0] === 'has already been taken'){
				res.send(400, "Account Already Exists");
				return;
			}
			req.session.token = data.api_token;
			req.session.user_id = data.id;
			req.session.email = data.email;
			res.send(200, data.todos);
		});
	});

	app.post("/api/users/isLoggedIn", isLoggedIn, function(req, res){
		res.send(200, req.session.email);
	});

	app.post("/api/users/login", function(req, res){
		var postEmail = req.body.email;
		var postPassword = req.body.password;
		if (!postEmail || !postPassword){
			res.send(400, "Not enough information");
			return;
		}
		request({
			method: "POST",
			url: api_url + "/users/sign_in",
			json: {email: postEmail, password: postPassword}
		}, function(err, response, data){
			if (err || data.error){
				res.send(401, "Invalid Information");
				return;
			}
			console.log(data);
			req.session.token = data.api_token;
			req.session.user_id = data.id;
			req.session.email = data.email;
			res.send(200, data.todos);
		});
	});

	app.post("/api/users/logout", isLoggedIn, function(req, res){
		request({
			method: "DELETE",
			url: api_url + "/users/sign_out",
			json: {user_id: req.session.user_id, api_token: req.session.token}
		}, function(err, response, data){
			if (err){
				res.send(400, err);
				return;
			}
			req.session.token = "";
			req.session.user_id = "";
			req.session.email = "";
			res.send(200, "Signout successful");
		});
	});

	app.post("/api/todos/all", isLoggedIn, getAll);

	app.post("/api/todos/new", isLoggedIn, function(req, res){
		var postTodo = req.body.todo;
		if (!postTodo || !postTodo.description){
			res.send(400, "Not enough information");
			return;
		}
		request({
			method: "POST",
			url: api_url + "/users/" + req.session.user_id + "/todos",
			json: {user_id: req.session.user_id, api_token: req.session.token, todo: postTodo}
		}, function(err, response, data){
			if (err || data.error){
				res.send(400, err);
				return;
			}
			getAll(req, res);
		});
	});

	app.post("/api/todos/update/:todo_id", isLoggedIn, function(req, res){
		var postTodo = req.body.todo;
		var postTodoId = req.params.todo_id;
		if (!postTodo || !postTodoId){
			res.send(400, "Not enough information");
			return;
		}
		request({
			method: "PUT",
			url: api_url + "/users/" + req.session.user_id + "/todos/" + postTodoId,
			json: {user_id: req.session.user_id, api_token: req.session.token, todo: postTodo}
		}, function(err, response, data){
			if (err || data.error){
				res.send(400, err);
				return;
			}
			getAll(req, res);
		});
	});
}

function isLoggedIn(req, res, next){
	if (req.session.token && req.session.user_id){
		return next();
	}
	res.send(401, "Not Logged In");
	return;
}

function getAll(req, res){
	request(api_url + "/users/" + req.session.user_id + "/todos.json?api_token="+req.session.token, function(err, response, data){
		if(err || data.error){
			res.send(400, err);
			return;
		}
		res.send(200, data);
	});
}
