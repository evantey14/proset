var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { Game } = require('./models')

var app = express();

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Initialize a single game (this should be changed to allow for game creation / tracking)
Game.deleteMany({}, (e) => console.log(e));
const shuffle = cards => cards.sort(() => Math.random() - 0.5);
let deck = shuffle([...Array(64).keys()].filter(c => c !== 0));
const table = deck.splice(0, 7);
game = Game.create({deck: deck, table: table});

module.exports = app;
