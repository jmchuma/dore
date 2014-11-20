angular.module("doreMoviesApp.controllers", [])
.controller("MovieDisplayCtrl",
        ["$scope", "$http", "$routeParams", "API_URLS",
        function($scope, $http, $routeParams, URLS) {

    $http.get(URLS.movies+$routeParams.id)
        .success(function(res) {
            $scope.movie = res;
        })
        .error(function(res) {
            $scope.error = res;
        });
}])

.controller("MovieEditorCtrl",
        ["$scope", "$http", "$routeParams", "$filter", "$location", "API_URLS",
        function($scope, $http, $routeParams, $filter, $location, URLS) {

    $scope.formData = {};
    $scope.formData.countries = [];
    $scope.formData.dates = [];
    $scope.formData.directors = [];
    $scope.formData.performers = [];
    $scope.formData.writers = [];

    $scope.submit = _submit;

    if($routeParams.id) { // edit existing movie
        $scope.deleteMovie = _deleteMovie;

        $http.get(URLS.movies+$routeParams.id)
            .success(function(res) {
                res.dates = res.dates.map(function(str) {
                    return {
                        date: $filter('date')(str, "yyyy-MM-dd", "+0100"),
                        time: $filter('date')(str, "HH:mm", "+0100")
                    };
                });
                $scope.formData = res;
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

    function _submit() {
        if($scope.movieForm.$invalid) {
            $scope.error = "Invalid form. Review the data.";
            return;
        };

        data = angular.copy($scope.formData);
        data.dates = data.dates.map(function(obj){
            return obj.date+"T"+obj.time+"+0100";
        });

        var req = $routeParams.id ? $http.put(URLS.movies+$routeParams.id, data)
                                  : $http.post(URLS.movies, data)
        req.then(_submitSuccess, _submitError);
    }

    function _submitError(res) {
        $scope.error = res;
    }

    function _submitSuccess(res) {
        if(res.data._id)
            $location.path("/movies/"+res.data._id);
        else
            $location.path("/movies/"+$routeParams.id);
    }

}])

.controller("MovieListCtrl", ["$scope", "$http", "API_URLS",
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
}]);

