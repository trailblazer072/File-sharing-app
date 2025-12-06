
const File = require('../models/File');
const AppError = require('../utils/AppError');

const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3 } = require('../config/multer');
const config = require('../config/env');

const shareWithUser = async (fileId, ownerId, targetUserId) => {
    const file = await File.findOne({ _id: fileId, ownerId });
    if (!file) {
        throw new AppError(404, 'File not found or you do not have permission');
    }

    // prevent duplicates
    if (!file.sharedWith.includes(targetUserId)) {
        file.sharedWith.push(targetUserId);
        await file.save();
    }

    return file;
};

const getFilePermissions = async (fileId, userId) => {
    const file = await File.findOne({ _id: fileId, ownerId: userId }).populate('sharedWith', 'name email');
    if (!file) {
        throw new AppError(404, 'File not found');
    }

    return {
        sharedWith: file.sharedWith,
        links: [] // removed public links support
    };
};

const removeUserAccess = async (fileId, ownerId, targetUserId) => {
    const file = await File.findOne({ _id: fileId, ownerId });
    if (!file) {
        throw new AppError(404, 'File not found');
    }

    file.sharedWith = file.sharedWith.filter(id => id.toString() !== targetUserId.toString());
    await file.save();

    return file;
};



module.exports = {
    shareWithUser,
    getFilePermissions,
    removeUserAccess,
};
