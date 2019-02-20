function asyncMiddleware(handler) {
    return (res, req, next) => {
        try {
            handler(req, res);
        }
        catch (ex) {
            next(ex);
        }
    }
}

module.exports = asyncMiddleware;