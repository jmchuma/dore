angular.module("doreMoviesApp", ["ngRoute", "doreMoviesApp.controllers"])
.constant("API_URLS", {movies: "/api/movies/"})

.config(function($locationProvider, $routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "partials/movie-list.html",
            controller: "MovieListCtrl"
        })
        .when("/movies", {
            templateUrl: "partials/movie-list.html",
            controller: "MovieListCtrl"
        })
        .when("/movies/edit/:id", {
            templateUrl: "partials/movie-editor.html",
            controller: "MovieEditorCtrl"
        })
        .when("/movies/new", {
            templateUrl: "partials/movie-editor.html",
            controller: "MovieEditorCtrl"
        })
        .when("/movies/:id", {
            templateUrl: "partials/movie-display.html",
            controller: "MovieDisplayCtrl"
        })
        .otherwise({redirectTo: "/"});

    $locationProvider.html5Mode(true);
});

