const Employee = require('../models/Employee');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.getAll();
    res.status(200).json({
      success: true,
      data: employees,
      message: 'Employees retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving employees',
      error: error.message
    });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.getById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
      message: 'Employee retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving employee',
      error: error.message
    });
  }
};

// Search employees
exports.searchEmployees = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const employees = await Employee.search(q);
    res.status(200).json({
      success: true,
      data: employees,
      message: 'Search completed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching employees',
      error: error.message
    });
  }
};

// Create employee
exports.createEmployee = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, department_id, position, hire_date, address } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required'
      });
    }

    const employeeId = await Employee.create({
      first_name,
      last_name,
      email,
      phone,
      department_id,
      position,
      hire_date,
      address
    });

    res.status(201).json({
      success: true,
      data: { id: employeeId },
      message: 'Employee created successfully'
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating employee',
      error: error.message
    });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, department_id, position, hire_date, status, address } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required'
      });
    }

    const affectedRows = await Employee.update(id, {
      first_name,
      last_name,
      email,
      phone,
      department_id,
      position,
      hire_date,
      status,
      address
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating employee',
      error: error.message
    });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Employee.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting employee',
      error: error.message
    });
  }
};

// Get employees by department
exports.getByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const employees = await Employee.getByDepartment(departmentId);

    res.status(200).json({
      success: true,
      data: employees,
      message: 'Employees retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving employees',
      error: error.message
    });
  }
};
