const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

//Usuarios
router.get('/', usuarioController.getAllUsuarios);
router.get('/clientes', usuarioController.getClientes);
router.get('/:id', usuarioController.getUsuarioById);
router.post('/', usuarioController.createUsuario);
router.put('/:id', usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;
