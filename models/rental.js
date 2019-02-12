// Import
const Joi = require('joi');
const mongoose = require('mongoose');

// mongoose schema, model
const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50,
                trim: true,
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 0,
                maxlegnth: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            },
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now(),
        required: true
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        required: true,
        min: 0
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

// Joi validation
function validateRental(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(rental, schema);
}

// Export
module.exports = {
    validate: validateRental,
    Rental: Rental
}