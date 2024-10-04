const express = require('express');

const authController = require('../../controllers/admin/authController.js');
const pageController = require('../../controllers/admin/pageController.js');

const router = express.Router();

router.route('/login').post(authController.loginUser);
router.route('/open-the-gate').get(pageController.adminLoginPage);
router.route('/logout').get(authController.logoutUser);

module.exports = router;