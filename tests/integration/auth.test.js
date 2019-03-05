// /**
//  * @jest-environment node
//  */

it('is just a dummy', () => {

});

// const { Genre } = require('../../models/genre');
// let server;
// const request = require('supertest');
// const { User } = require('../../models/user');

// // make a describe block

// describe('auth', () => {
//     // set happy path function
//     let token;

//     beforeEach(() => {
//         token = new User().generateAuthToken();
//         server = require('../../index');
//     })

//     afterEach(async () => {
//         await Genre.remove({});
//         await server.close();
//     })

//     const exec = () => {
//         return request(server)
//             .post('/api/genres')
//             .set('x-auth-token', token)
//             .send({ name: 'genre1' })
//     }

//     it('should return 401 when no token is passed', async () => {
//         token = '';
//         const res = await exec();
//         expect(res.status).toBe(401);
//     })

//     it('should return 400 if token is invalid', async () => {
//         token = '1';
//         const res = await exec();
//         expect(res.status).toBe(400);
//     })

//     // can't access the req object, so have to write an unit test to verify the user.
//     it('should return 200 if token is valid', async () => {
//         const res = await exec();
//         expect(res.status).toBe(200);
//     })


// })


// // make it blocks for each exec path
