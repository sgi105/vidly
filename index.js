const Joi = require('joi');
Joi.objectId = require('joi-objectid');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const mongoose = require('mongoose');
const config = require('config');
mongoose.connect('mongodb://localhost/reviewvidly', { useNewUrlParser: true })
    .then(console.log("Connected to MongoDB..."))
    .catch(err => console.error('Error', err));


// if jwtSecretKey is not set, terminate the app
if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey was not set. Terminating the app.');
    process.exit(1);
}


app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

// PORT
const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}`))