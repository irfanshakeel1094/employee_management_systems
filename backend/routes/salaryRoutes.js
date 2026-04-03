const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');

// Get all salary records
router.get('/', salaryController.getAllSalary);

// Get salary summary by department
router.get('/summary/department', salaryController.getSummaryByDepartment);

// Get salary by month year
router.get('/month-year', salaryController.getByMonthYear);

// Get salary by employee ID
router.get('/employee/:employeeId', salaryController.getByEmployeeId);

// Get salary by ID
router.get('/:id', salaryController.getSalaryById);

// Create salary record
router.post('/', salaryController.createSalary);

// Update salary record
router.put('/:id', salaryController.updateSalary);

// Delete salary record
router.delete('/:id', salaryController.deleteSalary);

module.exports = router;
