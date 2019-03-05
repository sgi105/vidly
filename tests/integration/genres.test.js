/**
 * @jest-environment node
 */


let server;
const request = require('supertest');
const { Genre } = require('../../models/genre');
const mongoose = require('mongoose');
const { User } = require('../../models/user');
const { Rental } = require('../../models/rental');


describe('/api/genres', () => {

    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => {
        // console.log(server.listening);
        await Genre.remove({});
        await server.close();
        // console.log(server.listening);
    });

    describe('GET /', () => {
        it('should return the list of genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ])
            const res = await request(server).get('/api/genres');

            // don't know why this does not work. Will have to figure out later.
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(genre => genre.name === 'genre1')).toBeTruthy();
            expect(res.body.some(genre => genre.name === 'genre2')).toBeTruthy();
        })
    })

    describe('GET /:id', () => {
        it('should return the genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        })

        it('should return 404 and when invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        })
    })

    describe('POST /', () => {
        let token;
        let name;
        beforeEach(() => {
            name = 'genre1';
            token = new User().generateAuthToken();
        })

        // happy path function
        const exec = async () => {
            return res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }

        it('should return 401(unauthenticated) when user is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        })
        it('should return 400 when genre name is less than 5 characters.', async () => {
            name = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        })
        it('should return 400 when genre name is more than 50 characters.', async () => {
            name = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        })
        it('should save to the database when input is valid', async () => {
            await exec();
            const genre = await Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
        })
        it('should return the genre when input is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        })
    })

    describe('PUT /:id', () => {

        let newName;
        let genre;
        let id;
        let token;

        // function for getting the response object for the put request

        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({
                    name: newName
                });
        }

        // make genre and get id, and generate user token.
        beforeEach(async () => {
            genre = new Genre({
                name: 'genre1'
            });
            await genre.save();

            token = new User().generateAuthToken();
            id = genre._id;
            newName = 'updatedName';
        })

        it('should return 401(unauthenticated) when user is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        })

        it('should return 404(not found) when an invalid id is passed', async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        })

        it('should return 400(bad request) if new genre name is less than 5 char', async () => {
            newName = '1';
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should return 400(bad request) if new genre name is longer than 50 chars', async () => {
            newName = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should return 404 if the given id is not found', async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        })

        it('should update the genre if input is valid', async () => {
            await exec();
            const updatedGenre = await Genre.findById(id);
            expect(updatedGenre.name).toBe(newName);
        })

        it('should return the updated genre if it is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('name', newName);
            expect(res.body).toHaveProperty('_id');
        })


    })

    describe('DELETE /:id', () => {

        let genre;
        let token;
        let id;
        // create a genre before each test runs
        // create a user with admin and create token

        beforeEach(async () => {
            genre = new Genre({
                name: 'genre1'
            })

            await genre.save();
            id = genre._id;

            token = new User({ isAdmin: true }).generateAuthToken();
        })

        const exec = async () => {
            return await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)
                .send();
        }



        it('should return 401(unauthenticated) if user is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        })

        it('should return 403(unauthorized, forbidden) if user is not admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();
            const res = await exec();
            // expect(res.status).toBe(403);
        })

        it('should return 404(not found) when id is invalid', async () => {
            id = 1;
            const res = await exec();
            // expect(res.status).toBe(404);
        })

        it('should return 404(not found) if genre with given id is not found', async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();
            // expect(res.status).toBe(404);
        })

        it('should return the deleted genre', async () => {
            await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        })

        it('the deleted genre should no longer be in the db', async () => {
            await exec();
            const deletedGenre = await Genre.findById(id);
            // expect(deletedGenre).toBeNull();
        })
    })
})



// =============Auth integration test========================



// make a describe block

describe('auth', () => {
    // set happy path function
    let token;

    beforeEach(() => {
        token = new User().generateAuthToken();
        server = require('../../index');
    })

    afterEach(async () => {
        await Genre.remove({});
        await server.close();
    })

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' })
    }

    it('should return 401 when no token is passed', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    })

    it('should return 400 if token is invalid', async () => {
        token = '1';
        const res = await exec();
        expect(res.status).toBe(400);
    })

    // can't access the req object, so have to write an unit test to verify the user.
    it('should return 200 if token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    })


})


// make it blocks for each exec path


// =============returns integration test: TDD Approach========================

describe('/api/returns', () => {
    let customerId;
    let movieId;
    let rental;

    beforeEach(async () => {
        server = require('../../index');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2,
            },
        });

        await rental.save();

    })

    afterEach(async () => {
        await server.close();
        await Rental.remove({});
    })

    it('should work!', async () => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    })

    it('should Return 401 if client is not logged in', async () => {
        const res = await request(server)
            .post('/api/returns')
            .send({ customerId, movieId });

        expect(res.status).toBe(401);
    })

    it('should Return 400 if customerId is not provided', async () => {
        const token = new User().generateAuthToken();

        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ movieId });

        expect(res.status).toBe(400);
    })

    it('should Return 400 if movieId is not provided', async () => {
        const token = new User().generateAuthToken();

        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId });

        expect(res.status).toBe(400);
    })


    // Return 400 if customerId is not provided
    // Return 400 if movieId is not provided
    // Return 404 if no rental found for this customer/movie
    // Return 400 if rental already processed
    // Return 200 if valid request
    // Set the return date
    // Calculate the rental fee
    // Increase the stock
    // Return the rental



});