// set up
var bodyParser = require('body-parser')
var express = require('express');
var mongoose = require('mongoose');

var mongoUri = 'mongodb://127.0.0.1/cinedore';

// configuration
var app = express();
app.use('/', express.static(__dirname+'/public'));
app.use(bodyParser.json({extended: true}));

mongoose.connect(mongoUri);
var Movie = mongoose.model('Movie', {
    title : String,
    poster: String,
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

app.post('/api/movies', function(req, res) {
    Movie.create({
        title : req.body.title,
        poster: req.body.poster,
        directors : req.body.directors,
        writers : req.body.writers,
        performers : req.body.performers,
        countries : req.body.contries,
        runtime : req.body.runtime,
        year : req.body.year,
        vo : req.body.vo,
        sub : req.body.sub,
        dates : req.body.dates,
        dore_notes : req.body.dore_notes,
        plot : req.body.plot
        },
        function(err, movie){
            if (err) {
                res.send(400, err);
            } else {
                res.send(201, movie);
            }
        });
});

app.get('/api/movies/:movie_id', function(req, res) {
    Movie.findById(req.param('movie_id'), function(err, movie) {
        if(err) {
            res.json(err);
        } else {
            res.json(movie);
        }
    });
});


// frontend
app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});


// run server
app.listen(8888, function() {console.log('listening')});

