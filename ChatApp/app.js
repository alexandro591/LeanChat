var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var checkhealth = require('./routes/checkhealth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// block for index html being served on / route
app.use('/', checkhealth);
app.use('/index.html', checkhealth);

// middlewares for static content
app.use('/chat/*/init', express.static(path.join(__dirname, './public/app/build'),{
  extensions: ['html', 'htm'],
}));
app.use('/', express.static(path.join(__dirname, './public/app/build'),{
  extensions: ['html', 'htm'],
}));


app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
