const express = require('express');
const cashLedgerController = require('../../controllers/admin/cashLedgerController.js');
const authMiddleware = require('../../middlewares/authMiddleware.js');
const checkAdminMiddleware = require('../../middlewares/checkAdminMiddleware.js');
const checkCreateMiddleware = require('../../middlewares/checkCreateMiddleware.js');


const router = express.Router();

router.use(authMiddleware.authenticateToken);

router.route('/').post(checkCreateMiddleware.checkCreate, cashLedgerController.createCashLedger);
router.route('/:id').delete(checkAdminMiddleware.checkAdmin, cashLedgerController.deleteCashLedger);
router.route('/:id').put(checkAdminMiddleware.checkAdmin, cashLedgerController.updateCashLedger);
router.route('/export-excel').get(checkAdminMiddleware.checkAdmin, cashLedgerController.exportsCashLedgers);

module.exports = router;