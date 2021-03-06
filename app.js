var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var childRouter = require('./routes/child');
var emailRouter = require('./routes/email');
var crecheRouter = require('./routes/creche');
var emploRouter = require('./routes/employee');
var activityRouter = require('./routes/activity');

var app = express();

// AUTH COURSE ===
// const bodyParser = require('body-parser');
// ===

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// AUTH COURSE ===
// app.use(bodyParser.json);
//===

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/child', childRouter);
app.use('/email', emailRouter);
app.use('/employee/', emploRouter);
app.use('/activity', activityRouter);
app.use('/creche', crecheRouter);

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

module.exports = app;
