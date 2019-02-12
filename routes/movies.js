// Import
const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');


// CRUD

// Create

router.post('/', async (req, res) => {
    // validate
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // get Genre
    let genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send("Genre not found.");

    // instantiate (genre is referenced and only selected values are embedded: hybrid approach)
    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    // save & return
    try {
        await movie.save();
        console.log(movie);
        res.send(movie);
    } catch (err) { console.log('Error', err.message) }

});

// Read
// all
router.get('/', async (req, res) => {
    // retrieve from db
    const movies = await Movie.find();
    if (!movies) return res.status(404).send("Movie not found.");

    // return
    res.send(movies);
    console.log(movies);
});

// one
router.get('/:id', async (req, res) => {
    // retrieve from db
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie not found.');
    // return
    console.log(movie);
    res.send(movie);
})

// Update
router.put('/:id', async (req, res) => {
    // validate new data
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // refernce genre from db
    let genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send("Genre not found.");

    // retrieve and update
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    }, { new: true });
    if (!movie) return res.status(404).send("Movie not found.");

    // return
    console.log(movie);
    res.send(movie);
});

// Delete
router.delete('/:id', async (req, res) => {
    // retrieve from db & delete
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).send("Movie not found.");
    // return
    console.log(movie);
    res.send(movie);
})

// Export

module.exports = router;