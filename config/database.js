const mysql = require('mysql2');
require('dotenv').config();

// Crear pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

// Función para probar la conexión :D
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('Conexion exitosa a la base de datos MySQL');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error al conectar con la base de dtos:', error.message);
    return false;
  }
};

module.exports = { pool: promisePool, testConnection };
