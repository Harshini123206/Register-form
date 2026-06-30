const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'students';

console.log('Database Configuration:');
console.log(`  Host: ${DB_HOST}`);
console.log(`  User: ${DB_USER}`);
console.log(`  Password: ${DB_PASSWORD ? '***hidden***' : '(empty)'}`);
console.log(`  Database: ${DB_NAME}`);
console.log(`  Port: ${PORT}`);

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.on('error', (err) => {
  console.error('MySQL Pool Error:', err);
});

app.get('/api/health', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.execute('SELECT 1');
    conn.release();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message,
      code: error.code,
    });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, studentName, studentId } = req.body;
  if (!username || !studentName || !studentId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO students (username, student_name, student_id) VALUES (?, ?, ?)',
      [username.trim(), studentName.trim(), studentId.trim()]
    );

    console.log('Registration successful for:', studentId);
    res.json({ message: 'Registration successful.', insertId: result.insertId });
  } catch (error) {
    console.error('Database error:', {
      code: error.code,
      message: error.message,
      sqlState: error.sqlState,
    });

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Student ID already exists.' });
    }

    if (error.code === 'ER_ACCESS_DENIED_NO_PASSWORD_ERROR' || error.code === 'ER_ACCESS_DENIED_FOR_USER') {
      return res.status(500).json({
        error: 'Database access denied. Check DB_USER and DB_PASSWORD in .env file.',
      });
    }

    if (error.code === 'ER_BAD_DB_ERROR') {
      return res.status(500).json({
        error: 'Database does not exist. Please create the database first.',
      });
    }

    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({
        error: 'Students table does not exist. Run: mysql -u root -p < db/init.sql',
      });
    }

    res.status(500).json({
      error: 'Registration failed. Please try again.',
      detail: error.message,
    });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
