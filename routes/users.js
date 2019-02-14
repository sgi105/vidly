// =====Import=====
const express = require('express');
const { User, validate } = require('../models/user');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');


// =====CREATE=====
router.post('/', async (req, res) => {
    // validate input
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if the user with same email already exists
    const exist = await User.findOne({ email: req.body.email });
    if (exist) return res.status(400).send('User already registered.');

    // instantiate
    const user = new User(_.pick(req.body, ['name', 'email', 'password']))

    // hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // save to db
    await user.save();

    // return and give them token
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    console.log(_.pick(user, ['_id', 'name', 'email']));
})

// =====READ=====
// get current user
router.get('/me', auth, async (req, res) => {
    // get user's id from the auth middleware
    const id = req.user._id;
    const user = await User.findById(id).select('-password');
    res.send(user);
})

// =====UPDATE=====

// =====DELETE=====

// =====Export=====

module.exports = router;