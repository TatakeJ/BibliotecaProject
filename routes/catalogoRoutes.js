const express = require('express');
const router = express.Router();
const catalogoController = require('../controllers/catalogoController');

// autor
router.get('/autores', catalogoController.getAllAutores);
router.post('/autores', catalogoController.createAutor);

// catgoráas
router.get('/categorias', catalogoController.getAllCategorias);
router.post('/categorias', catalogoController.createCategoria);

// géneros
router.get('/generos', catalogoController.getAllGeneros);
router.post('/generos', catalogoController.createGenero);

// editoriales
router.get('/editoriales', catalogoController.getAllEditoriales);
router.post('/editoriales', catalogoController.createEditorial);

// Roles
router.get('/roles', catalogoController.getAllRoles);

//Tipos de documento
router.get('/documentos', catalogoController.getAllTiposDocumento);

module.exports = router;
