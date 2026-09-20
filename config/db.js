import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  uri: globalThis.process?.env?.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Testing
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Berhasil terhubung ke Aiven Cloud MySQL via SSL!');
    connection.release();
  } catch (error) {
    console.error('Gagal terhubung ke Database:', error.message);
  }
}

testConnection();

export default pool;