const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Passport config
require('./config/passport')(passport);

//DB conofig
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log(`MongoDB Connected...`))
    .catch(error => console.log(error))
;

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({extended: false}));

//Express session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    //cookie : {secure: true} disabled because otherwise flash message won't appear
}))

//Passport middleware (must be put after the express session)
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/admin',require('./routes/admin'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));