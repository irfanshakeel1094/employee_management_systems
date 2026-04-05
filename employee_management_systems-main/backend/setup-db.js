const mysql = require('mysql2/promise');
require('dotenv').config();

const setupDatabase = async () => {
  let connection;
  try {
    // First connect without database to create it
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    console.log('✓ Connected to MySQL');

    // Read the SQL file
    const fs = require('fs');
    const path = require('path');
    const sqlPath = path.join(__dirname, '..', 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute all statements
    await connection.query(sql);
    console.log('✓ Database schema created successfully');

    await connection.end();
    console.log('✓ Setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database setup error:', error.message);
    process.exit(1);
  }
};

setupDatabase();
