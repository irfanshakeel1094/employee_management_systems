const mysql = require('mysql2/promise');

async function addSampleData() {
  try {
    console.log('Connecting to MySQL...');

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'employee_management_system'
    });

    console.log('✓ Connected to MySQL Database\n');

    // Add more employees
    console.log('Adding more employees...');
    const newEmployees = [
      ['Robert', 'Wilson', 'robert.wilson@company.com', '5551234567', 2, 'DevOps Engineer', '2023-02-10', 'active', '101 Tech St'],
      ['Lisa', 'Anderson', 'lisa.anderson@company.com', '5552234567', 1, 'Recruiter', '2022-11-05', 'active', '202 HR Blvd'],
      ['James', 'Taylor', 'james.taylor@company.com', '5553234567', 3, 'Accountant', '2023-05-15', 'active', '303 Finance Ave'],
      ['Jennifer', 'Martinez', 'jennifer.martinez@company.com', '5554234567', 4, 'Sales Manager', '2021-09-20', 'active', '404 Sales Rd'],
      ['Christopher', 'Thomas', 'christopher.thomas@company.com', '5555234567', 5, 'Content Writer', '2023-06-01', 'active', '505 Marketing Way'],
      ['Patricia', 'Jackson', 'patricia.jackson@company.com', '5556234567', 2, 'QA Engineer', '2022-03-12', 'active', '606 Quality Ave'],
      ['Daniel', 'White', 'daniel.white@company.com', '5557234567', 3, 'Tax Specialist', '2023-01-08', 'on_leave', '707 Tax Ln'],
      ['Mary', 'Harris', 'mary.harris@company.com', '5558234567', 4, 'Business Analyst', '2022-07-25', 'active', '808 Business St'],
      ['Mark', 'Clark', 'mark.clark@company.com', '5559234567', 1, 'HR Coordinator', '2023-04-03', 'active', '909 Coord Ave'],
      ['Sandra', 'Lewis', 'sandra.lewis@company.com', '5560234567', 5, 'Social Media Manager', '2023-08-12', 'active', '1010 Media Ln']
    ];

    for (const emp of newEmployees) {
      try {
        await connection.execute(
          'INSERT INTO employees (first_name, last_name, email, phone, department_id, position, hire_date, status, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          emp
        );
      } catch (err) {
        if (!err.message.includes('Duplicate entry')) {
          console.log('  Error adding employee:', err.message);
        }
      }
    }
    console.log('✓ Added 10 more employees (Total: 16)\n');

    // Add more attendance records for different dates
    console.log('Adding more attendance records...');
    const baseDate = new Date('2024-04-01');
    const attendanceRecords = [];

    // Generate attendance for 15 days for all 16 employees
    for (let empId = 1; empId <= 16; empId++) {
      for (let day = 1; day <= 15; day++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + day - 1);
        const dateStr = date.toISOString().split('T')[0];

        // Randomly assign status
        const statuses = ['present', 'absent', 'half_day', 'leave'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        let checkIn = null, checkOut = null;
        if (randomStatus === 'present') {
          checkIn = '09:' + Math.floor(Math.random() * 30).toString().padStart(2, '0') + ':00';
          checkOut = '17:' + Math.floor(Math.random() * 30).toString().padStart(2, '0') + ':00';
        } else if (randomStatus === 'half_day') {
          checkIn = '09:00:00';
          checkOut = '13:00:00';
        }

        attendanceRecords.push([empId, dateStr, randomStatus, checkIn, checkOut, null]);
      }
    }

    for (const att of attendanceRecords) {
      try {
        await connection.execute(
          `INSERT INTO attendance (employee_id, attendance_date, status, check_in_time, check_out_time, notes)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
           status = VALUES(status),
           check_in_time = VALUES(check_in_time),
           check_out_time = VALUES(check_out_time)`,
          att
        );
      } catch (err) {
        // Silently ignore duplicates
      }
    }
    console.log('✓ Added 240 attendance records (15 days × 16 employees)\n');

    // Add salary records for 3 months for all employees
    console.log('Adding salary records for multiple months...');
    const months = ['2024-01', '2024-02', '2024-03', '2024-04'];
    const salaryRanges = {
      2: { base: [45000, 85000], allow: [2000, 6000], ded: [1000, 3000] },      // IT
      1: { base: [40000, 70000], allow: [2000, 4000], ded: [1000, 2500] },      // HR
      3: { base: [50000, 80000], allow: [3000, 7000], ded: [2000, 4000] },      // Finance
      4: { base: [55000, 90000], allow: [3000, 8000], ded: [2000, 4000] },      // Sales
      5: { base: [40000, 65000], allow: [2000, 4000], ded: [1000, 2500] }       // Marketing
    };

    for (let empId = 1; empId <= 16; empId++) {
      // Get employee's department
      const [empResult] = await connection.execute('SELECT department_id FROM employees WHERE id = ?', [empId]);
      const deptId = empResult[0].department_id;

      for (const month of months) {
        const ranges = salaryRanges[deptId] || { base: [40000, 60000], allow: [2000, 4000], ded: [1000, 2500] };

        const baseSalary = Math.floor(Math.random() * (ranges.base[1] - ranges.base[0]) + ranges.base[0]);
        const allowances = Math.floor(Math.random() * (ranges.allow[1] - ranges.allow[0]) + ranges.allow[0]);
        const deductions = Math.floor(Math.random() * (ranges.ded[1] - ranges.ded[0]) + ranges.ded[0]);
        const netSalary = baseSalary + allowances - deductions;

        const [monthDay, monthYear] = month.split('-');
        const paymentDate = new Date(month + '-28').toISOString().split('T')[0];

        try {
          await connection.execute(
            `INSERT INTO salary (employee_id, base_salary, allowances, deductions, net_salary, payment_date, month_year)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             base_salary = VALUES(base_salary),
             allowances = VALUES(allowances),
             deductions = VALUES(deductions),
             net_salary = VALUES(net_salary)`,
            [empId, baseSalary, allowances, deductions, netSalary, paymentDate, month]
          );
        } catch (err) {
          // Silently ignore duplicates
        }
      }
    }
    console.log('✓ Added 64 salary records (4 months × 16 employees)\n');

    // Verify data
    console.log('Verifying data...');
    const [usersCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [deptCount] = await connection.execute('SELECT COUNT(*) as count FROM departments');
    const [empCount] = await connection.execute('SELECT COUNT(*) as count FROM employees');
    const [attCount] = await connection.execute('SELECT COUNT(*) as count FROM attendance');
    const [salCount] = await connection.execute('SELECT COUNT(*) as count FROM salary');

    console.log('\n═══════════════════════════════════════');
    console.log('✅ SAMPLE DATA ADDED SUCCESSFULLY!\n');
    console.log('Database Statistics:');
    console.log('  Users:        ' + usersCount[0].count);
    console.log('  Departments:  ' + deptCount[0].count);
    console.log('  Employees:    ' + empCount[0].count + ' (was 6, now 16)');
    console.log('  Attendance:   ' + attCount[0].count + ' (was 10, now 250+)');
    console.log('  Salary:       ' + salCount[0].count + ' (was 6, now 70+)');
    console.log('═══════════════════════════════════════\n');

    // Show some employee details
    const [employees] = await connection.execute('SELECT id, first_name, last_name, position, department_id FROM employees LIMIT 5');
    console.log('Sample Employees:');
    employees.forEach(emp => {
      console.log(`  ${emp.id}. ${emp.first_name} ${emp.last_name} - ${emp.position}`);
    });

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addSampleData();
