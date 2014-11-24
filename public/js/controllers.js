angular.module("doreMoviesApp.controllers", [])

.controller("MovieDisplayCtrl",
        ["$scope", "$routeParams", "MovieFactory",
        function($scope, $routeParams, Movie) {

    Movie.read($routeParams.id).then(
        function(res) {
            $scope.movie = new Movie(res.data);
        },
        function(res) {
            $scope.error = res;
        }
    );
}])

.controller("MovieEditorCtrl",
        ["$scope", "$routeParams", "$location", "MovieFactory",
        function($scope, $routeParams, $location, Movie) {

    if($routeParams.id) { // edit existing movie
        Movie.read($routeParams.id).then(
            function(res) {
                $scope.movie = new Movie(res.data);
                $scope.movie.splitDateComponents();
                $scope.deleteMovie = _deleteMovie;
            },
            function(res) {
                $scope.error = res;
            }
        );
    } else {
        $scope.movie = new Movie();
    }

    $scope.submit = _submit;

    function _deleteMovie() {
        $scope.movie.delete().then(
            function(res) {
                $location.path("/");
            },
            function(res) {
                $scope.error = res;
            }
        );
    };

    function _submit() {
        if($scope.movieForm.$invalid) {
            $scope.error = "Invalid form. Review the data.";
            return;
        };

        data = angular.copy($scope.movie);
        data.joinDateComponents();

        var req = data._id ? data.update() : data.create();
        req.then(
            function() {
                $location.path("/movies/"+data._id);
            },
            function(res) {
                $scope.error = res;
            }
        );
    };
}])

.controller("MovieListCtrl", ["$scope", "MovieFactory",
        function($scope, Movie) {

    Movie.read().then(
        function(res) {
            $scope.movies = res.data.map(function(json) {
                return new Movie(json);
            });
        },
        function(res) {
            console.log("Error: " + res);
        }
    );

    $scope.deleteMovie = _deleteMovie;

    /* remove a movie from the list and from the server
     *
     * index: the movie index in the local array
     */
    function _deleteMovie(index) {
        $scope.movies[index].delete().then(
            function(res){
                $scope.movies.splice(index, 1);
            },
            function(res){
                console.log(res);
            }
        );
    };
}]);

