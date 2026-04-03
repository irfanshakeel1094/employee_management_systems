# 🚀 QUICK START - EMPLOYEE MANAGEMENT SYSTEM

**Your complete Employee Management System is ready!**

## ⚡ Get Running in 5 Minutes

### STEP 1: Setup MySQL Database
```bash
# Open MySQL command line or Workbench

# Run these commands:
mysql -u root -p < C:\dbms\employee-management-system\database\schema.sql
mysql -u root -p < C:\dbms\employee-management-system\database\sample_data.sql
```

### STEP 2: Start Backend Server
```bash
# Open Command Prompt, navigate to:
cd C:\dbms\employee-management-system\backend

# Install dependencies:
npm install

# Update .env file - change this line:
DB_PASSWORD=your_mysql_password

# Start server:
npm start

# You should see: ✓ Server started successfully
# Keep this window open!
```

### STEP 3: Open Frontend
```
Open your browser and go to:
file:///C:/dbms/employee-management-system/frontend/index.html

Login with:
Username: admin
Password: admin123
```

### STEP 4: Test API (Optional)
```javascript
// Open browser DevTools (F12)
// Go to Console tab
// Paste this:
fetch('http://localhost:5000/api/employees')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## ✅ Quick Checklist

- [ ] MySQL server is running
- [ ] Database created (schema + sample data imported)
- [ ] Backend dependencies installed (npm install done)
- [ ] .env file updated with MySQL password
- [ ] Backend server running (npm start)
- [ ] Frontend loaded in browser
- [ ] Logged in successfully

---

## 🎯 What You Can Do

✅ Add/Edit/Delete Employees
✅ Manage Departments
✅ Track Attendance
✅ Manage Salaries
✅ Search Employees
✅ View Reports

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| SETUP_INSTRUCTIONS.md | Detailed setup guide |
| API_DOCUMENTATION.md | API endpoint reference |
| QUICK_REFERENCE.md | Developer quick guide |
| README.md | Full project overview |
| PROJECT_SUMMARY.md | Complete summary |

---

## 🆘 Troubleshooting

**Issue: Can't connect to database**
→ Check MySQL is running, verify password in .env

**Issue: Port 5000 already in use**
→ Change PORT in .env file or kill process using port

**Issue: Frontend shows blank page**
→ Open file in full path or use web server, check browser console (F12)

**Issue: API calls failing**
→ Backend server must be running, check console for errors

---

## 🎓 Project Contents

✓ Backend: Node.js + Express.js
✓ Frontend: HTML/CSS/JavaScript (8 pages)
✓ Database: MySQL with 5 tables
✓ APIs: 26 RESTful endpoints
✓ Documentation: 5 comprehensive guides
✓ Sample Data: Pre-loaded employees, departments, attendance, salary

---

## 📞 Need Help?

1. Check **SETUP_INSTRUCTIONS.md** → Troubleshooting section
2. Look at **QUICK_REFERENCE.md** for quick lookup
3. Review **API_DOCUMENTATION.md** for API details
4. Check browser console (F12) for error messages

---

## 🎉 You're Ready!

This is a **production-ready, academic-quality** full-stack application.

### Next Steps:
1. ✅ Follow steps above to get running
2. 🧪 Test all features
3. 🎨 Customize colors/styling (optional)
4. 📤 Deploy to cloud (optional)

---

**Happy coding! 💻**
