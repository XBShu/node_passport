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
node_passport/views/layout.ejs
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