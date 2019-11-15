var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog');
let uploadRouter = require('./routes/upload');
let dataRouter = require('./routes/data');
let faceDescriptors = require('./routes/face_descriptors');
var app = express();
let bodyParser = require('body-parser');
// view engine setup
// 允许跨域访问／／／
// app.all('/api/*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'x-Request-with');
//   res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
//   res.header('X-Powered-By', '4.15.2');
//   res.header('Content-Type', 'application/json;charset=utf-8');
//   next()   //执行下一个中间件。
// });
app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'x-Request-with');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', '4.15.2');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next()   //执行下一个中间件。
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json({limit:'100mb'}));
app.use(bodyParser.urlencoded({ limit:'100mb', extended: true }));

app.use(express.urlencoded({ limit:'100mb',extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/blog', blogRouter);
app.use('/upload', uploadRouter);
app.use('/dataInfo', dataRouter);
app.use('/faceDescriptors', faceDescriptors);

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
