const fileService = require('../services/file.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { extractTextFromPDF } = require('../utils/pdf');
const { generateSummary } = require('../services/ai.service');
const File = require('../models/File');
const axios = require('axios');

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

const generateFileSummary = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({
                status: 'fail',
                message: 'File not found'
            })
        }
        if (file.summary && file.summary.short) {
            return res.status(200).json({
                status: 'success',
                data: {
                    summary: file.summary
                }
            })
        }

        // Get signed download URL (REUSE EXISTING LOGIC)
        const { url } = await fileService.getDownloadUrl(req.params.id, req.user._id);

        const response = await axios.get(url, {
            responseType: 'arraybuffer',
        });

        const text = await extractTextFromPDF(response.data);

        if (!text.trim()) {
            return res.status(400).json({
                status: 'fail',
                message: 'File is empty'
            })
        }

        const aiOutput = await generateSummary(text);
        console.log(aiOutput)
        const aiText = await aiOutput.text();
        // Parse Gemini output
        const lines = aiText.split('\n').filter(Boolean);
        const short = lines[0];
        const bullets = lines.slice(1).map(line =>
            line.replace(/^[-•]/, '').trim()
        );

        file.summary = {
            short,
            bullets,
            generatedAt: new Date(),
        };

        await file.save();

        res.status(200).json({
            status: 'success',
            data: {
                summary: file.summary,
            },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'fail',
            message: 'Failed to generate summary'
        })
    }
}

module.exports = {
    generateFileSummary,
    uploadFiles,
    listFiles,
    listSharedFiles,
    downloadFile,
    deleteFile,
};
