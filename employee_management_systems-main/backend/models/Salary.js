const pool = require('../config/database');

class Salary {
  // Get all salary records
  static async getAll() {
    const query = `
      SELECT s.*, e.first_name, e.last_name, e.email
      FROM salaries s
      JOIN employees e ON s.employee_id = e.employee_id
      ORDER BY s.effective_date DESC, e.first_name
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  // Get salary for specific employee
  static async getByEmployeeId(employeeId) {
    const query = `
      SELECT s.*, e.first_name, e.last_name
      FROM salaries s
      JOIN employees e ON s.employee_id = e.employee_id
      WHERE s.employee_id = ?
      ORDER BY s.effective_date DESC
    `;
    const [rows] = await pool.query(query, [employeeId]);
    return rows;
  }

  // Get salary by month and year
  static async getByMonthYear(monthYear) {
    const query = `
      SELECT s.*, e.first_name, e.last_name, e.email
      FROM salaries s
      JOIN employees e ON s.employee_id = e.employee_id
      WHERE DATE_FORMAT(s.effective_date, '%Y-%m') = ?
      ORDER BY e.first_name
    `;
    const [rows] = await pool.query(query, [monthYear]);
    return rows;
  }

  // Create salary record
  static async create(data) {
    const query = `
      INSERT INTO salaries (employee_id, basic_salary, allowances, deductions, effective_date, end_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      data.employee_id,
      data.basic_salary,
      data.allowances || 0,
      data.deductions || 0,
      data.effective_date,
      data.end_date || null
    ]);
    return result.insertId;
  }

  // Update salary record
  static async update(id, data) {
    const query = `
      UPDATE salaries
      SET basic_salary = ?, allowances = ?, deductions = ?, effective_date = ?, end_date = ?
      WHERE salary_id = ?
    `;
    const [result] = await pool.query(query, [
      data.basic_salary,
      data.allowances || 0,
      data.deductions || 0,
      data.effective_date,
      data.end_date || null,
      id
    ]);
    return result.affectedRows;
  }

  // Delete salary record
  static async delete(id) {
    const query = 'DELETE FROM salaries WHERE salary_id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows;
  }

  // Get salary record by ID
  static async getById(id) {
    const query = `
      SELECT s.*, e.first_name, e.last_name
      FROM salaries s
      JOIN employees e ON s.employee_id = e.employee_id
      WHERE s.salary_id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  // Get salary summary by department
  static async getSummaryByDepartment() {
    const query = `
      SELECT
        d.department_id,
        d.department_name,
        COUNT(DISTINCT e.employee_id) as total_employees,
        SUM(s.basic_salary) as total_base_salary,
        SUM(s.basic_salary + s.allowances - s.deductions) as total_net_salary,
        AVG(s.basic_salary) as avg_salary
      FROM departments d
      LEFT JOIN employees e ON d.department_id = e.department_id
      LEFT JOIN salaries s ON e.employee_id = s.employee_id
      GROUP BY d.department_id, d.department_name
      ORDER BY d.department_name
    `;
    const [rows] = await pool.query(query);
    return rows;
  }
}

module.exports = Salary;
