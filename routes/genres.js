const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Genre, validate } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
require('express-async-errors');


// =====Create: post=============
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    // console.log(genre);
    res.send(genre);

});

// =============Read: GET=============
// the whole list
router.get('/', async (req, res, next) => {
    const genres = await Genre.find().sort('name');
    // console.log(genres);
    res.send(genres);
});

// specific genre
router.get('/:id', validateObjectId, async (req, res) => {

    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre not found.");

    // console.log(genre);
    res.send(genre);
});


// =============Update: put=============
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    // validate

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // find and update
    let genre = await Genre.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
        }
    }, { new: true });
    if (!genre) return res.status(404).send("Genre not found.");

    // console.log(genre);
    res.send(genre);
})

// =============Delete: delete=============
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    // find and delete
    let genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send("Genre not found.");

    // console.log(genre);
    res.send(genre);
})


module.exports = router;