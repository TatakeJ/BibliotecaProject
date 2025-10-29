const { pool } = require('../config/database');

// Obtener todos los libros con información relacionada
exports.getAllLibros = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        l.*,
        c.nom_categ,
        g.nom_gen,
        a.nom_autor,
        a.nacionalidad,
        e.nom_edito
      FROM libro l
      LEFT JOIN categoria c ON l.id_categ = c.id_categ
      LEFT JOIN genero g ON l.id_gen = g.id_gen
      LEFT JOIN autor a ON l.id_autor = a.id_autor
      LEFT JOIN editorial e ON l.id_edito = e.id_edito
      ORDER BY l.id_libro DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener un libro por ID
exports.getLibroById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        l.*,
        c.nom_categ,
        g.nom_gen,
        a.nom_autor,
        a.nacionalidad,
        e.nom_edito
      FROM libro l
      LEFT JOIN categoria c ON l.id_categ = c.id_categ
      LEFT JOIN genero g ON l.id_gen = g.id_gen
      LEFT JOIN autor a ON l.id_autor = a.id_autor
      LEFT JOIN editorial e ON l.id_edito = e.id_edito
      WHERE l.id_libro = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Libro no encontrado' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Crear un nuevo libro
exports.createLibro = async (req, res) => {
  try {
    const {
      nom_libro,
      id_categ,
      id_gen,
      cant_ejempla,
      dispo_libro,
      id_autor,
      año_libro,
      id_edito,
      edicion_libro,
      isbn,
      fecha_ingreso,
      idioma
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO libro (nom_libro, id_categ, id_gen, cant_ejempla, dispo_libro, 
       id_autor, año_libro, id_edito, edicion_libro, isbn, fecha_ingreso, idioma) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom_libro, id_categ, id_gen, cant_ejempla, dispo_libro, id_autor, 
       año_libro, id_edito, edicion_libro, isbn, fecha_ingreso, idioma]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Libro creado exitosamente',
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar un libro
exports.updateLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    
    const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(fields), id];

    const [result] = await pool.query(
      `UPDATE libro SET ${setClause} WHERE id_libro = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Libro no encontrado' });
    }

    res.json({ success: true, message: 'Libro actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar un libro
exports.deleteLibro = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM libro WHERE id_libro = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Libro no encontrado' });
    }

    res.json({ success: true, message: 'Libro eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Buscar libros por nombre
exports.searchLibros = async (req, res) => {
  try {
    const { query } = req.query;
    const [rows] = await pool.query(`
      SELECT 
        l.*,
        c.nom_categ,
        g.nom_gen,
        a.nom_autor,
        e.nom_edito
      FROM libro l
      LEFT JOIN categoria c ON l.id_categ = c.id_categ
      LEFT JOIN genero g ON l.id_gen = g.id_gen
      LEFT JOIN autor a ON l.id_autor = a.id_autor
      LEFT JOIN editorial e ON l.id_edito = e.id_edito
      WHERE l.nom_libro LIKE ? OR a.nom_autor LIKE ? OR l.isbn LIKE ?
    `, [`%${query}%`, `%${query}%`, `%${query}%`]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
