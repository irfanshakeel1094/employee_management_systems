const pool = require('../config/database');

class Department {
  // Get all departments
  static async getAll() {
    const query = 'SELECT * FROM departments ORDER BY department_name';
    const [rows] = await pool.query(query);
    return rows;
  }

  // Get department by ID
  static async getById(id) {
    const query = 'SELECT * FROM departments WHERE department_id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  // Create new department
  static async create(data) {
    const query = 'INSERT INTO departments (department_name, location, budget) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [data.name, data.location, 0]);
    return result.insertId;
  }

  // Update department
  static async update(id, data) {
    const query = 'UPDATE departments SET department_name = ?, location = ?, budget = ? WHERE department_id = ?';
    const [result] = await pool.query(query, [data.name, data.location, data.budget || 0, id]);
    return result.affectedRows;
  }

  // Delete department
  static async delete(id) {
    const query = 'DELETE FROM departments WHERE department_id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows;
  }
}

module.exports = Department;
