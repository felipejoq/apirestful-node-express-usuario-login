const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/User');

router.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                errors: err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                errors: {
                    message: "Usuario o contraseña incorrectos"
                }
            });
        }

        if (!userDB.comparePassword(body.password)) {
            return res.status(400).json({
                ok: false,
                errors: {
                    message: "Usuario o contraseña incorrectos"
                }
            });
        }

        let token = jwt.sign({ user: userDB }, process.env.SEED, {
            expiresIn: process.env.EXPIRE_TOKEN
        });

        res.json({
            ok: true,
            user: userDB,
            token
        });
    });
});

module.exports = router;