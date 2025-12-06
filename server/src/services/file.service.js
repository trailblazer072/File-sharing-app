const File = require('../models/File');
const { GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3 } = require('../config/multer');
const config = require('../config/env');
const AppError = require('../utils/AppError');

const createFiles = async (files, userId) => {
    const fileDocs = await Promise.all(files.map(async (file) => {
        let size = file.size;
        if (!size || size === 0) {
            try {
                // Fallback: Fetch size from S3 if multer didn't report it (e.g., chunked encoding)
                const head = await s3.send(new HeadObjectCommand({
                    Bucket: config.aws.bucketName,
                    Key: file.key,
                }));
                if (head.ContentLength) {
                    size = head.ContentLength;
                }
            } catch (e) {
                console.error("Failed to fetch size from S3", e);
            }
        }

        return {
            filename: file.key.split('/').pop(),
            originalName: file.originalname,
            s3Key: file.key,
            mimeType: file.mimetype,
            size: size || 0, // Keep as 0 if still failed
            ownerId: userId,
        };
    }));

    return await File.insertMany(fileDocs);
};

const listFiles = async (userId) => {
    return await File.find({ ownerId: userId }).sort({ createdAt: -1 });
};

const listSharedFiles = async (userId) => {
    return await File.find({ sharedWith: userId }).sort({ createdAt: -1 }).populate('ownerId', 'name email');
};

const getDownloadUrl = async (fileId, userId) => {
    const file = await File.findById(fileId);
    if (!file) {
        throw new AppError(404, 'File not found');
    }

    // Access Control: Check if owner or shared (Basic check, will need expansion for Sharing module)
    const isOwner = file.ownerId.toString() === userId.toString();
    const isShared = file.sharedWith.some(id => id.toString() === userId.toString());

    if (!isOwner && !isShared) {
        throw new AppError(403, 'You do not have permission to access this file');
    }

    const command = new GetObjectCommand({
        Bucket: config.aws.bucketName,
        Key: file.s3Key,
    });

    // Generate signed URL valid for 1 hour
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return { url, file };
};

const deleteFile = async (fileId, userId) => {
    const file = await File.findOne({ _id: fileId, ownerId: userId });

    if (!file) {
        throw new AppError(404, 'File not found or you do not have permission to delete it');
    }

    // Delete from S3
    const command = new DeleteObjectCommand({
        Bucket: config.aws.bucketName,
        Key: file.s3Key,
    });

    await s3.send(command);

    // Delete from DB
    await File.deleteOne({ _id: fileId });

    return;
};

module.exports = {
    createFiles,
    listFiles,
    listSharedFiles,
    getDownloadUrl,
    deleteFile,
};
