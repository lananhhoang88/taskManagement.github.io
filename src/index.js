const path = require('path');
const cors = require('cors')
const express = require('express');
const morgan = require('morgan')
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser')
const { padLeft } = require('./util/mongoose');

const User = require('./app/models/User');


const route = require('./routes');
const db = require('./config/db');

//Connect to DB
db.connect();

const app = express();
const port = 3000;

app.use(cors());
app.use(cookieParser());
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
            formatDate: (date) => {
                if (!date) return '';
                const strHour = `${padLeft(date.getHours())}:${padLeft(date.getMinutes())}:${padLeft(date.getSeconds())}`;
                return `${date.getFullYear()}/${padLeft(date.getMonth() + 1)}/${padLeft(date.getDate())} ${strHour}`;
            }
        }
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

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