var TodoApp = angular.module('TodoApp.controllers', []);

TodoApp.controller('main', function($scope, $http, $window, $location){

});

TodoApp.controller('login', function($scope, $http, $window, $location, mainAPI){
	mainAPI.isLoggedIn()
		.success(function(data, status, headers, config){
			$location.path('/todos');
		});
	$scope.registration = false;
	$scope.userForm = {};
	$scope.signinFail = false;
	$scope.registerFail = false;
	$scope.switch = function(){
		$scope.registration = !$scope.registration;
		$scope.signinFail = false;
		$scope.registerFail = false;
		if ($scope.registration){
			$("#signinButton").text("Register");
			$("#switchOption").text("Already have an account? Sign in here!");
			$("#loginHeader").text("Please Register");
		}
		else{
			$("#signinButton").text("Sign In");
			$("#switchOption").text("Don't have an account? Register here!");
			$("#loginHeader").text("Please Sign In");
		}
	}
	$scope.submitForm = function(){
		if ($scope.registration){
			mainAPI.register($scope.userForm.email, $scope.userForm.password)
				.success(function(data, status, headers, config){
					$location.path('/todos');
				})
				.error(function(data, status, headers, config){
					$scope.registerFail = true;
				});
		}
		else{
			mainAPI.login($scope.userForm.email, $scope.userForm.password)
				.success(function(data, status, headers, config){
					$location.path('/todos');
				})
				.error(function(data, status, headers, config){
					$scope.signinFail = true;
				});
		}
	}
});

TodoApp.controller('todos', function($scope, $http, $window, $location, mainAPI){
	mainAPI.isLoggedIn()
		.success(function(data, status, headers, config){
			$scope.email = data;
		})
		.error(function(data, status, headers, config){
			$location.path('/');
		});
	mainAPI.allTodos()
		.success(function(data, status, headers, config){
			$scope.todos = data;
		});
	$scope.signout = function(){
		mainAPI.logout()
			.success(function(data, status, headers, config){
				$location.path('/');
			})
			.error(function( data, status, headers, config){
				$location.path('/');
			});
	}

	$scope.addTodo = function(){
		if ($scope.newTodo){
			mainAPI.newTodo({"description": $scope.newTodo})
				.success(function(data, status, headers, config){
					$scope.todos = data;
				})
		}
	}
});
