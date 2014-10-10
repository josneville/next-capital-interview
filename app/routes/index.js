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
			if (err){
				res.send(400, "Account Already Exists");
				return;
			}
			req.session.token = data.api_token;
			req.session.id = data.id;
			res.send(200, data.todos);
		});
	});
	
	app.post("/api/users/isLoggedIn", isLoggedIn, function(req, res){
		res.send(200);
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
			if (err){
				res.send(401, "Invalid Information");
				return;
			}
			req.session.token = data.api_token;
			req.session.id = data.id;
			res.send(200, data.todos);
		});
	});

	app.post("/api/users/logout", isLoggedIn, function(req, res){
		request({
			method: "DELETE",
			url: api_url + "/users/sign_out",
			json: {user_id: req.session.id, api_token: req.session.token}
		}, function(err, response, data){
			if (err){
				res.send(400, err);
				return;
			}
			req.session.token = "";
			req.session.id = "";
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
			url: api_url + "/users/" + req.session.id + "/todos",
			json: {user_id: req.session.id, api_token: req.session.token, todo: postTodo} 
		}, function(err, response, data){
			if (err){
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
			url: api_url + "/users/" + req.session.id + "/todos/" + postTodoId,
			json: {user_id: req.session.id, api_token: req.session.token, todo: postTodo} 
		}, function(err, response, data){
			if (err){
				res.send(400, err);	
				return;
			}
			getAll(req, res);
		});
	});
}

function isLoggedIn(req, res, next){
	if (req.session.token && req.session.id){
		return next();
	}
	res.send(401, "Not Logged In");
	return;
}

function getAll(req, res){
	request(api_url + "/users/" + req.session.id + "/todos", function(err, response, data){
		if(err){
			res.send(400, err);
			return;
		}	
		res.send(200, data);
	});
}
