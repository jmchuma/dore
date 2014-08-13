var app = angular.module('doreApp', ['ngRoute']);


app.config(function($routeProvider) {
	$routeProvider
		.when("/", {templateUrl: "movie-list.html", controller: "mainController"})
		.when("/movies", {templateUrl: "movie-list.html", controller: "mainController"})
		.when("/movies/new", {templateUrl: "new.html", controller: "addMovieController"})
		.when("/movies/:id", {templateUrl: "movie-detail.html", controller: "movieDetailController"})
		.otherwise({redirectTo: '/'});
});


app.controller('mainController', function($scope, $http) {
	$http.get("/api/movies")
		.success(function(response) {
			console.log(response);
			//$scope.month = response.month;
			//$scope.year = response.year;
			$scope.movies = response;
		})
		.error(function(response) {
			console.log('Error: ' + response);
		});

});


app.controller('addMovieController', function($scope, $http, $location) {
    // empty object to hold the form data
    $scope.formData = {};

    $scope.processForm = function() {
        $http.post('/api/movies', $scope.formData)
            .success(function(data) {
                $location.path('/movies/'+data._id);
            })
            .error(function(data) {
                $scope.error = data;
            });
    };
});


app.controller('movieDetailController', function($scope, $http, $routeParams) {
    $http.get("/api/movies/"+$routeParams.id)
        .success(function(res) {
            $scope.movie = res;
        })
        .error(function(res) {
            $scope.error = res;
        });
});

