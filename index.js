var express = require('express');
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;
require("dotenv").config();
// var allRoutes = require('./controllers');
//new coomment
// Requiring our models for syncing
var db = require('./models');
const session = require("express-session");
var SequelizeStore = require('connect-session-sequelize')(session.Store);

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new SequelizeStore({
        db: db.sequelize
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7200000
    }
}))

// Static directory
// app.use(express.static('public'));

var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// app.use('/',allRoutes);

const authRoutes = require("./controllers/authController");
app.use(authRoutes);

db.sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log('App listening on PORT ' + PORT);
    });
}).catch(err => {
    throw err;
});