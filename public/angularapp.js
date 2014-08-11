var app = angular.module('doreApp', ['ngRoute']);


app.config(function($routeProvider) {
	$routeProvider
		.when("/", {templateUrl: "movie-list.html", controller: "mainController"})
		.when("/movies", {templateUrl: "movie-list.html", controller: "mainController"})
		.otherwise({redirectTo: '/'});
});


app.controller('mainController', function($scope, $http) {
	$http.get("/api/movies")
		.success(function(response) {
			console.log(response);
			//$scope.month = response.month;
			//$scope.year = response.year;
			$scope.movies = response;
		});
});

