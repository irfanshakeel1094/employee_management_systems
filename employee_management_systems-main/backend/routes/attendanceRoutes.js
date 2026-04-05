const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Get all attendance records
router.get('/', attendanceController.getAllAttendance);

// Get attendance by date range
router.get('/range', attendanceController.getByDateRange);

// Get monthly summary
router.get('/summary/monthly', attendanceController.getMonthlySummary);

// Get attendance by employee ID
router.get('/employee/:employeeId', attendanceController.getByEmployeeId);

// Mark attendance
router.post('/', attendanceController.markAttendance);

// Update attendance
router.put('/:id', attendanceController.updateAttendance);

// Delete attendance
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
