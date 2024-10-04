const express = require('express');
const customerTransactionController = require('../../controllers/admin/customerTransactionController.js');
const authMiddleware = require('../../middlewares/authMiddleware.js');
const checkAdminMiddleware = require('../../middlewares/checkAdminMiddleware.js');
const checkCreateMiddleware = require('../../middlewares/checkCreateMiddleware.js');


const router = express.Router();

router.use(authMiddleware.authenticateToken);

router.route('/').post(checkCreateMiddleware.checkCreate, customerTransactionController.createCustomerTransaction);
router.route('/:id').delete(checkAdminMiddleware.checkAdmin, customerTransactionController.deleteCustomerTransaction);
router.route('/edit/:id').put(checkAdminMiddleware.checkAdmin, customerTransactionController.updateCustomerTransaction);

module.exports = router;
