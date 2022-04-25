var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const apiRouter = express.Router();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

let department = [];

apiRouter.post('/department', function(req, res) {
  let today = new Date();
  let newDepartment = {
    department : req.body.intent.name,
    time : today
  };

  department.push(newDepartment);
  console.log('Department Array : ', department);

  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleImage: {
            imageUrl: "https://t1.daumcdn.net/friends/prod/category/M001_friends_ryan2.jpg",
            altText: "hello I'm Ryan"
          }
        }
      ]
    }
  };

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'greenoneul@gmail.com',
      pass: 'damkki784!',
    },
  });

  let info = transporter.sendMail({
    from: `"챗봇 서버" <greenoneul@gmail.com>`,
    to: 'greenoneul@gmail.com',
    subject: '반납신청! ' + newDepartment.department,
    text: 'text',
    html: `<b>장소 : ${newDepartment.department}</b><br/><b>시간 : ${newDepartment.time}</b>`,
  });

  console.log('Message sent!!');

  res.status(200).send(responseBody);
});

apiRouter.post('/sayHello', function(req, res) {
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: "hello I'm Ryan"
          }
        }
      ]
    }
  };

  res.status(200).send(responseBody);
});

apiRouter.post('/showHello', function(req, res) {
  console.log(req.body);

  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleImage: {
            imageUrl: "https://t1.daumcdn.net/friends/prod/category/M001_friends_ryan2.jpg",
            altText: "hello I'm Ryan"
          }
        }
      ]
    }
  };

  res.status(200).send(responseBody);
});

// app.use(function(req, res, next) {
//   console.log('hi');
// });

app.listen(8080, function() {
  console.log('Example skill server listening on port 8080!');
});

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
