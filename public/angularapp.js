angular.module('doreApp', ['ngRoute']);


angular.module('doreApp').config(function($locationProvider, $routeProvider) {
	$routeProvider
		.when("/", {templateUrl: "movie-list.html", controller: "movieListController"})
		.when("/movies", {templateUrl: "movie-list.html", controller: "movieListController"})
		.when("/movies/new", {templateUrl: "new.html", controller: "addMovieController"})
		.when("/movies/:id", {templateUrl: "movie-detail.html", controller: "movieDetailController"})
		.otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);
});


angular.module('doreApp').controller('movieListController', ['$scope', '$http',
        function($scope, $http) {
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

}]);


angular.module('doreApp').controller('addMovieController', ['$scope', '$http',
        '$location', function($scope, $http, $location) {
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
}]);


angular.module('doreApp').controller('movieDetailController', ['$scope',
        '$http', '$routeParams', function($scope, $http, $routeParams) {
    $http.get("/api/movies/"+$routeParams.id)
        .success(function(res) {
            $scope.movie = res;
        })
        .error(function(res) {
            $scope.error = res;
        });
}]);

