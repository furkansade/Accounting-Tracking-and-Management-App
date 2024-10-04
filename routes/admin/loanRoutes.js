const express = require('express');
const loanController = require('../../controllers/admin/loanController.js');

const authMiddleware = require('../../middlewares/authMiddleware.js');
const checkAdminMiddleware = require('../../middlewares/checkAdminMiddleware.js');

const router = express.Router();

router.use(authMiddleware.authenticateToken);

router.route('/').post(checkAdminMiddleware.checkAdmin, loanController.createLoan);
router.route('/:id/installment/:index').put(checkAdminMiddleware.checkAdmin, loanController.installmentPaid);
router.route('/:id').delete(checkAdminMiddleware.checkAdmin, loanController.deleteLoan);

module.exports = router;
