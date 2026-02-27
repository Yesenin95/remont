require('dotenv').config();
const { Pool } = require('pg');

console.log('Testing connection to:', process.env.DATABASE_URL?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW() as now', (err, res) => {
  if (err) {
    console.error('❌ Error:', err.message);
  } else {
    console.log('✅ Success! Server time:', res.rows[0].now);
  }
  pool.end();
});
