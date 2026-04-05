const Attendance = require('../models/Attendance');

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.getAll();
    res.status(200).json({
      success: true,
      data: attendance,
      message: 'Attendance records retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving attendance',
      error: error.message
    });
  }
};

// Get attendance by employee ID
exports.getByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month } = req.query;

    const attendance = await Attendance.getByEmployeeId(employeeId, month);
    res.status(200).json({
      success: true,
      data: attendance,
      message: 'Attendance retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving attendance',
      error: error.message
    });
  }
};

// Get attendance by date range
exports.getByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const attendance = await Attendance.getByDateRange(startDate, endDate, employeeId || null);
    res.status(200).json({
      success: true,
      data: attendance,
      message: 'Attendance records retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving attendance',
      error: error.message
    });
  }
};

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { employee_id, work_date, status, check_in, check_out, remarks } = req.body;

    if (!employee_id || !work_date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, work date, and status are required'
      });
    }

    const result = await Attendance.create({
      employee_id,
      work_date,
      status,
      check_in,
      check_out,
      remarks
    });

    res.status(201).json({
      success: true,
      data: { id: result },
      message: 'Attendance marked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, check_in, check_out, remarks } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const affectedRows = await Attendance.update(id, {
      status,
      check_in,
      check_out,
      remarks
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating attendance',
      error: error.message
    });
  }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Attendance.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting attendance',
      error: error.message
    });
  }
};

// Get monthly summary
exports.getMonthlySummary = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'Year and month are required'
      });
    }

    const summary = await Attendance.getMonthlySummary(year, month);
    res.status(200).json({
      success: true,
      data: summary,
      message: 'Monthly summary retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving monthly summary',
      error: error.message
    });
  }
};
