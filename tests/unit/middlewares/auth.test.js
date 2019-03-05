
const { User } = require('../../../models/user');
const mongoose = require('mongoose');
const auth = require('../../../middleware/auth');

// describe
describe('auth middleware', () => {
    it('should match the same user with the jason web token.', () => {
        const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
        const token = new User(user).generateAuthToken();

        // create mock variables
        const req = {
            header: jest.fn().mockReturnValue(token),
            user: user
        }
        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        // check if the user is same with the input user.
        expect(req.user).toMatchObject(user);
    })
})
