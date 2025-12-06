const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const config = require('../config/env');

const signToken = (id) => {
    return jwt.sign({ id }, config.jwt.secret, {
        expiresIn: '90d',
    });
};

const register = async (userData) => {
    // Check if user exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError(400, 'Email already in use');
    }

    const newUser = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
    });

    const token = signToken(newUser._id);
    // Hide password from output
    newUser.password = undefined;

    return { user: newUser, token };
};

const login = async (email, password) => {
    if (!email || !password) {
        throw new AppError(400, 'Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new AppError(401, 'Incorrect email or password');
    }

    const token = signToken(user._id);
    user.password = undefined;

    return { user, token };
};

module.exports = {
    register,
    login,
};
