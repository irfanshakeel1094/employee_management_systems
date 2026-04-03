const pool = require('../config/database');

class Attendance {
  // Get all attendance records
  static async getAll() {
    const query = `
      SELECT a.*, e.first_name, e.last_name, e.email
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      ORDER BY a.attendance_date DESC, a.employee_id
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  // Get attendance for specific employee
  static async getByEmployeeId(employeeId, month = null) {
    let query = `
      SELECT a.*, e.first_name, e.last_name
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE a.employee_id = ?
    `;
    const params = [employeeId];

    if (month) {
      query += ' AND YEAR(a.attendance_date) = YEAR(?) AND MONTH(a.attendance_date) = MONTH(?)';
      params.push(new Date(month), new Date(month));
    }

    query += ' ORDER BY a.attendance_date DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  }

  // Get attendance by date range
  static async getByDateRange(startDate, endDate, employeeId = null) {
    let query = `
      SELECT a.*, e.first_name, e.last_name
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE a.attendance_date BETWEEN ? AND ?
    `;
    const params = [startDate, endDate];

    if (employeeId) {
      query += ' AND a.employee_id = ?';
      params.push(employeeId);
    }

    query += ' ORDER BY a.attendance_date DESC, a.employee_id';
    const [rows] = await pool.query(query, params);
    return rows;
  }

  // Record attendance
  static async create(data) {
    const query = `
      INSERT INTO attendance (employee_id, attendance_date, status, check_in_time, check_out_time, notes)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      status = VALUES(status),
      check_in_time = VALUES(check_in_time),
      check_out_time = VALUES(check_out_time),
      notes = VALUES(notes)
    `;
    const [result] = await pool.query(query, [
      data.employee_id,
      data.attendance_date,
      data.status,
      data.check_in_time || null,
      data.check_out_time || null,
      data.notes || null
    ]);
    return result.insertId || result.affectedRows;
  }

  // Update attendance
  static async update(id, data) {
    const query = `
      UPDATE attendance
      SET status = ?, check_in_time = ?, check_out_time = ?, notes = ?
      WHERE id = ?
    `;
    const [result] = await pool.query(query, [
      data.status,
      data.check_in_time || null,
      data.check_out_time || null,
      data.notes || null,
      id
    ]);
    return result.affectedRows;
  }

  // Delete attendance
  static async delete(id) {
    const query = 'DELETE FROM attendance WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows;
  }

  // Get attendance summary for a month
  static async getMonthlySummary(year, month) {
    const query = `
      SELECT
        a.employee_id,
        e.first_name,
        e.last_name,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_days,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_days,
        SUM(CASE WHEN a.status = 'half_day' THEN 1 ELSE 0 END) as half_days,
        SUM(CASE WHEN a.status = 'leave' THEN 1 ELSE 0 END) as leave_days
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE YEAR(a.attendance_date) = ? AND MONTH(a.attendance_date) = ?
      GROUP BY a.employee_id, e.first_name, e.last_name
      ORDER BY e.first_name
    `;
    const [rows] = await pool.query(query, [year, month]);
    return rows;
  }
}

module.exports = Attendance;
