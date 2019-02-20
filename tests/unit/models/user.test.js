const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('generateAuthToken', () => {
    it('should return a json web token', () => {
        const user = new User({ _id: new mongoose.Types.ObjectId(), isAdmin: true })

        const token = user.generateAuthToken();

        jwt.verify(token, config.get('jwtPrivateKey'));

    })
})