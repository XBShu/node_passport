const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');

router.get('/login',(req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', (req,res) => {
    const {name, apellidos, email, password, password2, empresa, cif, telefono, facturacion, cp, ciudad} = req.body;
    let errors = [];
    
    //check required fields and push to errors array
    if(!name || !apellidos || !empresa || !cif || !telefono || !facturacion || !cp || !ciudad){
        errors.push({message: "Por favor introduzca todos sus datos"})
    }
    if(!email) {
        errors.push({message: "Introduzca un email valido"});
    }
    if(!password) {
        errors.push({message: "Introduzca una contraseña"});
    }else if(password !== password2) {
        errors.push({message: "Las contraseñas no son iguales"})
    }else if(password.length < 6){
        errors.push({message: "Contraseña debe de tener al menos 6 caracteres"});
    }

    //if there are any errors, do not register user
    if(errors.length > 0){
        console.log(errors);
        //so that fields are not all reset
        res.render('register', {
            errors,
            name, 
            apellidos,
            email, 
            empresa, 
            cif,
            telefono,
            facturacion,
            cp, 
            ciudad,
        })
    } else {
        //Check if user already exists
        User.findOne({email: email})
            .then(user => {
                if(user) {
                    errors.push({message: "El usuario asociado con este email ya existe"});
                    //user already exists
                    res.render('register', {
                        errors, name, apellidos, email, empresa, cif,telefono,facturacion,cp, ciudad,
                    })
                } else {
                    const newUser = new User({
                        name, apellidos, email, 
                    });

                    //Hash password sync
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;

                            //save to database
                            newUser.save()
                                .then(user => {
                                    //display success message
                                    req.flash('success_msg', 'Su solicitud ha sido enviada. Le enviaremos un correo por email al darle de alta');
                                    res.redirect('/users/login');
                                }).catch(err => console.log(err));
                        })
                    })

                }
            });

    }
});

//Login
router.post('/login', (req,res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        badRequestMessage: "Introduzca su email",
        failureFlash: true,
    })(req,res,next);
    }
)


//Cerrar sesion
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'Sesion cerrada');
    res.redirect('login');
})
module.exports = router;