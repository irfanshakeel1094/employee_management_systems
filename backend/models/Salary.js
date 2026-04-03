const pool = require('../config/database');

class Salary {
  // Get all salary records
  static async getAll() {
    const query = `
      SELECT s.*, e.first_name, e.last_name, e.email
      FROM salary s
      JOIN employees e ON s.employee_id = e.id
      ORDER BY s.month_year DESC, e.first_name
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  // Get salary for specific employee
  static async getByEmployeeId(employeeId) {
    const query = `
      SELECT s.*, e.first_name, e.last_name
      FROM salary s
      JOIN employees e ON s.employee_id = e.id
      WHERE s.employee_id = ?
      ORDER BY s.month_year DESC
    `;
    const [rows] = await pool.query(query, [employeeId]);
    return rows;
  }

  // Get salary by month and year
  static async getByMonthYear(monthYear) {
    const query = `
      SELECT s.*, e.first_name, e.last_name, e.email
      FROM salary s
      JOIN employees e ON s.employee_id = e.id
      WHERE s.month_year = ?
      ORDER BY e.first_name
    `;
    const [rows] = await pool.query(query, [monthYear]);
    return rows;
  }

  // Create salary record
  static async create(data) {
    const netSalary = (data.base_salary + data.allowances) - data.deductions;
    const query = `
      INSERT INTO salary (employee_id, base_salary, allowances, deductions, net_salary, payment_date, month_year)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      data.employee_id,
      data.base_salary,
      data.allowances || 0,
      data.deductions || 0,
      netSalary,
      data.payment_date,
      data.month_year
    ]);
    return result.insertId;
  }

  // Update salary record
  static async update(id, data) {
    const netSalary = (data.base_salary + data.allowances) - data.deductions;
    const query = `
      UPDATE salary
      SET base_salary = ?, allowances = ?, deductions = ?, net_salary = ?, payment_date = ?
      WHERE id = ?
    `;
    const [result] = await pool.query(query, [
      data.base_salary,
      data.allowances || 0,
      data.deductions || 0,
      netSalary,
      data.payment_date,
      id
    ]);
    return result.affectedRows;
  }

  // Delete salary record
  static async delete(id) {
    const query = 'DELETE FROM salary WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows;
  }

  // Get salary record by ID
  static async getById(id) {
    const query = `
      SELECT s.*, e.first_name, e.last_name
      FROM salary s
      JOIN employees e ON s.employee_id = e.id
      WHERE s.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  // Get salary summary by department
  static async getSummaryByDepartment() {
    const query = `
      SELECT
        d.id,
        d.name as department_name,
        COUNT(DISTINCT e.id) as total_employees,
        SUM(s.base_salary) as total_base_salary,
        SUM(s.net_salary) as total_net_salary,
        AVG(s.base_salary) as avg_salary
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id
      LEFT JOIN salary s ON e.id = s.employee_id
      GROUP BY d.id, d.name
      ORDER BY d.name
    `;
    const [rows] = await pool.query(query);
    return rows;
  }
}

module.exports = Salary;
