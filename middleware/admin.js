// Import

// middleware function
function admin(req, res, next) {
    if (!req.body.user.isAdmin) return res.status(403).send('Access denied.')
    next();
}

// Export

module.exports = admin;