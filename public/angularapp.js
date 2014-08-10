var app = angular.module('doreApp', []);

app.controller('mainController', function($scope, $http) {
	$http.get("./data.json")
		.success(function(response) {
			console.log(response);
			$scope.month = response.month;
			$scope.year = response.year;
			$scope.movies = response.movies;
		});
});

