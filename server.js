// set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');

var mongoUri = 'mongodb://127.0.0.1/cinedore';

// configuration
mongoose.connect(mongoUri);

app.use('/', express.static(__dirname+'/public'));


var Movie = mongoose.model('Movie', {
    title : String,
    directors : [ String ],
    writers : [ String ],
    performers : [ String ],
    countries : [ String ],
    runtime : Number,
    year : Number,
    vo : Boolean,
    sub : String,
    dates : [ Date ],
    dore_notes : String,
    plot : String
});


// API
app.get('/api/days/:day', function(req, res) {
});

app.get('/api/movies', function(req, res) {
    Movie.find(function(err, movies) {
        if (err) res.send(err);
		res.json(movies);
	});
});

app.get('/api/movies/:movie_id', function(req, res) {
});

// frontend
app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});


// run server
app.listen(8888, function() {console.log('listening')});

