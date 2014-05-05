var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');

var Mongolian = require('mongolian');
var server, db;

if(process.env.MONGOHQ_URL) {
  db = new Mongolian(process.env.MONGOHQ_URL);
} else {
  server = new Mongolian;
  db = server.db('localhost:27017/test1');
}

/* mongo.connect(process.env.MONGOLAB_URI, {}, function(error, db){
  db.addListener("error", function(error){
    console.log("error connecting to MongoLab");
  });
}); */

/*var server = new Server('ds037358.mongolab.com:37358', 12345, {auto_reconnect : true});
var db = new Db('heroku_app24851292', server);


db.open(function(err, client) {
    client.authenticate('vinod.baradwaj@live.com', 'helloworld@123', function(err, success) {
        // Do Something ...
    });
}); */

/*var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://heroku_app24851292:rka0p8tnmujh9s5aidapvni2e5@ds037358.mongolab.com:37358/heroku_app24851292';

mongo.Db.connect(mongoUri, function (err, db) {
  db.collection('mydocs', function(er, collection) {
    collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
    });
  });
}); */

//var monk = require('monk');
//var db = monk('localhost:27017/test1');

/*var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'ds037358.mongolab.com:37358/heroku_app24851292'; **/



var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Make DB accessible to Route
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
