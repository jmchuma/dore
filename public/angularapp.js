angular.module("DoreApp", ["ngRoute"])
.constant("API_URLS", {movies:"/api/movies/"});


angular.module("DoreApp")
.service("ProcessMovieFormService",
        ["$scope", "$http", "$routeParams", "$location",
        function($scope, $http, $routeParams, $location) {
    this.processor = function() {
        for(var i = 0; i < $scope.dates.length; i++){
            $scope.formData.dates.push($scope.dates[i].date+"T"
                    +$scope.dates[i].time+"Z"
            );
        }

        if($routeParams.id) {
            $http.put("/api/movies/"+$routeParams.id, $scope.formData)
                .success(function(res) {
                    $scope.error = false;
                    $scope.success = true;
                })
                .error(function(res) {
                    $scope.error = res;
                    $scope.sueccess = false;
                });
        } else {
            $http.post("/api/movies", $scope.formData)
                .success(function(data) {
                    $location.path("/movies/"+data._id);
                })
                .error(function(data) {
                    $scope.error = data;
                });
        }
    };
}]);


angular.module("DoreApp").config(function($locationProvider, $routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "movie-list.html",
            controller: "MovieListController"
        })
        .when("/movies", {
            templateUrl: "movie-list.html",
            controller: "MovieListController"
        })
        .when("/movies/edit/:id", {
            templateUrl: "new.html",
            controller: "AddMovieController"
        })
        .when("/movies/new", {
            templateUrl: "new.html",
            controller: "AddMovieController"
        })
        .when("/movies/:id", {
            templateUrl: "movie-detail.html",
            controller: "MovieDetailController"
        })
        .otherwise({redirectTo: "/"});

    $locationProvider.html5Mode(true);
});


angular.module("DoreApp")
.controller("MovieListController", ["$scope", "$http", "API_URLS",
        function($scope, $http, URLS) {

    // get all the movies
    $http.get(URLS.movies)
        .success(function(response) {
            console.log(response);
            $scope.movies = response;
        })
        .error(function(response) {
            console.log("Error: " + response);
        });

    $scope.deleteMovie = _deleteMovie;

    /* remove a movie from the list and from the server
     *
     * id: the move id on the server
     * index: the movie index in the local array
     */
    function _deleteMovie(id, index) {
        $http.delete(URLS.movies+id)
            .success(function(res) {
                $scope.movies.splice(index, 1);
        })
        .error(function(res) {
            console.log(res);
        });
    }
}])

.controller("AddMovieController", ["$scope", "$http", "$routeParams",
        "$location", "ProcessMovieFormService", "API_URLS",
        function($scope, $http, $routeParams, $location,
            ProcessMovieFormService, URLS) {
    // empty objects to hold the form data
    $scope.dates = [] // hold dates temporarily

    $scope.formData = {};
    $scope.formData.countries = [];
    $scope.formData.dates = [];
    $scope.formData.directors = [];
    $scope.formData.performers = [];
    $scope.formData.writers = [];

    $scope.submit = ProcessMovieFormService.processor;

    if($routeParams.id) { // edit existing movie
        $scope.deleteMovie = _deleteMovie;

        $http.get(URLS.movies+$routeParams.id)
            .success(function(res) {
                $scope.formData = res;

                var num2str = function(num) {
                    if(num < 10) return "0"+num;
                    return num;
                }

                var dateTmp;
                for(var i = 0; i < res.dates.length; i++) {
                    dateTmp = new Date(res.dates[i]);
                    $scope.dates.push({
                        date: dateTmp.getUTCFullYear()+"-"
                            +num2str(dateTmp.getUTCMonth())+"-"
                            +num2str(dateTmp.getUTCDate()),
                        time: num2str(dateTmp.getUTCHours())+":"
                            +num2str(dateTmp.getUTCMinutes())
                    });
                }
            })
            .error(function(res) {
                $scope.error = res;
            });
    }

    function _deleteMovie(id) {
        $http.delete(URLS.movies+id)
            .success(function(res) {
                $scope.formData = {};
                $location.path("/");
            })
            .error(function(res) {
                $scope.error = res;
            });
    }

}])

.controller("MovieDetailController", ["$scope", "$http", "$routeParams", "API_URLS",
        function($scope, $http, $routeParams, URLS) {
    $http.get(URLS.movies+$routeParams.id)
        .success(function(res) {
            $scope.movie = res;
        })
        .error(function(res) {
            $scope.error = res;
        });
}]);

