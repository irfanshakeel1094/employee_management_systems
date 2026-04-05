-- ============================================================
--   EMPLOYMENT MANAGEMENT SYSTEM - MySQL Database Schema
--   Created for VS Code / MySQL Workbench
--   Run this file against a MySQL 8.0+ server
-- ============================================================

-- ------------------------------------------------------------
-- 1. CREATE & SELECT DATABASE
-- ------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS employment_management;
USE employment_management;

-- ------------------------------------------------------------
-- 2. DEPARTMENTS
-- ------------------------------------------------------------
CREATE TABLE departments (
    department_id   INT             AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100)    NOT NULL UNIQUE,
    location        VARCHAR(150),
    budget          DECIMAL(15, 2)  DEFAULT 0.00,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 3. JOB POSITIONS
-- ------------------------------------------------------------
CREATE TABLE job_positions (
    position_id     INT             AUTO_INCREMENT PRIMARY KEY,
    position_title  VARCHAR(100)    NOT NULL,
    department_id   INT             NOT NULL,
    min_salary      DECIMAL(10, 2)  NOT NULL,
    max_salary      DECIMAL(10, 2)  NOT NULL,
    description     TEXT,
    CONSTRAINT fk_position_dept FOREIGN KEY (department_id)
        REFERENCES departments(department_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 4. EMPLOYEES
-- ------------------------------------------------------------
CREATE TABLE employees (
    employee_id     INT             AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(50)     NOT NULL,
    last_name       VARCHAR(50)     NOT NULL,
    email           VARCHAR(100)    NOT NULL UNIQUE,
    phone           VARCHAR(20),
    date_of_birth   DATE,
    gender          ENUM('Male', 'Female', 'Other'),
    address         VARCHAR(255),
    hire_date       DATE            NOT NULL,
    department_id   INT,
    position_id     INT,
    manager_id      INT,                          -- self-referencing FK
    employment_type ENUM('Full-Time', 'Part-Time', 'Contract', 'Intern')
                    NOT NULL DEFAULT 'Full-Time',
    status          ENUM('Active', 'Inactive', 'Terminated', 'On-Leave')
                    NOT NULL DEFAULT 'Active',
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_emp_dept     FOREIGN KEY (department_id)
        REFERENCES departments(department_id)  ON DELETE SET NULL,
    CONSTRAINT fk_emp_position FOREIGN KEY (position_id)
        REFERENCES job_positions(position_id)  ON DELETE SET NULL,
    CONSTRAINT fk_emp_manager  FOREIGN KEY (manager_id)
        REFERENCES employees(employee_id)      ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- 5. SALARIES  (history of salary changes)
-- ------------------------------------------------------------
CREATE TABLE salaries (
    salary_id       INT             AUTO_INCREMENT PRIMARY KEY,
    employee_id     INT             NOT NULL,
    basic_salary    DECIMAL(10, 2)  NOT NULL,
    allowances      DECIMAL(10, 2)  DEFAULT 0.00,
    deductions      DECIMAL(10, 2)  DEFAULT 0.00,
    net_salary      DECIMAL(10, 2)  GENERATED ALWAYS AS
                    (basic_salary + allowances - deductions) STORED,
    effective_date  DATE            NOT NULL,
    end_date        DATE,
    CONSTRAINT fk_salary_emp FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 6. ATTENDANCE
-- ------------------------------------------------------------
CREATE TABLE attendance (
    attendance_id   INT             AUTO_INCREMENT PRIMARY KEY,
    employee_id     INT             NOT NULL,
    work_date       DATE            NOT NULL,
    check_in        TIME,
    check_out       TIME,
    status          ENUM('Present', 'Absent', 'Half-Day', 'Holiday', 'On-Leave')
                    NOT NULL DEFAULT 'Present',
    remarks         VARCHAR(255),
    UNIQUE KEY uq_emp_date (employee_id, work_date),
    CONSTRAINT fk_attend_emp FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 7. LEAVE TYPES
-- ------------------------------------------------------------
CREATE TABLE leave_types (
    leave_type_id   INT             AUTO_INCREMENT PRIMARY KEY,
    leave_name      VARCHAR(50)     NOT NULL UNIQUE,   -- e.g. Annual, Sick, Maternity
    max_days        INT             NOT NULL DEFAULT 0,
    is_paid         BOOLEAN         NOT NULL DEFAULT TRUE
);

-- ------------------------------------------------------------
-- 8. LEAVE REQUESTS
-- ------------------------------------------------------------
CREATE TABLE leave_requests (
    leave_id        INT             AUTO_INCREMENT PRIMARY KEY,
    employee_id     INT             NOT NULL,
    leave_type_id   INT             NOT NULL,
    start_date      DATE            NOT NULL,
    end_date        DATE            NOT NULL,
    total_days      INT             NOT NULL,
    reason          TEXT,
    status          ENUM('Pending', 'Approved', 'Rejected', 'Cancelled')
                    NOT NULL DEFAULT 'Pending',
    approved_by     INT,
    applied_on      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_emp    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)  ON DELETE CASCADE,
    CONSTRAINT fk_leave_type   FOREIGN KEY (leave_type_id)
        REFERENCES leave_types(leave_type_id),
    CONSTRAINT fk_leave_approver FOREIGN KEY (approved_by)
        REFERENCES employees(employee_id)  ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- 9. PERFORMANCE REVIEWS
-- ------------------------------------------------------------
CREATE TABLE performance_reviews (
    review_id       INT             AUTO_INCREMENT PRIMARY KEY,
    employee_id     INT             NOT NULL,
    reviewer_id     INT,
    review_period   VARCHAR(20)     NOT NULL,          -- e.g. 'Q1-2025'
    rating          TINYINT         NOT NULL
                    CHECK (rating BETWEEN 1 AND 5),
    comments        TEXT,
    review_date     DATE            NOT NULL,
    CONSTRAINT fk_review_emp      FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id) ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id)
        REFERENCES employees(employee_id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- 10. PAYROLL  (monthly processed payroll)
-- ------------------------------------------------------------
CREATE TABLE payroll (
    payroll_id      INT             AUTO_INCREMENT PRIMARY KEY,
    employee_id     INT             NOT NULL,
    pay_month       TINYINT         NOT NULL CHECK (pay_month BETWEEN 1 AND 12),
    pay_year        YEAR            NOT NULL,
    basic_salary    DECIMAL(10, 2)  NOT NULL,
    allowances      DECIMAL(10, 2)  DEFAULT 0.00,
    deductions      DECIMAL(10, 2)  DEFAULT 0.00,
    tax             DECIMAL(10, 2)  DEFAULT 0.00,
    net_pay         DECIMAL(10, 2)  NOT NULL,
    payment_date    DATE,
    payment_status  ENUM('Pending', 'Processed', 'Failed')
                    NOT NULL DEFAULT 'Pending',
    UNIQUE KEY uq_payroll (employee_id, pay_month, pay_year),
    CONSTRAINT fk_payroll_emp FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 11. TRAINING PROGRAMS
-- ------------------------------------------------------------
CREATE TABLE training_programs (
    training_id     INT             AUTO_INCREMENT PRIMARY KEY,
    program_name    VARCHAR(150)    NOT NULL,
    description     TEXT,
    trainer         VARCHAR(100),
    start_date      DATE,
    end_date        DATE,
    mode            ENUM('Online', 'Offline', 'Hybrid') DEFAULT 'Online'
);

-- ------------------------------------------------------------
-- 12. EMPLOYEE TRAININGS  (many-to-many bridge)
-- ------------------------------------------------------------
CREATE TABLE employee_trainings (
    id              INT             AUTO_INCREMENT PRIMARY KEY,
    employee_id     INT             NOT NULL,
    training_id     INT             NOT NULL,
    enrollment_date DATE            NOT NULL,
    completion_date DATE,
    status          ENUM('Enrolled', 'Completed', 'Dropped') DEFAULT 'Enrolled',
    UNIQUE KEY uq_emp_training (employee_id, training_id),
    CONSTRAINT fk_et_emp      FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)       ON DELETE CASCADE,
    CONSTRAINT fk_et_training FOREIGN KEY (training_id)
        REFERENCES training_programs(training_id) ON DELETE CASCADE
);

-- ============================================================
--   SAMPLE DATA
-- ============================================================

-- Departments
INSERT INTO departments (department_name, location, budget) VALUES
('Human Resources',   'Floor 1', 500000.00),
('Engineering',       'Floor 2', 2000000.00),
('Marketing',         'Floor 3', 800000.00),
('Finance',           'Floor 4', 700000.00),
('Operations',        'Floor 5', 600000.00);

-- Job Positions
INSERT INTO job_positions (position_title, department_id, min_salary, max_salary, description) VALUES
('HR Manager',            1,  60000, 90000,  'Oversees HR operations'),
('Software Engineer',     2,  70000, 120000, 'Develops software products'),
('Senior Engineer',       2,  100000, 160000,'Leads engineering projects'),
('Marketing Analyst',     3,  50000, 80000,  'Analyzes market trends'),
('Finance Manager',       4,  80000, 120000, 'Manages financial planning'),
('Operations Lead',       5,  65000, 100000, 'Supervises daily operations');

-- Employees (manager_id set after insert via UPDATE)
INSERT INTO employees
    (first_name, last_name, email, phone, date_of_birth, gender,
     hire_date, department_id, position_id, employment_type, status)
VALUES
('Alice',   'Johnson',  'alice.johnson@company.com',  '9876543210', '1985-04-12', 'Female', '2018-01-15', 1, 1, 'Full-Time', 'Active'),
('Bob',     'Smith',    'bob.smith@company.com',      '9876543211', '1990-07-22', 'Male',   '2019-03-10', 2, 2, 'Full-Time', 'Active'),
('Carol',   'White',    'carol.white@company.com',    '9876543212', '1988-11-05', 'Female', '2017-06-01', 2, 3, 'Full-Time', 'Active'),
('David',   'Brown',    'david.brown@company.com',    '9876543213', '1992-02-18', 'Male',   '2020-09-20', 3, 4, 'Full-Time', 'Active'),
('Eva',     'Davis',    'eva.davis@company.com',      '9876543214', '1995-08-30', 'Female', '2021-05-12', 4, 5, 'Full-Time', 'Active'),
('Frank',   'Miller',   'frank.miller@company.com',   '9876543215', '1987-12-10', 'Male',   '2016-11-03', 5, 6, 'Contract', 'Active');

-- Assign managers (Carol manages Bob; Alice manages everyone in HR)
UPDATE employees SET manager_id = 3 WHERE employee_id = 2;   -- Bob reports to Carol
UPDATE employees SET manager_id = 1 WHERE employee_id = 4;   -- David reports to Alice

-- Salaries
INSERT INTO salaries (employee_id, basic_salary, allowances, deductions, effective_date) VALUES
(1, 75000, 5000, 2000, '2018-01-15'),
(2, 85000, 6000, 3000, '2019-03-10'),
(3, 120000, 10000, 5000,'2017-06-01'),
(4, 60000, 4000, 1500, '2020-09-20'),
(5, 95000, 8000, 4000, '2021-05-12'),
(6, 70000, 5000, 2500, '2016-11-03');

-- Attendance (sample for today)
INSERT INTO attendance (employee_id, work_date, check_in, check_out, status) VALUES
(1, CURDATE(), '09:00:00', '18:00:00', 'Present'),
(2, CURDATE(), '09:15:00', '18:15:00', 'Present'),
(3, CURDATE(), NULL,       NULL,       'On-Leave'),
(4, CURDATE(), '09:05:00', '17:55:00', 'Present'),
(5, CURDATE(), '09:30:00', '18:30:00', 'Present'),
(6, CURDATE(), NULL,       NULL,       'Absent');

-- Leave Types
INSERT INTO leave_types (leave_name, max_days, is_paid) VALUES
('Annual Leave',    20, TRUE),
('Sick Leave',      10, TRUE),
('Maternity Leave', 90, TRUE),
('Paternity Leave', 15, TRUE),
('Unpaid Leave',    30, FALSE);

-- Leave Requests
INSERT INTO leave_requests
    (employee_id, leave_type_id, start_date, end_date, total_days, reason, status, approved_by)
VALUES
(3, 1, '2025-12-23', '2025-12-27', 5, 'Family vacation',  'Approved', 1),
(2, 2, '2025-11-10', '2025-11-11', 2, 'Not feeling well', 'Approved', 3),
(4, 1, '2026-01-02', '2026-01-06', 5, 'New Year holiday', 'Pending',  NULL);

-- Performance Reviews
INSERT INTO performance_reviews
    (employee_id, reviewer_id, review_period, rating, comments, review_date)
VALUES
(2, 3, 'Q4-2025', 4, 'Consistently delivers quality work.',         '2025-12-31'),
(3, 1, 'Q4-2025', 5, 'Excellent leadership and technical skills.',  '2025-12-31'),
(4, 1, 'Q4-2025', 3, 'Good performance, room for improvement.',     '2025-12-31');

-- Payroll
INSERT INTO payroll
    (employee_id, pay_month, pay_year, basic_salary, allowances, deductions, tax, net_pay, payment_date, payment_status)
VALUES
(1, 12, 2025, 75000, 5000, 2000, 7000, 71000, '2025-12-31', 'Processed'),
(2, 12, 2025, 85000, 6000, 3000, 8000, 80000, '2025-12-31', 'Processed'),
(3, 12, 2025,120000,10000, 5000,12000,113000, '2025-12-31', 'Processed'),
(4, 12, 2025, 60000, 4000, 1500, 5500, 57000, '2025-12-31', 'Processed'),
(5, 12, 2025, 95000, 8000, 4000, 9500, 89500, '2025-12-31', 'Processed'),
(6, 12, 2025, 70000, 5000, 2500, 7000, 65500, '2025-12-31', 'Processed');

-- Training Programs
INSERT INTO training_programs (program_name, description, trainer, start_date, end_date, mode) VALUES
('MySQL Fundamentals',    'Core database concepts',             'Dr. Raj Kumar',   '2025-01-10', '2025-01-14', 'Online'),
('Leadership Skills',     'Management and communication',       'Ms. Priya Nair',  '2025-02-15', '2025-02-17', 'Offline'),
('Agile & Scrum',         'Agile methodology for dev teams',    'Mr. Arun Prasad', '2025-03-01', '2025-03-03', 'Hybrid');

-- Employee Trainings
INSERT INTO employee_trainings (employee_id, training_id, enrollment_date, completion_date, status) VALUES
(2, 1, '2025-01-05', '2025-01-14', 'Completed'),
(3, 3, '2025-02-20', '2025-03-03', 'Completed'),
(1, 2, '2025-02-10', NULL,         'Enrolled');

-- ============================================================
--   USEFUL VIEWS
-- ============================================================

-- Full employee info
CREATE OR REPLACE VIEW vw_employee_details AS
SELECT
    e.employee_id,
    CONCAT(e.first_name, ' ', e.last_name)          AS full_name,
    e.email,
    e.phone,
    e.hire_date,
    e.employment_type,
    e.status,
    d.department_name,
    p.position_title,
    CONCAT(m.first_name, ' ', m.last_name)           AS manager_name
FROM employees e
LEFT JOIN departments   d ON e.department_id = d.department_id
LEFT JOIN job_positions p ON e.position_id   = p.position_id
LEFT JOIN employees     m ON e.manager_id    = m.employee_id;

-- Monthly payroll summary
CREATE OR REPLACE VIEW vw_payroll_summary AS
SELECT
    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
    d.department_name,
    py.pay_month,
    py.pay_year,
    py.basic_salary,
    py.allowances,
    py.deductions,
    py.tax,
    py.net_pay,
    py.payment_status
FROM payroll py
JOIN employees   e ON py.employee_id   = e.employee_id
JOIN departments d ON e.department_id  = d.department_id;

-- Attendance summary per employee
CREATE OR REPLACE VIEW vw_attendance_summary AS
SELECT
    e.employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
    COUNT(CASE WHEN a.status = 'Present'  THEN 1 END) AS days_present,
    COUNT(CASE WHEN a.status = 'Absent'   THEN 1 END) AS days_absent,
    COUNT(CASE WHEN a.status = 'On-Leave' THEN 1 END) AS days_on_leave
FROM employees e
LEFT JOIN attendance a ON e.employee_id = a.employee_id
GROUP BY e.employee_id, employee_name;

-- ============================================================
--   END OF SCRIPT
-- ============================================================
