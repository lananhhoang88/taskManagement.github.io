const path = require('path');
const express = require('express');
const morgan = require('morgan')
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const passport			= require('passport');
const localStrategy		= require('passport-local').Strategy;
const bcrypt			= require('bcrypt');
const session			= require('express-session');
const mongoose = require('mongoose');


const User = require('./app/models/User');


const route = require('./routes');
const db = require('./config/db');

//Connect to DB
db.connect();

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(methodOverride('_method'));

//HTTP logger
app.use(morgan('combined'));

//Template engine
app.engine(
  'hbs', 
  handlebars({
    extname: '.hbs',
      helpers: {
        sum: (a, b) => a + b,
      }  
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources','views'));

app.use(session({
	secret: "verygoodsecret",
	resave: false,
	saveUninitialized: true
}));

// Passport.js
app.use(passport.initialize());
app.use(passport.session());

//Routes init
route(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})