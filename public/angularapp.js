angular.module('doreApp', ['ngRoute']);


angular.module('doreApp').config(function($locationProvider, $routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "movie-list.html",
            controller: "movieListController"
        })
        .when("/movies", {
            templateUrl: "movie-list.html",
            controller: "movieListController"
        })
        .when("/movies/edit/:id", {
            templateUrl: "new.html",
            controller: "editMovieController"
        })
        .when("/movies/new", {
            templateUrl: "new.html",
            controller: "addMovieController"
        })
        .when("/movies/:id", {
            templateUrl: "movie-detail.html",
            controller: "movieDetailController"
        })
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

        $scope.delete = function(id, index) {
            $http.delete("/api/movies/"+id)
                .success(function(res) {
                    $scope.movies.splice(index, 1);
            })
            .error(function(res) {
                console.log(res);
            });
        };
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


angular.module('doreApp').controller('editMovieController', ['$scope', '$http',
         '$routeParams', '$location',
         function($scope, $http, $routeParams, $location) {
    // empty object to hold the form data
    $scope.formData = {};

    $http.get("/api/movies/"+$routeParams.id)
        .success(function(res) {
            $scope.formData = res;
        })
        .error(function(res) {
            $scope.error = res;
        });

    $scope.delete = function(id) {
        $http.delete("/api/movies/"+id)
            .success(function(res) {
                $scope.formData = {};
                $location.path('/');
            })
            .error(function(res) {
                $scope.error = res;
            });
    };

    $scope.processForm = function() {
        $http.put('/api/movies/'+$routeParams.id, $scope.formData)
            .success(function(res) {
                $scope.error = false;
                $scope.success = true;
            })
            .error(function(res) {
                $scope.error = res;
                $scope.sueccess = false;
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

