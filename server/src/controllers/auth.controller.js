const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json({
        status: 'success',
        token: result.token,
        data: {
            user: result.user,
        },
    });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({
        status: 'success',
        token: result.token,
        data: {
            user: result.user,
        },
    });
});

module.exports = {
    register,
    login,
};
