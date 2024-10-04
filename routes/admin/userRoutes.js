const express = require('express');
const userController = require('../../controllers/admin/userController');
const authMiddleware = require('../../middlewares/authMiddleware.js');
const checkAdminMiddleware = require('../../middlewares/checkAdminMiddleware.js');


const router = express.Router();

router.use(authMiddleware.authenticateToken);

router.route('/').post(checkAdminMiddleware.checkAdmin, userController.createUser);
router.route('/:id').delete(checkAdminMiddleware.checkAdmin, userController.deleteUser);
router.route('/change-password/:id').put(userController.changePassword);

module.exports = router;