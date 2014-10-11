var TodoApp = angular.module('TodoApp.config', []);
TodoApp.config(function($locationProvider, $httpProvider) {
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');
});
