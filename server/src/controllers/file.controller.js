const fileService = require('../services/file.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const uploadFiles = catchAsync(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next(new AppError(400, 'Please upload at least one file'));
    }

    const files = await fileService.createFiles(req.files, req.user._id);

    res.status(201).json({
        status: 'success',
        results: files.length,
        data: {
            files,
        },
    });
});

const listFiles = catchAsync(async (req, res, next) => {
    const files = await fileService.listFiles(req.user._id);

    res.status(200).json({
        status: 'success',
        results: files.length,
        data: {
            files,
        },
    });
});

const listSharedFiles = catchAsync(async (req, res, next) => {
    const files = await fileService.listSharedFiles(req.user._id);

    res.status(200).json({
        status: 'success',
        results: files.length,
        data: {
            files,
        },
    });
});

const downloadFile = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { url, file } = await fileService.getDownloadUrl(id, req.user._id);

    res.status(200).json({
        status: 'success',
        data: {
            file,
            filename: file.originalName,
            downloadUrl: url,
            expiresIn: '5 minutes'
        }
    });
});

const deleteFile = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await fileService.deleteFile(id, req.user._id);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

module.exports = {
    uploadFiles,
    listFiles,
    listSharedFiles,
    downloadFile,
    deleteFile,
};
