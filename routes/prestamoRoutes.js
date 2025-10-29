const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');

// Préstamos
router.get('/', prestamoController.getAllPrestamos);
router.get('/activos', prestamoController.getPrestamosActivos);
router.get('/usuario/:usuarioId', prestamoController.getPrestamosByUsuario);
router.get('/:id', prestamoController.getPrestamoById);
router.post('/', prestamoController.createPrestamo);
router.put('/:id/devolver', prestamoController.devolverLibro);

module.exports = router;
