const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Genre, validate } = require('../models/genre');

// =====Create: post=============
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });
    try {
        genre = await genre.save();
        console.log(genre);
        res.send(genre);
    } catch (err) { console.log('Error', err.message); }
});

// =============Read: get=============
// the whole list
router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find().sort('name');
        console.log(genres);
        res.send(genres);
    } catch (err) { console.log('Error', err.message); }
});

// specific genre
router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre not found.");

    console.log(genre);
    res.send(genre);
});


// =============Update: put=============
router.put('/:id', async (req, res) => {
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

    console.log(genre);
    res.send(genre);
})

// =============Delete: delete=============
router.delete('/:id', async (req, res) => {
    // find and delete
    let genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send("Genre not found.");

    console.log(genre);
    res.send(genre);
})


module.exports = router;