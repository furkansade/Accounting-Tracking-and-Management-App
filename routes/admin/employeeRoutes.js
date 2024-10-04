const express = require('express');
const employeeController = require('../../controllers/admin/employeeController.js');
const authMiddleware = require('../../middlewares/authMiddleware.js');
const checkAdminMiddleware = require('../../middlewares/checkAdminMiddleware.js')
const checkCreateMiddleware = require('../../middlewares/checkCreateMiddleware.js');



const router = express.Router();

router.use(authMiddleware.authenticateToken);

router.route('/').post(checkCreateMiddleware.checkCreate, employeeController.createEmployee);
router.route('/:id').put(checkAdminMiddleware.checkAdmin, employeeController.updateEmployee);
router.route('/delete/:id').put(checkAdminMiddleware.checkAdmin, employeeController.deleteEmployee);
router.route('/add-leave/:id').put(checkCreateMiddleware.checkCreate, employeeController.addLeaveDate);
router.route('/delete-leave/:id/:leaveId').delete(checkAdminMiddleware.checkAdmin, employeeController.deleteLeaveDate);

module.exports = router;