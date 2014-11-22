angular.module("doreMoviesApp.factories", [])

.factory("MovieFactory",
        ["$http", "$filter", "$q", "API_URLS",
        function($http, $filter, $q, URLS) {

    function Movie(data) {
        if(data) {
            this.setData(data);
        } else {
            this.countries = [];
            this.dates = [];
            this.directors = [];
            this.performers = [];
            this.writers = [];
        }
    };

    /*
     * returns promise
     */
    Movie.read = function(id) {
        return $http.get(arguments.length == 0 ? URLS.movies : URLS.movies+id);
    };

    Movie.prototype = {
        /*
         * returns promise
         */
        create: function() {
            deferred = $q.defer();
            self = this;

            $http.post(URLS.movies, this)
                .success(function(res){
                    self._id = res._id;
                    deferred.resolve(res);
                })
                .error(function(res){
                    deferred.reject(res);
                });

            return deferred.promise;
        },

        /*
         * returns promise
         */
        delete: function() {
            return $http.delete(URLS.movies+this._id);
        },

        joinDateComponents: function() {
            this.dates = this.dates.map(function(obj){
                return obj.date+"T"+obj.time+"+0100";
            });
        },

        setData: function(data) {
            angular.extend(this, data);
        },

        splitDateComponents: function() {
            this.dates = this.dates.map(function(str) {
                return {
                    date: $filter('date')(str, "yyyy-MM-dd", "+0100"),
                    time: $filter('date')(str, "HH:mm", "+0100")
                };
            });
        },

        /*
         * returns promise
         */
        update: function() {
            return $http.put(URLS.movies+this._id, this);
        }
    };

    return Movie;
}]);

