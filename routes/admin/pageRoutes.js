const express = require('express');
const pageController = require('../../controllers/admin/pageController.js');
const authMiddleware = require('../../middlewares/authMiddleware.js');
const checkAdminMiddleware = require('../../middlewares/checkAdminMiddleware.js');
const checkCreateMiddleware = require('../../middlewares/checkCreateMiddleware.js');

const router = express.Router();

router.route('/').get(authMiddleware.authenticateToken, pageController.adminHomePage);
router.route('/site-info').get(checkAdminMiddleware.checkAdmin, authMiddleware.authenticateToken, pageController.adminSiteInfoPage);
router.route('/users').get(checkAdminMiddleware.checkAdmin, authMiddleware.authenticateToken, pageController.adminUsersPage);

router.route('/customers').get(authMiddleware.authenticateToken, pageController.adminCustomersPage);
router.route('/customers/:id').get(authMiddleware.authenticateToken, pageController.adminCustomerDetailPage);

router.route('/cash-ledger').get(authMiddleware.authenticateToken, pageController.adminCashLedgerPage);

router.route('/employees').get(authMiddleware.authenticateToken, pageController.adminEmployeesPage);
router.route('/employees/detail/:id').get(authMiddleware.authenticateToken, pageController.adminEmployeeDetailPage);
router.route('/employees/create').get(authMiddleware.authenticateToken, checkCreateMiddleware.checkCreate, pageController.adminCreateEmployeePage);
router.route('/employees/exited-employees').get(authMiddleware.authenticateToken, pageController.adminExitedEmployeesPage);
router.route('/credit-cards').get(authMiddleware.authenticateToken, checkAdminMiddleware.checkAdmin, pageController.adminCreditCardsPage);
router.route('/loans').get(authMiddleware.authenticateToken, checkAdminMiddleware.checkAdmin, pageController.adminLoansPage);

router.route('/logs').get(checkAdminMiddleware.checkAdmin, authMiddleware.authenticateToken, pageController.adminLogsPage);

module.exports = router;