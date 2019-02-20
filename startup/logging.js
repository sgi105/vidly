const { createLogger, transports, format } = require('winston');
require('winston-mongodb');
require('express-async-errors')

module.exports = function () {
    const logger = createLogger({
        level: 'debug',
        format: format.combine(
            format.colorize(),
            format.prettyPrint(),
            format.timestamp({
                format: 'YY-MM-DD HH:mm:ss'
            }),
            format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
        transports: [
            new transports.Console(),
            new transports.File({
                filename: 'logs/combined.log',
                format: format.json()
            }),
            new transports.File({
                filename: 'logs/errors.log',
                level: 'error',
                format: format.json()
            }),
            new transports.MongoDB({ db: 'mongodb://localhost/reviewvidly', level: 'error' }),
        ],
        exceptionHandlers: [
            new transports.Console(),
            new transports.File({
                filename: 'logs/exceptions.log',
                format: format.json(),
            })
        ]
    });

    logger.info('Hello World!');
    logger.debug('debugging info');

    // throwing exception when promise is not resolved so that the winston handler above can handle it instead. 
    process.on('unhandledRejection', ex => {
        throw ex;
    })
    return logger;
}


// // Exception handling -> takes care of exceptions that happen outside of request pipeline.
// winston.handleExceptions(
//     new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
//     new winston.transports.Console({ colorize: true, prettyPrint: true }));


    // // adding new transports to the winston logging system -> this is used when error happens during a request pipeline
    // winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    // // winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/reviewvidly', level: 'error' }));
