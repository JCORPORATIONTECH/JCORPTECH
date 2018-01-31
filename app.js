const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const app = express();
const hbs = require('hbs');
const passport = require('passport');
const flash = require('connect-flash');
const cookieSession = require('cookie-session');
const helmet = require('helmet');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.gif')));


// var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(cookieSession({
  name: 'session',
  keys: ['Chadaeli'],
  cookie: {
    secure: false
    , httpOnly: false
    , domain: 'jcorporationtech.com'
    // expires: expiryDate // 지속적 쿠키에 대한 만기 일짜를 설정, 쿠키에 중요한 정보가 없으므로 로그인을 일단 유지하게 한다.
  }
}));

// helmet related configuration for security
app.use(helmet());
app.disable('x-powered-by');

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/static', express.static(__dirname + '/public'));


global.PROJ_TITLE = '제이코퍼레이션';

// app.use((req, res, next) => {
// 	res.locals.version = '1.0.0';
// 	next();
// });

// todo csrfToken을 모든 페이지에 내려줄 수 있도록 헤야 하나?
// todo BUG 아이패드의 경우 모바일이 아니라 PC 처리하고 있다.
const isMobile = require('is-mobile');

app.use((req, res, next) => {
	res.locals.version  = '2.0.0';
	res.locals.isMobile = (isMobile(req) == 1) ? 1 : 0;
	
	if(req.headers['x-forwarded-port'] === '443'){
		res.locals.static = 'https://assets.chadaeli.com/';
	}else{
		res.locals.static = 'http://assets.chadaeli.com/';
	}
	
	next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res) => {
	res.status(404);
  res.render('404', {
      current_path: '404 Error Page',
      title: PROJ_TITLE + 'ERROR PAGE',
      loggedIn: req.user
  });
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('500', {
        current_path: ' 500 Error Page',
        title: PROJ_TITLE + 'ERROR PAGE'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	
	// todo 메일 수신 설정 등
  res.render('500', {
      current_path: '500 Error Page',
      title: PROJ_TITLE + 'ERROR PAGE'
  });
});


module.exports = app;