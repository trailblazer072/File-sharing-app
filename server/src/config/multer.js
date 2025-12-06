const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('./env');
const path = require('path');

const s3 = new S3Client({
    region: config.aws.region,
    credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.aws.bucketName,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            // Folder structure in S3: uploads/{userId}/{filename}
            // req.user must be populated by auth middleware
            const userId = req.user ? req.user._id.toString() : 'public';
            cb(null, `uploads/${userId}/${uniqueSuffix}${ext}`);
        },
    }),
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

module.exports = {
    upload,
    s3,
};
