const express = require('express');
const shareController = require('../controllers/share.controller');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/files/:fileId/share', authMiddleware.protect, shareController.shareWithUser);


router.get('/files/:fileId/permissions', authMiddleware.protect, shareController.getFilePermissions);
router.delete('/files/:fileId/permissions/user/:userId', authMiddleware.protect, shareController.removeUserAccess);
router.delete('/files/:fileId/leave', authMiddleware.protect, shareController.leaveShare);

module.exports = router;
