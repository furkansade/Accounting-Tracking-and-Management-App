const express = require('express');
const customerController = require('../../controllers/admin/customerController.js');
const authMiddleware = require('../../middlewares/authMiddleware.js');
const checkAdminMiddleware = require('../../middlewares/checkAdminMiddleware.js');
const checkCreateMiddleware = require('../../middlewares/checkCreateMiddleware.js');


const router = express.Router();

router.use(authMiddleware.authenticateToken);

router.route('/').post(checkCreateMiddleware.checkCreate, customerController.createCustomer);
router.route('/:id').delete(checkAdminMiddleware.checkAdmin, customerController.deleteCustomer);
router.route('/:id').put(checkAdminMiddleware.checkAdmin, customerController.updateCustomer);

module.exports = router;