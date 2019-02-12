// Imports
const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

// mongoose Schema, Model
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 0,
        maxlegnth: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
});

const Movie = mongoose.model('Movie', movieSchema);

// Joi validation

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(0).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required(),
    }
    return Joi.validate(movie, schema);
}

// Export

module.exports = {
    Movie: Movie,
    validate: validateMovie
}