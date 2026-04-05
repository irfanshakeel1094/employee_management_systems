const Salary = require('../models/Salary');

// Get all salary records
exports.getAllSalary = async (req, res) => {
  try {
    const salaries = await Salary.getAll();
    res.status(200).json({
      success: true,
      data: salaries,
      message: 'Salary records retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving salary',
      error: error.message
    });
  }
};

// Get salary by employee ID
exports.getByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const salaries = await Salary.getByEmployeeId(employeeId);

    res.status(200).json({
      success: true,
      data: salaries,
      message: 'Salary records retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving salary',
      error: error.message
    });
  }
};

// Get salary by month and year
exports.getByMonthYear = async (req, res) => {
  try {
    const { monthYear } = req.query;

    if (!monthYear) {
      return res.status(400).json({
        success: false,
        message: 'Month year is required (format: YYYY-MM)'
      });
    }

    const salaries = await Salary.getByMonthYear(monthYear);
    res.status(200).json({
      success: true,
      data: salaries,
      message: 'Salary records retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving salary',
      error: error.message
    });
  }
};

// Get salary by ID
exports.getSalaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.getById(id);

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: salary,
      message: 'Salary retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving salary',
      error: error.message
    });
  }
};

// Create salary record
exports.createSalary = async (req, res) => {
  try {
    const { employee_id, basic_salary, allowances, deductions, effective_date, end_date } = req.body;

    if (!employee_id || !basic_salary || !effective_date) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, basic salary, and effective date are required'
      });
    }

    const salaryId = await Salary.create({
      employee_id,
      basic_salary,
      allowances: allowances || 0,
      deductions: deductions || 0,
      effective_date,
      end_date
    });

    res.status(201).json({
      success: true,
      data: { id: salaryId },
      message: 'Salary record created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating salary',
      error: error.message
    });
  }
};

// Update salary record
exports.updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { basic_salary, allowances, deductions, effective_date, end_date } = req.body;

    if (!basic_salary) {
      return res.status(400).json({
        success: false,
        message: 'Basic salary is required'
      });
    }

    const affectedRows = await Salary.update(id, {
      basic_salary,
      allowances: allowances || 0,
      deductions: deductions || 0,
      effective_date,
      end_date
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Salary updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating salary',
      error: error.message
    });
  }
};

// Delete salary record
exports.deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Salary.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Salary deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting salary',
      error: error.message
    });
  }
};

// Get salary summary by department
exports.getSummaryByDepartment = async (req, res) => {
  try {
    const summary = await Salary.getSummaryByDepartment();
    res.status(200).json({
      success: true,
      data: summary,
      message: 'Department salary summary retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving summary',
      error: error.message
    });
  }
};
