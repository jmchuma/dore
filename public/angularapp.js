'use strict';

angular.module('doreApp', ['ngRoute']);


angular.module('doreApp')
.service('ArrayManagerService', function() {
    this.add = function(set, elem) {
        set.push(elem);
    };
    this.remove = function(set, index) {
        set.splice(index, 1);
    };
});


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
        '$location', 'ArrayManagerService',
        function($scope, $http, $location, ArrayManagerService) {
    // empty objects to hold the form data
    $scope.dates = {} // hold dates temporarily

    $scope.formData = {};
    $scope.formData.countries = [];
    $scope.formData.dates = [];
    $scope.formData.directors = [];
    $scope.formData.performers = [];
    $scope.formData.writers = [];

    $scope.addElement = ArrayManagerService.add;
    $scope.removeElement = ArrayManagerService.remove;

    $scope.processForm = function() {
        $scope.formData.dates.push($scope.dates.date+'T'
                +$scope.dates.time+'Z'
        );

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
         '$routeParams', '$location', 'ArrayManagerService',
         function($scope, $http, $routeParams, $location, ArrayManagerService) {
    // empty object to hold the form data
    $scope.formData = {};
    $scope.dates = {};
    $scope.formData.countries = [];
    $scope.formData.dates = [];
    $scope.formData.directors = [];
    $scope.formData.performers = [];
    $scope.formData.writers = [];

    $scope.addElement = ArrayManagerService.add;
    $scope.removeElement = ArrayManagerService.remove;

    $http.get("/api/movies/"+$routeParams.id)
        .success(function(res) {
            $scope.formData = res;
            var dateTmp = new Date($scope.formData.dates[0]);

            var a = function(num) {
                if(num < 10) return '0'+num;
                return num;
            }

            $scope.dates.date = dateTmp.getUTCFullYear()
                +'-'+a(dateTmp.getUTCMonth())
                +'-'+a(dateTmp.getUTCDate());
            $scope.dates.time = a(dateTmp.getUTCHours())
                +':'+a(dateTmp.getUTCMinutes());
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
        $scope.formData.dates.push($scope.dates.date+'T'
                +$scope.dates.time+'Z'
        );

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

