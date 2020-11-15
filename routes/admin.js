const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');


router.get('/', (req, res) => {
    res.render("admin");
})

router.get('/pedidos', (req, res) => {
    res.render("pedidos");
})

router.get('/usuarios', (req, res) => {
    res.render("usuarios");
})

module.exports = router;