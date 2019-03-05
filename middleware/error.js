const logger = require('../startup/logging');


module.exports = function (err, req, res, next) {
    // log the exception
    logger.error(err);
    res.status(500).send('Something failed.')
}