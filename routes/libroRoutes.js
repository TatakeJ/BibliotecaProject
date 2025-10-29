const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');

//libros
router.get('/', libroController.getAllLibros);
router.get('/search', libroController.searchLibros);
router.get('/:id', libroController.getLibroById);
router.post('/', libroController.createLibro);
router.put('/:id', libroController.updateLibro);
router.delete('/:id', libroController.deleteLibro);

module.exports = router;
