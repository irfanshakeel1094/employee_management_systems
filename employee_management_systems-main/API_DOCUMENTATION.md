# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Response Status Codes
- **200** - OK (GET, PUT)
- **201** - Created (POST)
- **400** - Bad Request
- **404** - Not Found
- **409** - Conflict
- **500** - Server Error

---

## EMPLOYEE ENDPOINTS

### 1. Get All Employees
```
GET /employees
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@company.com",
            "phone": "1234567890",
            "department_id": 2,
            "department_name": "IT",
            "position": "Senior Developer",
            "hire_date": "2022-01-15",
            "status": "active",
            "address": "123 Main St",
            "created_at": "2024-01-15T10:00:00Z"
        }
    ],
    "message": "Employees retrieved successfully"
}
```

### 2. Get Employee by ID
```
GET /employees/:id
```

**Path Parameters:**
- `id` (integer) - Employee ID

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@company.com",
        ...
    },
    "message": "Employee retrieved successfully"
}
```

### 3. Search Employees
```
GET /employees/search?q=john
```

**Query Parameters:**
- `q` (string) - Search query (name or email)

**Response:** Same as Get All Employees

### 4. Create Employee
```
POST /employees
```

**Request Body:**
```json
{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@company.com",
    "phone": "0987654321",
    "department_id": 1,
    "position": "Manager",
    "hire_date": "2024-01-10",
    "address": "456 Oak Ave"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 7
    },
    "message": "Employee created successfully"
}
```

### 5. Update Employee
```
PUT /employees/:id
```

**Request Body:**
```json
{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@company.com",
    "phone": "0987654321",
    "department_id": 1,
    "position": "Senior Manager",
    "hire_date": "2024-01-10",
    "status": "active",
    "address": "456 Oak Ave"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Employee updated successfully"
}
```

### 6. Delete Employee
```
DELETE /employees/:id
```

**Response:**
```json
{
    "success": true,
    "message": "Employee deleted successfully"
}
```

### 7. Get Employees by Department
```
GET /employees/department/:departmentId
```

**Response:** Same as Get All Employees

---

## DEPARTMENT ENDPOINTS

### 1. Get All Departments
```
GET /departments
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "IT",
            "description": "Information Technology",
            "created_at": "2024-01-01T10:00:00Z"
        }
    ],
    "message": "Departments retrieved successfully"
}
```

### 2. Get Department by ID
```
GET /departments/:id
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "IT",
        "description": "Information Technology"
    },
    "message": "Department retrieved successfully"
}
```

### 3. Create Department
```
POST /departments
```

**Request Body:**
```json
{
    "name": "Human Resources",
    "description": "HR Department"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 6
    },
    "message": "Department created successfully"
}
```

### 4. Update Department
```
PUT /departments/:id
```

**Request Body:**
```json
{
    "name": "Human Resources",
    "description": "HR and Administration"
}
```

### 5. Delete Department
```
DELETE /departments/:id
```

---

## ATTENDANCE ENDPOINTS

### 1. Get All Attendance Records
```
GET /attendance
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "employee_id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "attendance_date": "2024-04-01",
            "status": "present",
            "check_in_time": "09:00:00",
            "check_out_time": "17:30:00",
            "notes": null,
            "created_at": "2024-04-01T10:00:00Z"
        }
    ],
    "message": "Attendance records retrieved successfully"
}
```

### 2. Get Attendance by Employee
```
GET /attendance/employee/:employeeId
GET /attendance/employee/:employeeId?month=2024-04
```

**Query Parameters:**
- `month` (string, optional) - Filter by month (YYYY-MM format)

### 3. Get Attendance by Date Range
```
GET /attendance/range?startDate=2024-04-01&endDate=2024-04-30
GET /attendance/range?startDate=2024-04-01&endDate=2024-04-30&employeeId=1
```

**Query Parameters:**
- `startDate` (string, required) - Start date (YYYY-MM-DD)
- `endDate` (string, required) - End date (YYYY-MM-DD)
- `employeeId` (integer, optional) - Filter by employee

### 4. Get Monthly Summary
```
GET /attendance/summary/monthly?year=2024&month=4
```

**Query Parameters:**
- `year` (integer, required) - Year
- `month` (integer, required) - Month (1-12)

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "employee_id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "present_days": 18,
            "absent_days": 2,
            "half_days": 1,
            "leave_days": 4
        }
    ]
}
```

### 5. Mark Attendance
```
POST /attendance
```

**Request Body:**
```json
{
    "employee_id": 1,
    "attendance_date": "2024-04-03",
    "status": "present",
    "check_in_time": "09:00",
    "check_out_time": "17:30",
    "notes": "Regular attendance"
}
```

**Status Values:**
- `present` - Employee is present
- `absent` - Employee is absent
- `half_day` - Employee worked half day
- `leave` - Employee is on leave

### 6. Update Attendance
```
PUT /attendance/:id
```

**Request Body:**
```json
{
    "status": "present",
    "check_in_time": "09:15",
    "check_out_time": "17:45",
    "notes": "Late arrival"
}
```

### 7. Delete Attendance
```
DELETE /attendance/:id
```

---

## SALARY ENDPOINTS

### 1. Get All Salary Records
```
GET /salary
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "employee_id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@company.com",
            "base_salary": "75000.00",
            "allowances": "5000.00",
            "deductions": "2000.00",
            "net_salary": "78000.00",
            "payment_date": "2024-03-31",
            "month_year": "2024-03",
            "created_at": "2024-03-31T10:00:00Z"
        }
    ],
    "message": "Salary records retrieved successfully"
}
```

### 2. Get Salary by ID
```
GET /salary/:id
```

### 3. Get Salary by Employee
```
GET /salary/employee/:employeeId
```

### 4. Get Salary by Month-Year
```
GET /salary/month-year?monthYear=2024-03
```

**Query Parameters:**
- `monthYear` (string, required) - Format: YYYY-MM

### 5. Get Salary Summary by Department
```
GET /salary/summary/department
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "department_name": "IT",
            "total_employees": 5,
            "total_base_salary": "250000.00",
            "total_net_salary": "266000.00",
            "avg_salary": "50000.00"
        }
    ]
}
```

### 6. Create Salary Record
```
POST /salary
```

**Request Body:**
```json
{
    "employee_id": 1,
    "base_salary": 75000,
    "allowances": 5000,
    "deductions": 2000,
    "payment_date": "2024-03-31",
    "month_year": "2024-03"
}
```

**Net Salary Calculation:**
```
net_salary = (base_salary + allowances) - deductions
```

### 7. Update Salary Record
```
PUT /salary/:id
```

**Request Body:**
```json
{
    "base_salary": 80000,
    "allowances": 5000,
    "deductions": 2000,
    "payment_date": "2024-04-30"
}
```

### 8. Delete Salary Record
```
DELETE /salary/:id
```

---

## Error Examples

### 400 - Bad Request
```json
{
    "success": false,
    "message": "First name, last name, and email are required"
}
```

### 404 - Not Found
```json
{
    "success": false,
    "message": "Employee not found"
}
```

### 409 - Conflict (Duplicate Email)
```json
{
    "success": false,
    "message": "Email already exists"
}
```

### 500 - Server Error
```json
{
    "success": false,
    "message": "Error creating employee",
    "error": "Error details..."
}
```

---

## Testing with Postman

1. Create collection: "Employee Management System"
2. Set base URL: `{{base_url}}/api`
3. Create variable: `base_url` = `http://localhost:5000`

### Sample Test Requests

**Create Employee:**
```
POST {{base_url}}/employees
Content-Type: application/json

{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "department_id": 1,
    "position": "Developer"
}
```

---

## Rate Limiting & Security Notes

- No rate limiting implemented (for development)
- Add authentication/JWT for production
- Validate all inputs on both client and server
- Use HTTPS in production
- Sanitize input to prevent SQL injection
- Hash passwords with bcryptjs

---

**API Version**: 1.0.0
**Last Updated**: April 2024
