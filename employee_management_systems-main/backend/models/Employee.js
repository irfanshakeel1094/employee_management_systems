const pool = require('../config/database');

class Employee {
  // Get all employees with department info
  static async getAll() {
    const query = `
      SELECT e.*, d.department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.department_id
      ORDER BY e.created_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  // Get employee by ID
  static async getById(id) {
    const query = `
      SELECT e.*, d.department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.department_id
      WHERE e.employee_id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  // Search employees by name or email
  static async search(searchTerm) {
    const query = `
      SELECT e.*, d.department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.department_id
      WHERE e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ?
      ORDER BY e.created_at DESC
    `;
    const searchPattern = `%${searchTerm}%`;
    const [rows] = await pool.query(query, [searchPattern, searchPattern, searchPattern]);
    return rows;
  }

  // Create new employee
  static async create(data) {
    const query = `
      INSERT INTO employees (first_name, last_name, email, phone, department_id, position_id, hire_date, address, employment_type, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      data.first_name,
      data.last_name,
      data.email,
      data.phone,
      data.department_id,
      data.position,
      data.hire_date,
      data.address,
      data.employment_type || 'Full-Time',
      data.status || 'Active'
    ]);
    return result.insertId;
  }

  // Update employee
  static async update(id, data) {
    const query = `
      UPDATE employees
      SET first_name = ?, last_name = ?, email = ?, phone = ?,
          department_id = ?, position_id = ?, hire_date = ?, status = ?, address = ?
      WHERE employee_id = ?
    `;
    const [result] = await pool.query(query, [
      data.first_name,
      data.last_name,
      data.email,
      data.phone,
      data.department_id,
      data.position,
      data.hire_date,
      data.status,
      data.address,
      id
    ]);
    return result.affectedRows;
  }

  // Delete employee
  static async delete(id) {
    const query = 'DELETE FROM employees WHERE employee_id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows;
  }

  // Get employees by department
  static async getByDepartment(departmentId) {
    const query = `
      SELECT e.*, d.department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.department_id
      WHERE e.department_id = ? AND e.status = 'Active'
    `;
    const [rows] = await pool.query(query, [departmentId]);
    return rows;
  }
}

module.exports = Employee;
