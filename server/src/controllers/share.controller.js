const shareService = require('../services/share.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../models/User');

const shareWithUser = catchAsync(async (req, res, next) => {
    const { fileId } = req.params;
    const { email } = req.body;

    if (!email) {
        return next(new AppError(400, 'Please provide email of user to share with'));
    }

    const targetUser = await User.findOne({ email });
    if (!targetUser) {
        return next(new AppError(404, 'User not found'));
    }

    await shareService.shareWithUser(fileId, req.user._id, targetUser._id);

    res.status(200).json({
        status: 'success',
        message: 'File shared successfully',
    });
});



const getFilePermissions = catchAsync(async (req, res, next) => {
    const { fileId } = req.params;
    const permissions = await shareService.getFilePermissions(fileId, req.user._id);

    res.status(200).json({
        status: 'success',
        data: permissions
    });
});

const removeUserAccess = catchAsync(async (req, res, next) => {
    const { fileId, userId } = req.params;
    await shareService.removeUserAccess(fileId, req.user._id, userId);

    res.status(204).json({
        status: 'success',
        data: null
    });
});



const leaveShare = catchAsync(async (req, res, next) => {
    const { fileId } = req.params;

    await shareService.removeUserAccess(fileId, req.user._id, req.user._id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});

module.exports = {
    shareWithUser,
    getFilePermissions,
    removeUserAccess,
    leaveShare
};
