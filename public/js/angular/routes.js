var TodoApp = angular.module('TodoApp.routes', ['ngRoute']);

TodoApp.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : '/partials/login.html',
		controller : 'login'
	}).when('/todos', {
		templateUrl : '/partials/todos.html',
		controller : 'todos'
	});
});
