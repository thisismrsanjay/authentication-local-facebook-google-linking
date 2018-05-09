const express  = require('express');
const app      = express();
const port     = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');

const configDB = require('./config/database');

require('./config/passport')(passport);
mongoose.connect(configDB.url);

app.use(cookieParser());

app.use(morgan('dev'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({secret:'thisisasecret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//can  i remove that passport 
require('./app/routes.js')(app, passport);


app.listen(port);
console.log('Server Started' + port);
