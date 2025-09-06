const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || ' ',     // your MySQL username
  password: process.env.DB_PASSWORD || ' ', // your MySQL password
  database: process.env.DB_NAME || 'store_rating_db',
  port: process.env.DB_PORT || 3306
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed: ', err.message);
    process.exit(1);
  }
  console.log('✅ Successfully connected to the MySQL database.');
});

module.exports = db;
