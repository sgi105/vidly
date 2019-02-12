// Import
const express = require('express');
const router = express.Router();
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const Fawn = require('fawn');
const mongoose = require('mongoose');

Fawn.init(mongoose);

// Create
router.post('/', async (req, res) => {
    // validate new data
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // get movie and customer
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send('Customer not found');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send('Movie not found');

    // check if movie is in stock
    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.')

    // instantiate rental 
    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    });

    // // save to db
    // rental = await rental.save();

    // // decrement movie in stock and save
    // movie.numberInStock--;
    // await movie.save();

    // we want these two operations to both run or not run: transaction

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();
    } catch (err) { res.status(500).send('Something failed.'); }


    // return
    res.send(rental);
    console.log(rental);
});


// Read
router.get('/', async (req, res) => {
    // get list from db
    const rentals = await Rental.find().sort('-dateOut');

    // return
    res.send(rentals);
    console.log(rentals);
});

// Update
router.put('/:id', async (req, res) => {
    // validate new data
    const { error } = validate(req.body);
    if (error) return status(400).send(error.details[0].message);

    // get customer and movie
    const customer = await customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send('Customer not found');

    const movie = await movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send('Movie not found');

    // retrieve and update
    const rental = await Rental.findByIdAndUpdate(req.params.id, {
        $set: {
            customer: {
                name: customer.name,
                isGold: customer.isGold,
                phone: customer.phone,
            }
        }
    }, { new: true });
    if (!rental) return res.status(404).send('Rental not found');

    // return
    console.log(rental);
    res.send(rental);
});

// Export
module.exports = router;