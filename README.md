# Node.js and Passport.js auth project
  This project was made following Traversy Media's Node.js and Passport.js tutorial. I wanted to learn a simple way to 
  authenticate users on my web apps. Here I use a local strategy for authentication.

## Tools
  * Node.js
  * ejs
  * MongoDB
  * Express
  * Bootstrap

## Features
  * Register
    - Check if email used already exists
    - Flash alerts using ejs that appear at the top of the page if there are any errors within the form
    - Hashed passwords using bcrypt
  * Login
    - Passport and email authentication
    - Protected pathways using isAuthenticated method included with Passport

## Code
### To create a layout 
The views folder will contain all the views as well as the layout.ejs (seen below). The content of the views will be inserted within the <%- body %> tags.
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--Bootrap css-->
    <link rel="stylesheet" href="https://bootswatch.com/4/litera/bootstrap.min.css">
    <!--Fontawesome icons-->
    <script src="https://kit.fontawesome.com/50b8e92aef.js" crossorigin="anonymous"></script>
    
    <title>Fenix Sauce</title>
</head>
<body>
    <dic class="container">
        <%- body %>
    </dic>
   <!--Bootstrap javascript-->
   <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script> 
</body>
</html>
```

Below is dashboard.ejs as an example of a view that would be inserted into layout.ejs when res.render('dashboard') is called
```javascript
<h1 class="mt-4">Menu de usuario</h1>
<p class="lead mb-3"> Bienvenido, <%= name %></p>
<a href="users/logout" class="btn btn-secondary">Cerrar sesión</a>
```

### Using the router
Below is the code that would specify the routes. This should be in app.js (or whatever you name your entry point)
```javascript
//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
```
Here, the app uses '/' and '/users' as two of the route. Notice that they require certain routes from the routes folder..

The code below is from index.js within the routes folder. Here we see that it handles get requests for the '/' and '/dashboard' paths
```javascript
const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');

router.get('/',(req, res) => {
    res.render('welcome');
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        name: req.user.name,
    });
})
module.exports = router;
```
### Passport
Passport.js was initialized in the config file


```javascript
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');
const { deleteOne } = require('../models/User');

module.exports = function(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        if(email == "") return done(null, false, {message: 'Introduzca su email'});
        //Find user by email within the User collection in the database
        User.findOne({email: email})
            .then(user =>{

                //If user is not found return a message that will be displayed as a flash message
                if(!user) return done(null, false, {message: 'Email o contraseña no valido'});


                //The password was hashed when user registered, so use brcypt compare to compare the unhashed input with the hashed password found in database
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, user);
                    } else {

                        //Another flash message if password is not a match
                        return done(null, false, {message: 'Email o contraseña no valido'});
                    }
                })
            })
            .catch(err => console.log(err));
    }))
}

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
```

### Flash messages
The application displays a flash message if the user had succesfuly signed up. In order to implement these we must also implement express sessions

```javascript
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

```

Then we can declare global variables 
```javascript
//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
```

The example below is executed when a new user is registered
```javascript
newUser.save()
    .then(user => {
        //success_msg is assigned the following message
        req.flash('success_msg', 'Su solicitud ha sido enviada. Le enviaremos un correo por email al darle de alta');
        res.redirect('/users/login');
    }).catch(err => console.log(err));

```

If you want to display the message somewhere, you must use ejs somewhere in the page:
```javascript
        <%- include('partials/messages.ejs') %>
```
Then in the partials/messages.ejs file:
```javascript
<% if(success_msg.length > 0) { %>
  <div class="alert alert-success alert-dismissible fade show" role="alert">
    <%= success_msg %>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
<% } %>
```
check if success_msg is not an empty string. It should not be, because we assigned a message to it when the user was registered. And display.