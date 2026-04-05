# QUICK REFERENCE GUIDE

## Project Overview

**Employee Management System** - A full-stack application for managing employees, attendance, and salary.

---

## File Structure

```
📁 employee-management-system/
├── 📁 backend/                 (Node.js + Express Server)
│   ├── 📁 config/
│   │   └── database.js         (MySQL Connection)
│   ├── 📁 controllers/         (Business Logic)
│   │   ├── employeeController.js
│   │   ├── departmentController.js
│   │   ├── attendanceController.js
│   │   └── salaryController.js
│   ├── 📁 models/              (Data Models)
│   │   ├── Employee.js
│   │   ├── Department.js
│   │   ├── Attendance.js
│   │   └── Salary.js
│   ├── 📁 routes/              (API Routes)
│   │   ├── employeeRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── attendanceRoutes.js
│   │   └── salaryRoutes.js
│   ├── app.js                  (Main Server File)
│   ├── package.json
│   └── .env                    (Configuration)
│
├── 📁 frontend/                (HTML/CSS/JavaScript)
│   ├── index.html              (Login Page)
│   ├── dashboard.html          (Main Dashboard)
│   ├── employees.html          (Employee List)
│   ├── add_employee.html       (Add Form)
│   ├── edit_employee.html      (Edit Form)
│   ├── attendance.html         (Attendance Management)
│   ├── salary.html             (Salary Management)
│   ├── departments.html        (Department Management)
│   ├── style.css               (Styling)
│   └── script.js               (Client Logic)
│
├── 📁 database/                (SQL Scripts)
│   ├── schema.sql              (Database Structure)
│   └── sample_data.sql         (Test Data)
│
├── README.md                   (Main Documentation)
├── SETUP_INSTRUCTIONS.md       (Setup Guide)
├── API_DOCUMENTATION.md        (API Reference)
└── .gitignore                  (Git Configuration)
```

---

## Quick Commands

### Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure .env file
# Update DB_PASSWORD with your MySQL password

# Start server
npm start

# Server runs on http://localhost:5000
```

### Setup Database

```bash
# Import schema
mysql -u root -p employee_management_db < database/schema.sql

# Import sample data
mysql -u root -p employee_management_db < database/sample_data.sql
```

### Open Frontend

```bash
# Open in browser
file:///C:/dbms/employee-management-system/frontend/index.html
```

---

## Database Tables

| Table | Purpose |
|-------|---------|
| **users** | Admin login credentials |
| **departments** | Company departments |
| **employees** | Employee information |
| **attendance** | Daily attendance records |
| **salary** | Salary & payment tracking |

---

## Key API Endpoints

### Employees
- `GET /api/employees` - List all
- `POST /api/employees` - Create
- `PUT /api/employees/:id` - Update
- `DELETE /api/employees/:id` - Delete
- `GET /api/employees/search?q=name` - Search

### Departments
- `GET /api/departments` - List all
- `POST /api/departments` - Create
- `PUT /api/departments/:id` - Update
- `DELETE /api/departments/:id` - Delete

### Attendance
- `GET /api/attendance` - List all
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/summary/monthly` - Monthly report
- `GET /api/attendance/range?startDate=X&endDate=Y` - Date range

### Salary
- `GET /api/salary` - List all
- `POST /api/salary` - Create record
- `GET /api/salary/summary/department` - Department summary
- `GET /api/salary/month-year?monthYear=YYYY-MM` - By month

---

## Login Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |

Note: In demo mode, any username works (for testing purposes)

---

## Common Tasks

### Add New Employee

1. Go to **Employees** → **Add Employee**
2. Fill in form:
   - First Name & Last Name (required)
   - Email (required, unique)
   - Phone, Department, Position
   - Hire Date, Address
3. Click "Add Employee"

### Mark Attendance

1. Go to **Attendance** → **Mark Attendance**
2. Select Employee & Date
3. Choose Status: Present, Absent, Half Day, Leave
4. Add Check-in/Check-out times (optional)
5. Click "Mark Attendance"

### Add Salary Record

1. Go to **Salary** → **Add Salary Record**
2. Select Employee & Month-Year
3. Enter Base Salary
4. Add Allowances & Deductions
5. Click "Add Salary Record"
6. Net Salary = (Base + Allowances) - Deductions

### Manage Departments

1. Go to **Departments**
2. Fill in Department Name & Description
3. Click "Add Department"
4. View/Delete from list below

---

## Frontend Pages

| Page | Route | Purpose |
|------|-------|---------|
| Login | index.html | User authentication |
| Dashboard | dashboard.html | Overview & statistics |
| Employees | employees.html | View & search employees |
| Add Employee | add_employee.html | Add new employee form |
| Edit Employee | edit_employee.html?id=X | Modify employee |
| Attendance | attendance.html | Track attendance |
| Salary | salary.html | Manage salaries |
| Departments | departments.html | Manage departments |

---

## Backend Controllers

### employeeController.js
- getAllEmployees()
- getEmployeeById()
- createEmployee()
- updateEmployee()
- deleteEmployee()
- searchEmployees()

### departmentController.js
- getAllDepartments()
- createDepartment()
- updateDepartment()
- deleteDepartment()

### attendanceController.js
- markAttendance()
- getByEmployeeId()
- getByDateRange()
- getMonthlySummary()
- updateAttendance()

### salaryController.js
- createSalary()
- getSalaryByEmployee()
- getSalaryByMonthYear()
- getSummaryByDepartment()
- updateSalary()

---

## Database Relationships

```
departments (1) ──────── (N) employees
                          │
                          ├── (1:N) attendance
                          └── (1:N) salary
```

---

## Environment Variables (.env)

```
PORT=5000                          # Server port
HOST=localhost                     # Server host
DB_HOST=localhost                  # MySQL host
DB_USER=root                       # MySQL username
DB_PASSWORD=your_password          # MySQL password
DB_NAME=employee_management_db     # Database name
DB_PORT=3306                       # MySQL port
JWT_SECRET=your_secret             # JWT token secret
NODE_ENV=development               # Environment
```

---

## Troubleshooting Checklist

- [ ] MySQL is running
- [ ] Database `employee_management_db` exists
- [ ] `.env` file has correct DB credentials
- [ ] Backend server is started (`npm start`)
- [ ] Frontend can access `http://localhost:5000/api`
- [ ] No port 5000 conflicts
- [ ] Browser cache cleared
- [ ] JavaScript console shows no errors (F12)

---

## Testing

### Test Employee Creation

```javascript
fetch('http://localhost:5000/api/employees', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    position: 'Developer'
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

---

## Performance Features

✅ Database indexes on key fields
✅ Efficient SQL queries
✅ Connection pooling
✅ Error handling
✅ CORS enabled
✅ RESTful API design

---

## Security Notes (Development)

⚠️ Currently uses simple login (demo mode)
⚠️ Add JWT authentication for production
⚠️ Validate all inputs server-side
⚠️ Use HTTPS in production
⚠️ Hash passwords with bcrypt
⚠️ Sanitize user input
⚠️ Use environment variables for secrets

---

## Extensions & Future Features

- [ ] JWT Authentication
- [ ] Employee Performance Reviews
- [ ] Leave Management
- [ ] Payroll Processing
- [ ] Email Notifications
- [ ] Shift Management
- [ ] Mobile App
- [ ] Advanced Analytics
- [ ] Multi-language Support
- [ ] Dark Mode

---

## Documentation Files

| File | Content |
|------|---------|
| **README.md** | Project overview & features |
| **SETUP_INSTRUCTIONS.md** | Step-by-step setup guide |
| **API_DOCUMENTATION.md** | Detailed API reference |
| **QUICK_REFERENCE.md** | This file - quick lookup |

---

## Useful Resources

- **Express.js**: https://expressjs.com/
- **MySQL**: https://dev.mysql.com/doc/
- **Node.js**: https://nodejs.org/docs/
- **REST API Design**: https://restfulapi.net/
- **async/await**: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await

---

## Contact & Support

For issues:
1. Check SETUP_INSTRUCTIONS.md → Troubleshooting
2. Review error message in browser console (F12)
3. Check backend server logs
4. Verify database connection

---

**Version**: 1.0.0
**Last Updated**: April 2024
**Status**: Ready for Academic Use ✓
