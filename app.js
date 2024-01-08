var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/books');

const db = require('./models');

//connect to db
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection to the database successful!');
    //sync model with db
    db.sequelize.sync().then(() => {
      // ??
      //server.listen(port);
    });
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

const routes = require("./routes/index");
const books = require("./routes/books");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler, for dev env
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //log error
  console.log(`${err.status}: ${err.message}`);

  // render the error page
  res.status(err.status || 500);
  if(err.status === 400){
    res.render('page-not-found', {err});
  }else{
    res.render('error', {err});
  }
});

module.exports = app;
