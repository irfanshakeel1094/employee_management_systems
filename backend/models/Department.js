const pool = require('../config/database');

class Department {
  // Get all departments
  static async getAll() {
    const query = 'SELECT * FROM departments ORDER BY name';
    const [rows] = await pool.query(query);
    return rows;
  }

  // Get department by ID
  static async getById(id) {
    const query = 'SELECT * FROM departments WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  // Create new department
  static async create(data) {
    const query = 'INSERT INTO departments (name, description) VALUES (?, ?)';
    const [result] = await pool.query(query, [data.name, data.description]);
    return result.insertId;
  }

  // Update department
  static async update(id, data) {
    const query = 'UPDATE departments SET name = ?, description = ? WHERE id = ?';
    const [result] = await pool.query(query, [data.name, data.description, id]);
    return result.affectedRows;
  }

  // Delete department
  static async delete(id) {
    const query = 'DELETE FROM departments WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows;
  }
}

module.exports = Department;
