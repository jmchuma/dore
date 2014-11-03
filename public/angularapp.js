"use strict";

angular.module("doreApp", ["ngRoute"]);


angular.module("doreApp")
.service("ArrayManagerService", function() {
    this.add = function(set, elem) {
        set.push(elem);
    };
    this.remove = function(set, index) {
        set.splice(index, 1);
    };
})

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


angular.module("doreApp").config(function($locationProvider, $routeProvider) {
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
            controller: "addMovieController"
        })
        .when("/movies/new", {
            templateUrl: "new.html",
            controller: "addMovieController"
        })
        .when("/movies/:id", {
            templateUrl: "movie-detail.html",
            controller: "movieDetailController"
        })
        .otherwise({redirectTo: "/"});

    $locationProvider.html5Mode(true);
});


angular.module("doreApp").controller("movieListController", ["$scope", "$http",
        function($scope, $http) {
    $http.get("/api/movies")
        .success(function(response) {
            console.log(response);
            $scope.movies = response;
        })
        .error(function(response) {
            console.log("Error: " + response);
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
}])

.controller("addMovieController", ["$scope", "$http", "$routeParams",
        "$location", "ArrayManagerService", "ProcessMovieFormService",
        function($scope, $http, $routeParams, $location,
            ArrayManagerService, ProcessMovieFormService) {
    // empty objects to hold the form data
    $scope.dates = [] // hold dates temporarily

    $scope.formData = {};
    $scope.formData.countries = [];
    $scope.formData.dates = [];
    $scope.formData.directors = [];
    $scope.formData.performers = [];
    $scope.formData.writers = [];

    $scope.addElement = ArrayManagerService.add;
    $scope.removeElement = ArrayManagerService.remove;

    $scope.processForm = ProcessMovieFormService.processor;

    if($routeParams.id) { // edit existing movie
        $http.get("/api/movies/"+$routeParams.id)
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

        $scope.delete = function(id) {
            $http.delete("/api/movies/"+id)
                .success(function(res) {
                    $scope.formData = {};
                    $location.path("/");
                })
                .error(function(res) {
                    $scope.error = res;
                });
        };
    }
}])

.controller("movieDetailController", ["$scope", "$http", "$routeParams",
        function($scope, $http, $routeParams) {
    $http.get("/api/movies/"+$routeParams.id)
        .success(function(res) {
            $scope.movie = res;
        })
        .error(function(res) {
            $scope.error = res;
        });
}]);

