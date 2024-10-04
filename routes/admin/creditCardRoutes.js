const express = require('express');
const creditCardController = require('../../controllers/admin/creditCardController.js');

const authMiddleware = require('../../middlewares/authMiddleware.js');
const checkAdminMiddleware = require('../../middlewares/checkAdminMiddleware.js');

const router = express.Router();

router.use(authMiddleware.authenticateToken);

router.route('/').post(checkAdminMiddleware.checkAdmin, creditCardController.createCreditCard);
router.route('/:id').delete(checkAdminMiddleware.checkAdmin, creditCardController.deleteCreditCard);
router.route('/:id').put(checkAdminMiddleware.checkAdmin, creditCardController.updateCreditCard);

module.exports = router;
