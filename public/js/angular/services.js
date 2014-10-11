var TodoApp = angular.module('TodoApp.services', []);

TodoApp.factory('mainAPI', function($http){
	return {
		login: function(email, password){
			return $http({
				url: '/api/users/login',
				data: {
					'email': email,
					'password': password
				},
				method: "POST"
			})
		},
		register: function(email, password){
			return $http({
				url: '/api/users/new',
				data: {
					'email': email,
					'password': password
				},
				method: "POST"
			})
		},
		logout: function(){
			return $http({
				url: '/api/users/logout',
				method: "POST"
			})
		},
		isLoggedIn: function(){
			return $http({
				url: '/api/users/isLoggedIn',
				method: "POST"
			})
		},
		allTodos: function(){
			return $http({
				url: '/api/todos/all',
				method: "POST"
			})
		},
		newTodo: function(todo){
			return $http({
				url: '/api/todos/new',
				data: {
					'todo': todo
				},
				method: "POST"
			})
		},
		updateTodo: function(todoID, todo){
			return $http({
				url: '/api/todos/update/'+todoID,
				data: {
					'todo': todo
				},
				method: "POST"
			})
		}
	 }
});
