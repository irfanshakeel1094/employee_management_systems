const mysql = require('mysql2/promise');

async function setupDatabase() {
  try {
    console.log('Connecting to MySQL...');

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'employee_management_system'
    });

    console.log('✓ Connected to MySQL Database');

    // Drop existing tables with CASCADE
    console.log('Dropping existing tables...');
    try {
      await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
      const dropQueries = [
        'DROP TABLE IF EXISTS attendance',
        'DROP TABLE IF EXISTS salary',
        'DROP TABLE IF EXISTS leaves',
        'DROP TABLE IF EXISTS employees',
        'DROP TABLE IF EXISTS departments',
        'DROP TABLE IF EXISTS users'
      ];

      for (const query of dropQueries) {
        try {
          await connection.execute(query);
        } catch (e) {
          console.log(`  Note: ${e.message}`);
        }
      }
      await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    } catch (e) {
      console.log('Warning during table drop:', e.message);
    }

    console.log('✓ Dropped existing tables');

    // Create tables
    console.log('Creating tables...');

    const createUsersTable = `
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        role ENUM('admin', 'manager', 'employee') DEFAULT 'employee',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;

    const createDepartmentsTable = `
      CREATE TABLE departments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;

    const createEmployeesTable = `
      CREATE TABLE employees (
        id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15),
        department_id INT,
        position VARCHAR(100),
        hire_date DATE,
        status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      )`;

    const createAttendanceTable = `
      CREATE TABLE attendance (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_id INT NOT NULL,
        attendance_date DATE NOT NULL,
        status ENUM('present', 'absent', 'half_day', 'leave') DEFAULT 'absent',
        check_in_time TIME,
        check_out_time TIME,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
        UNIQUE KEY unique_attendance (employee_id, attendance_date)
      )`;

    const createSalaryTable = `
      CREATE TABLE salary (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_id INT NOT NULL,
        base_salary DECIMAL(10, 2) NOT NULL,
        allowances DECIMAL(10, 2) DEFAULT 0,
        deductions DECIMAL(10, 2) DEFAULT 0,
        net_salary DECIMAL(10, 2),
        payment_date DATE,
        month_year VARCHAR(7),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      )`;

    await connection.execute(createUsersTable);
    await connection.execute(createDepartmentsTable);
    await connection.execute(createEmployeesTable);
    await connection.execute(createAttendanceTable);
    await connection.execute(createSalaryTable);

    console.log('✓ Created all tables');

    // Create indexes
    console.log('Creating indexes...');
    await connection.execute('CREATE INDEX idx_employee_department ON employees(department_id)');
    await connection.execute('CREATE INDEX idx_attendance_employee ON attendance(employee_id)');
    await connection.execute('CREATE INDEX idx_attendance_date ON attendance(attendance_date)');
    await connection.execute('CREATE INDEX idx_salary_employee ON salary(employee_id)');
    await connection.execute('CREATE INDEX idx_salary_month ON salary(month_year)');
    console.log('✓ Created indexes');

    // Insert sample data
    console.log('Inserting sample data...');

    // Insert users
    await connection.execute(
      "INSERT INTO users (username, password, email, role) VALUES ('admin', '$2b$10$5bE8qZlJGCG9FzwPw5e1k.h0R1RlJg8Xc5eL2Z6bP8Q7N9M1Zm6He', 'admin@company.com', 'admin')"
    );
    await connection.execute(
      "INSERT INTO users (username, password, email, role) VALUES ('manager1', '$2b$10$5bE8qZlJGCG9FzwPw5e1k.h0R1RlJg8Xc5eL2Z6bP8Q7N9M1Zm6He', 'manager1@company.com', 'manager')"
    );

    // Insert departments
    const departments = [
      ['Human Resources', 'HR Department'],
      ['Information Technology', 'IT Department'],
      ['Finance', 'Finance Department'],
      ['Sales', 'Sales Department'],
      ['Marketing', 'Marketing Department']
    ];

    for (const [name, desc] of departments) {
      await connection.execute('INSERT INTO departments (name, description) VALUES (?, ?)', [name, desc]);
    }

    // Insert employees
    const employees = [
      ['John', 'Doe', 'john.doe@company.com', '1234567890', 2, 'Senior Developer', '2022-01-15', 'active', '123 Main St'],
      ['Jane', 'Smith', 'jane.smith@company.com', '1234567891', 1, 'HR Manager', '2021-06-20', 'active', '456 Oak Ave'],
      ['Michael', 'Johnson', 'michael.johnson@company.com', '1234567892', 3, 'Financial Analyst', '2023-03-10', 'active', '789 Elm St'],
      ['Sarah', 'Williams', 'sarah.williams@company.com', '1234567893', 4, 'Sales Executive', '2023-01-05', 'on_leave', '321 Pine Rd'],
      ['David', 'Brown', 'david.brown@company.com', '1234567894', 2, 'Junior Developer', '2023-09-01', 'active', '654 Cedar Ln'],
      ['Emily', 'Davis', 'emily.davis@company.com', '1234567895', 5, 'Marketing Manager', '2022-07-12', 'active', '987 Birch Way']
    ];

    for (const emp of employees) {
      await connection.execute(
        'INSERT INTO employees (first_name, last_name, email, phone, department_id, position, hire_date, status, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        emp
      );
    }

    // Insert attendance
    const attendance = [
      [1, '2024-04-01', 'present', '09:00:00', '17:30:00'],
      [1, '2024-04-02', 'present', '09:15:00', '17:45:00'],
      [2, '2024-04-01', 'present', '08:45:00', '17:15:00'],
      [2, '2024-04-02', 'absent', null, null],
      [3, '2024-04-01', 'present', '09:05:00', '17:40:00'],
      [3, '2024-04-02', 'half_day', '09:00:00', '13:00:00'],
      [4, '2024-04-01', 'leave', null, null],
      [4, '2024-04-02', 'leave', null, null],
      [5, '2024-04-01', 'present', '09:10:00', '17:50:00'],
      [6, '2024-04-01', 'present', '09:00:00', '17:30:00']
    ];

    for (const att of attendance) {
      await connection.execute(
        'INSERT INTO attendance (employee_id, attendance_date, status, check_in_time, check_out_time) VALUES (?, ?, ?, ?, ?)',
        att
      );
    }

    // Insert salary
    const salary = [
      [1, 75000, 5000, 2000, 78000, '2024-03-31', '2024-03'],
      [2, 60000, 3000, 1500, 61500, '2024-03-31', '2024-03'],
      [3, 55000, 2500, 1000, 56500, '2024-03-31', '2024-03'],
      [4, 65000, 4000, 1800, 67200, '2024-03-31', '2024-03'],
      [5, 45000, 2000, 800, 46200, '2024-03-31', '2024-03'],
      [6, 70000, 5000, 2200, 72800, '2024-03-31', '2024-03']
    ];

    for (const sal of salary) {
      await connection.execute(
        'INSERT INTO salary (employee_id, base_salary, allowances, deductions, net_salary, payment_date, month_year) VALUES (?, ?, ?, ?, ?, ?, ?)',
        sal
      );
    }

    console.log('✓ Inserted sample data');

    // Verify
    const [usersCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [deptCount] = await connection.execute('SELECT COUNT(*) as count FROM departments');
    const [empCount] = await connection.execute('SELECT COUNT(*) as count FROM employees');
    const [attCount] = await connection.execute('SELECT COUNT(*) as count FROM attendance');
    const [salCount] = await connection.execute('SELECT COUNT(*) as count FROM salary');

    console.log('\n✅ DATABASE SETUP COMPLETE!\n');
    console.log('Users:', usersCount[0].count);
    console.log('Departments:', deptCount[0].count);
    console.log('Employees:', empCount[0].count);
    console.log('Attendance:', attCount[0].count);
    console.log('Salary:', salCount[0].count);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
