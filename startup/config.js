const config = require('config');

// if jwtSecretKey is not set, terminate the app
module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey was not set. Terminating the app.');
    }
}
