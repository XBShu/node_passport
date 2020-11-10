const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');
const { deleteOne } = require('../models/User');

module.exports = function(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        if(email == "") return done(null, false, {message: 'Introduzca su email'});
        User.findOne({email: email})
            .then(user =>{
                if(!user) return done(null, false, {message: 'Email o contraseña no valido'});

                //Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch) {
                        return done(null, user);
                    } else {
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