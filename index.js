const express = require('express');
const app = express();
const logger = require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

// PORT
const port = process.env.PORT || 3000;
module.exports = app.listen(port, logger.info(`Listening on port ${port}`))