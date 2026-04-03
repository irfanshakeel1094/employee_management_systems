# Setup Instructions

Complete step-by-step guide to set up and run the Employee Management System.

## Prerequisites

Before starting, ensure you have:

- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **MySQL Server** (running on localhost)
- **MySQL Workbench** or command line client
- **Web Browser** (Chrome, Firefox, Safari, Edge)
- **Code Editor** (VS Code recommended)

---

## Part 1: MySQL Database Setup

### Step 1.1: Verify MySQL is Running

**Windows:**
```bash
# Check if MySQL service is running
sc query MySQL80
```

**Mac/Linux:**
```bash
# Check MySQL status
sudo systemctl status mysql
```

If MySQL is not running, start it:
- Windows: Services → Find "MySQL" → Start
- Mac: System Preferences → MySQL
- Linux: `sudo systemctl start mysql`

### Step 1.2: Create Database

**Option A: Using MySQL Command Line**

1. Open Command Prompt/Terminal
2. Connect to MySQL:
```bash
mysql -u root -p
```
3. Enter your MySQL password

4. Run the database schema:
```sql
SOURCE C:\path\to\database\schema.sql;
SOURCE C:\path\to\database\sample_data.sql;
```

**Option B: Using MySQL Workbench**

1. Open MySQL Workbench
2. Create a new connection (if needed)
3. Connect to MySQL server
4. File → Open SQL Script → Select `database/schema.sql`
5. Execute (Ctrl+Shift+Enter)
6. Repeat for `database/sample_data.sql`

### Step 1.3: Verify Database Creation

```bash
mysql -u root -p
mysql> use employee_management_db;
mysql> show tables;
```

You should see 5 tables:
- users
- departments
- employees
- attendance
- salary

---

## Part 2: Backend Setup

### Step 2.1: Install Dependencies

1. Open Command Prompt/Terminal
2. Navigate to backend folder:
```bash
cd employee-management-system/backend
```

3. Install Node packages:
```bash
npm install
```

This will install:
- express
- mysql2
- dotenv
- cors
- body-parser
- bcryptjs
- jsonwebtoken

### Step 2.2: Configure Environment Variables

1. Open `.env` file in the backend folder:
```
PORT=5000
HOST=localhost

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employee_management_db
DB_PORT=3306

JWT_SECRET=your_jwt_secret_key

NODE_ENV=development
```

2. Update `DB_PASSWORD` with your MySQL password
3. Save the file

**Important:** Replace `your_mysql_password` with your actual MySQL password!

### Step 2.3: Start Backend Server

```bash
npm start
```

You should see:
```
✓ Connected to MySQL Database
✓ Server started successfully
✓ Running on http://localhost:5000
```

**Keep this terminal window open!**

---

## Part 3: Frontend Setup

### Step 3.1: Open in Web Browser

1. Open your web browser (Chrome, Firefox, etc.)
2. Go to: `file:///C:/dbms/employee-management-system/frontend/index.html`

Or if you have a local web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server frontend -p 8000
```

Then visit: `http://localhost:8000`

### Step 3.2: Login

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

**Important:** The simple login doesn't validate credentials - just enter any username to proceed (for demo purposes)

---

## Part 4: Exploring the System

### Dashboard
- View overview of employees and departments
- See quick statistics
- Access main features

### Employees
- View all employees
- Search by name or email
- Add new employees
- Edit employee details
- Delete employees

### Attendance
- Mark attendance for employees
- View attendance records
- Track by date range
- Monthly summaries

### Salary
- Add salary records
- View by employee or month
- Track allowances and deductions
- Department-wise summaries

### Departments
- View all departments
- Add new departments
- Delete departments

---

## Part 5: Testing API

### Using Browser Console

1. Open any page with Firefox/Chrome DevTools (F12)
2. Go to Console tab
3. Test API calls:

```javascript
// Get all employees
fetch('http://localhost:5000/api/employees')
  .then(res => res.json())
  .then(data => console.log(data));

// Get all departments
fetch('http://localhost:5000/api/departments')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Using Postman

1. Download [Postman](https://www.postman.com/)
2. Create new request
3. Method: GET
4. URL: `http://localhost:5000/api/employees`
5. Send

See API_DOCUMENTATION.md for more endpoints.

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
1. Verify MySQL is running
2. Check DB_PASSWORD in .env
3. Check database exists: `employee_management_db`
4. Check DB_USERNAME is correct (default: root)

```bash
mysql -u root -p -e "SHOW DATABASES;"
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with the number shown)
taskkill /PID <PID> /F

# Or change PORT in .env file
PORT=5001
```

### Issue: API is not responding

**Solution:**
1. Make sure backend server is running
2. Check console for error messages
3. Verify .env file settings
4. Restart backend: `npm start`

### Issue: Frontend not loading

**Solution:**
1. Check file path is correct
2. Verify all .html files exist in frontend folder
3. Check browser console for JavaScript errors (F12)
4. Clear browser cache (Ctrl+Shift+Delete)

### Issue: CORS error

**Solution:**
- CORS is enabled in backend
- Make sure frontend URL is correct
- Restart backend server

---

## Sample Data

The system comes with sample data:

**Employees:**
- John Doe (IT - Senior Developer)
- Jane Smith (HR - HR Manager)
- Michael Johnson (Finance - Financial Analyst)
- Sarah Williams (Sales - Sales Executive)
- David Brown (IT - Junior Developer)
- Emily Davis (Marketing - Marketing Manager)

**Departments:**
- Human Resources
- Information Technology
- Finance
- Sales
- Marketing

**Attendance Records:**
- Sample records for April 2024

**Salary Records:**
- March 2024 salary data

---

## Database Backup

### Backup Database

```bash
# Windows
mysqldump -u root -p employee_management_db > backup.sql

# Mac/Linux
mysqldump -u root -p employee_management_db > backup.sql
```

### Restore Database

```bash
mysql -u root -p employee_management_db < backup.sql
```

---

## Production Deployment Checklist

- [ ] Change JWT_SECRET in .env
- [ ] Use HTTPS instead of HTTP
- [ ] Enable proper authentication (JWT)
- [ ] Add input validation
- [ ] Enable rate limiting
- [ ] Use environment-specific configurations
- [ ] Add logging
- [ ] Enable CORS properly
- [ ] Use MySQL password hash
- [ ] Remove sample data
- [ ] Set NODE_ENV=production

---

## Quick Start Summary

```bash
# 1. Setup database
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample_data.sql

# 2. Install backend dependencies
cd backend
npm install

# 3. Update .env with MySQL password

# 4. Start backend
npm start

# 5. Open frontend in browser
# file:///C:/dbms/employee-management-system/frontend/index.html

# 6. Login with admin/admin123
```

---

## Next Steps

1. **Test all features** - Add/edit/delete employees, departments, etc.
2. **Review database schema** - Check database design in schema.sql
3. **Study API** - Review API_DOCUMENTATION.md
4. **Customize** - Modify colors, fonts, or add new features
5. **Add Security** - Implement JWT authentication
6. **Deploy** - Deploy to cloud (Heroku, AWS, etc.)

---

## Support & Resources

- **API Documentation**: See API_DOCUMENTATION.md
- **README**: See README.md
- **Database Schema**: See database/schema.sql
- **Node.js Documentation**: https://nodejs.org/docs/
- **Express.js Documentation**: https://expressjs.com/
- **MySQL Documentation**: https://dev.mysql.com/doc/

---

**Last Updated**: April 2024
**System Version**: 1.0.0
