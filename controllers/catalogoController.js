const { pool } = require('../config/database');

// ========== autorees ==========
exports.getAllAutores = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM autor ORDER BY nom_autor');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAutor = async (req, res) => {
  try {
    const { nom_autor, nacionalidad } = req.body;
    const [result] = await pool.query(
      'INSERT INTO autor (nom_autor, nacionalidad) VALUES (?, ?)',
      [nom_autor, nacionalidad]
    );
    res.status(201).json({ success: true, message: 'Autor creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== categorías ==========
exports.getAllCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categoria ORDER BY nom_categ');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategoria = async (req, res) => {
  try {
    const { nom_categ } = req.body;
    const [result] = await pool.query(
      'INSERT INTO categoria (nom_categ) VALUES (?)',
      [nom_categ]
    );
    res.status(201).json({ success: true, message: 'Categoría creada', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== generos ==========
exports.getAllGeneros = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM genero ORDER BY nom_gen');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createGenero = async (req, res) => {
  try {
    const { nom_gen } = req.body;
    const [result] = await pool.query(
      'INSERT INTO genero (nom_gen) VALUES (?)',
      [nom_gen]
    );
    res.status(201).json({ success: true, message: 'Género creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== editoriales ==========
exports.getAllEditoriales = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM editorial ORDER BY nom_edito');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createEditorial = async (req, res) => {
  try {
    const { nom_edito } = req.body;
    const [result] = await pool.query(
      'INSERT INTO editorial (nom_edito) VALUES (?)',
      [nom_edito]
    );
    res.status(201).json({ success: true, message: 'Editorial creada', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== roles ==========
exports.getAllRoles = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rol ORDER BY tipo_rol');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== tipos de documento ==========
exports.getAllTiposDocumento = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM documento ORDER BY tipo_doc');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
