const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');

//importar
const libroRoutes = require('./routes/libroRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes');
const catalogoRoutes = require('./routes/catalogoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'API Biblioteca - Backend funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      libros: '/api/libros',
      usuarios: '/api/usuarios',
      prestamos: '/api/prestamos',
      catalogo: '/api/catalogo'
    }
  });
});

// API rutas
app.use('/api/libros', libroRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/prestamos', prestamoRoutes);
app.use('/api/catalogo', catalogoRoutes);

app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Error intrno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar server
const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('advertencia: No se pudo conectar a la base de datos');
      console.log('Verifica tu configuración en el archivo .env');
    }

    app.listen(PORT, () => {
      console.log('===========================================');
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`API Biblioteca Backend - Entorno: ${process.env.NODE_ENV}`);
      console.log('===========================================');
    });
  } catch (error) {
    console.error('error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();