// Import
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

// POST METHOD
router.post('/', async (req, res) => {
    // validate request with joi
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password');

    // check if the password is authentic by comparing with the hashed password in the db
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    // Create a JSON Web Token
    const token = user.generateAuthToken();

    // return the client with a JSON Web Token
    res.send(token);
})

// Separate joi validate function
function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required()
    }

    return Joi.validate(req, schema);
}

// Export
module.exports = router;