#!/usr/bin/env node
// dependencies
var express      = require('express');
var app          = express();
var http         = require('http').Server(app);
var io           = require('socket.io')(http);
var port         = process.env.PORT || 3001;
var mongoose     = require('mongoose');
var cookieParser = require('cookie-parser');
var router       = express.Router();
var sanitizer    = require('sanitizer');
var md5          = require('MD5');
var fs           = require('fs');
var bodyParser = require('body-parser');
var multer  = require('multer');
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var logger = require('morgan');

// configure
app.use(bodyParser());
app.use(multer({ dest: './uploads/'}));
app.use(express.static('assets'));
app.engine('.html', require('ejs').__express);
app.engine('.js', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(cookieParser('secret-string'));
app.use(logger(':remote-addr :method :url'));


// MongoDB Connection
mongoose.connect('mongodb://localhost/chat');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('Connected to MongoDB!!!');
});

// MongoDB Session Store
app.use(session({
    secret: 'secret-cookie-string',
    name: 'user_session_id',
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: 1209600 },
    store: new MongoStore({
        db: 'socketio',
        collection: 'sessions',
        host: '127.0.0.1',
        port: 27017,
        username: '',
        password: '',
        ssl: false,
        mongoose_connection: db
    })
}));
app.get('/',            function(req, res){ res.render('index'); });
app.use(function(req, res, next){
    res.render('index');
});
io.on('connection', function(socket){
    socket.emit('welcome', { message: 'welcome' });
}); // end io connect

// Start server
http.listen(port, function(){
    console.log('listening on port ' + port);
});
