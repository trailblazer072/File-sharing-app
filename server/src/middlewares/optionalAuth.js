const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const config = require('../config/env');

const optionalAuth = async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next();
    }

    try {
        // 2) Verification token
        const decoded = await promisify(jwt.verify)(token, config.jwt.secret);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (currentUser) {
            req.user = currentUser;
        }
    } catch (err) {
        // validation failed, just proceed as guest
    }

    next();
};

module.exports = {
    optionalAuth,
};
