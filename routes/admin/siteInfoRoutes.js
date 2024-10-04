const express = require('express');
const siteInfoController = require('../../controllers/admin/siteInfoController');
const authMiddleware = require('../../middlewares/authMiddleware.js');

const router = express.Router();

router.route('/:id').put(authMiddleware.authenticateToken, siteInfoController.updateSiteInfo);

module.exports = router;