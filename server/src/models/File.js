const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        s3Key: {
            type: String,
            required: true,
        },
        mimeType: {
            type: String,
        },
        size: {
            type: Number,
            required: true,
        },
        uploadDate: {
            type: Date,
            default: Date.now,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        sharedWith: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        compressed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const File = mongoose.model('File', fileSchema);

module.exports = File;
