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
