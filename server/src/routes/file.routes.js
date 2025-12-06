const express = require('express');
const fileController = require('../controllers/file.controller');
const authMiddleware = require('../middlewares/auth');
const { upload } = require('../config/multer');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

router.post('/upload', upload.array('files'), fileController.uploadFiles);
router.get('/', fileController.listFiles);
router.get('/shared', fileController.listSharedFiles);
router.get('/:id/download', fileController.downloadFile);
router.delete('/:id', fileController.deleteFile);

module.exports = router;
