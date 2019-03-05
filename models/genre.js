const Joi = require('joi');
const mongoose = require('mongoose');

// Create Schema, Model
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true,
    }
});

const Genre = mongoose.model('Genre', genreSchema);

//=============Joi Validate=============
function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    }

    return Joi.validate(genre, schema);
}

module.exports = {
    Genre: Genre,
    validate: validateGenre,
    genreSchema: genreSchema
}