const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Get all employees
router.get('/', employeeController.getAllEmployees);

// Search employees
router.get('/search', employeeController.searchEmployees);

// Get employee by ID
router.get('/:id', employeeController.getEmployeeById);

// Create employee
router.post('/', employeeController.createEmployee);

// Update employee
router.put('/:id', employeeController.updateEmployee);

// Delete employee
router.delete('/:id', employeeController.deleteEmployee);

// Get employees by department
router.get('/department/:departmentId', employeeController.getByDepartment);

module.exports = router;
