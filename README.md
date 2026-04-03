# Employee Management System

A complete full-stack Employee Management System built with Node.js, Express, MySQL, HTML, CSS, and JavaScript. This system allows organizations to manage employees, departments, attendance, and salary records efficiently.

## Features

✅ **Admin Authentication** - Secure login system
✅ **Employee Management** - Add, edit, delete, and search employees
✅ **Department Management** - Manage company departments
✅ **Attendance Tracking** - Mark and track employee attendance
✅ **Salary Management** - Manage employee salaries with allowances and deductions
✅ **Dashboard** - Overview of key metrics
✅ **Responsive Design** - Works on desktop and mobile devices
✅ **RESTful API** - Complete REST API for all operations

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Node Packages**: mysql2, dotenv, cors, body-parser, bcryptjs, jsonwebtoken

## Project Structure

```
employee-management-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── employeeController.js
│   │   ├── departmentController.js
│   │   ├── attendanceController.js
│   │   └── salaryController.js
│   ├── models/
│   │   ├── Employee.js
│   │   ├── Department.js
│   │   ├── Attendance.js
│   │   └── Salary.js
│   ├── routes/
│   │   ├── employeeRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── attendanceRoutes.js
│   │   └── salaryRoutes.js
│   ├── app.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── employees.html
│   ├── add_employee.html
│   ├── edit_employee.html
│   ├── attendance.html
│   ├── salary.html
│   ├── departments.html
│   ├── style.css
│   └── script.js
├── database/
│   ├── schema.sql
│   └── sample_data.sql
└── README.md
```

## Installation Guide

### Prerequisites
- Node.js (v14+)
- MySQL Server (running on localhost:3306)
- Git/Command Line

### Step 1: Setup MySQL Database

1. Open MySQL Workbench or command line
2. Create the database and tables:

```bash
# From project root
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample_data.sql
```

### Step 2: Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure .env file:
```
PORT=5000
HOST=localhost

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employee_management_db
DB_PORT=3306

JWT_SECRET=your_jwt_secret_key_change_this

NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
```

Server will run on: `http://localhost:5000`

### Step 3: Frontend Setup

1. Open frontend folder in a web server or file explorer
2. Open `index.html` in a browser

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

## Database Tables

### users
- id (PK)
- username (UNIQUE)
- password
- email
- role (admin, manager, employee)
- created_at

### departments
- id (PK)
- name
- description
- created_at

### employees
- id (PK)
- first_name
- last_name
- email (UNIQUE)
- phone
- department_id (FK)
- position
- hire_date
- status (active, inactive, on_leave)
- address
- created_at
- updated_at

### attendance
- id (PK)
- employee_id (FK)
- attendance_date
- status (present, absent, half_day, leave)
- check_in_time
- check_out_time
- notes
- created_at

### salary
- id (PK)
- employee_id (FK)
- base_salary
- allowances
- deductions
- net_salary
- payment_date
- month_year
- created_at
- updated_at

## API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `GET /api/employees/search?q=query` - Search employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/employee/:employeeId` - Get attendance by employee
- `GET /api/attendance/range?startDate=X&endDate=Y` - Get by date range
- `GET /api/attendance/summary/monthly?year=Y&month=M` - Get monthly summary
- `POST /api/attendance` - Mark attendance
- `PUT /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance

### Salary
- `GET /api/salary` - Get all salary records
- `GET /api/salary/:id` - Get salary by ID
- `GET /api/salary/employee/:employeeId` - Get employee salary records
- `GET /api/salary/month-year?monthYear=YYYY-MM` - Get by month/year
- `GET /api/salary/summary/department` - Get department summary
- `POST /api/salary` - Create salary record
- `PUT /api/salary/:id` - Update salary record
- `DELETE /api/salary/:id` - Delete salary record

## API Response Format

All API responses follow this format:

**Success Response:**
```json
{
    "success": true,
    "data": {...},
    "message": "Operation successful"
}
```

**Error Response:**
```json
{
    "success": false,
    "message": "Error message",
    "error": "Error details"
}
```

## Usage Examples

### Add an Employee
```javascript
const employee = {
    first_name: "John",
    last_name: "Doe",
    email: "john@company.com",
    phone: "1234567890",
    department_id: 2,
    position: "Developer",
    hire_date: "2024-01-15",
    address: "123 Main St"
};

fetch('http://localhost:5000/api/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee)
})
.then(res => res.json())
.then(data => console.log(data));
```

### Mark Attendance
```javascript
const attendance = {
    employee_id: 1,
    attendance_date: "2024-04-03",
    status: "present",
    check_in_time: "09:00",
    check_out_time: "17:30"
};

fetch('http://localhost:5000/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attendance)
})
.then(res => res.json())
.then(data => console.log(data));
```

## Troubleshooting

### Database Connection Error
- Ensure MySQL server is running
- Check DB credentials in .env file
- Verify database exists: `employee_management_db`

### Port Already in Use
- Change PORT in .env file
- Or kill process using port 5000

### CORS Error
- CORS is enabled in backend
- Ensure frontend URL is allowed

## Future Enhancements

- 🔐 JWT Authentication
- 📊 Advanced Analytics & Reports
- 📅 Leave Management System
- 💼 Payroll Module
- 📧 Email Notifications
- 📱 Mobile App
- 🔍 Advanced Search Filters
- ⏰ Shift Management

## License

This project is open source and available for academic use.

## Support

For issues or questions, please refer to the documentation or contact the development team.

---

**Version**: 1.0.0
**Last Updated**: April 2024
