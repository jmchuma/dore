var app = angular.module('doreMovies.controllers', []);

app.controller('mainController', function($scope, $http) {
	$http.get("./movies.json")
		.success(function(response) {
			$scope.stuff = response.month;
		});
});

