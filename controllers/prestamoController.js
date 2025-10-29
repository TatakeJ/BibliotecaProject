const { pool } = require('../config/database');

// Obtener todos los préstamos
exports.getAllPrestamos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        u.nom_usu,
        u.apell_usu,
        u.correo_usu,
        l.nom_libro,
        l.isbn,
        a.nom_autor
      FROM prestamo p
      INNER JOIN usuario u ON p.id_usu = u.id_usu
      INNER JOIN libro l ON p.id_libro = l.id_libro
      LEFT JOIN autor a ON l.id_autor = a.id_autor
      ORDER BY p.id_prest DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener un préstamo por ID
exports.getPrestamoById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        u.nom_usu,
        u.apell_usu,
        u.correo_usu,
        l.nom_libro,
        l.isbn,
        a.nom_autor
      FROM prestamo p
      INNER JOIN usuario u ON p.id_usu = u.id_usu
      INNER JOIN libro l ON p.id_libro = l.id_libro
      LEFT JOIN autor a ON l.id_autor = a.id_autor
      WHERE p.id_prest = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Crear un nuevo préstamo
exports.createPrestamo = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id_usu, id_libro, fecha_prest, fecha_devol } = req.body;

    // Verificar disponibilidad del libro
    const [libro] = await connection.query(
      'SELECT dispo_libro, cant_ejempla FROM libro WHERE id_libro = ?',
      [id_libro]
    );

    if (libro.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Libro no encontrado' });
    }

    if (libro[0].dispo_libro !== 'Disponible' || libro[0].cant_ejempla <= 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Libro no disponible' });
    }

    // Crear prestamo
    const [result] = await connection.query(
      `INSERT INTO prestamo (id_usu, id_libro, fecha_prest, fecha_devol) 
       VALUES (?, ?, ?, ?)`,
      [id_usu, id_libro, fecha_prest, fecha_devol]
    );

    // Actualizar disponibilidad del libro
    await connection.query(
      'UPDATE libro SET cant_ejempla = cant_ejempla - 1 WHERE id_libro = ?',
      [id_libro]
    );

    // Si no quedan ejemplares, marcar como no disponible
    if (libro[0].cant_ejempla - 1 === 0) {
      await connection.query(
        "UPDATE libro SET dispo_libro = 'Prestado' WHERE id_libro = ?",
        [id_libro]
      );
    }

    await connection.commit();
    res.status(201).json({ 
      success: true, 
      message: 'Préstamo creado exitosamente',
      id: result.insertId 
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// Devolver un libro (actualizar fecha_entrega_final)
exports.devolverLibro = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { fecha_entrega_final } = req.body;

    // Obtener información del préstamo
    const [prestamo] = await connection.query(
      'SELECT id_libro, fecha_entrega_final FROM prestamo WHERE id_prest = ?',
      [id]
    );

    if (prestamo.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });
    }

    if (prestamo[0].fecha_entrega_final) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'El libro ya fue devuelto' });
    }

    // Actualizar fecha de entrega
    await connection.query(
      'UPDATE prestamo SET fecha_entrega_final = ? WHERE id_prest = ?',
      [fecha_entrega_final, id]
    );

    // Incrementar disponibilidad del libro
    await connection.query(
      'UPDATE libro SET cant_ejempla = cant_ejempla + 1 WHERE id_libro = ?',
      [prestamo[0].id_libro]
    );

    // Marcar como disponible
    await connection.query(
      "UPDATE libro SET dispo_libro = 'Disponible' WHERE id_libro = ?",
      [prestamo[0].id_libro]
    );

    await connection.commit();
    res.json({ success: true, message: 'Libro devuelto exitosamente' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// Obtener préstamos no dispoibles
exports.getPrestamosActivos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        u.nom_usu,
        u.apell_usu,
        l.nom_libro,
        a.nom_autor
      FROM prestamo p
      INNER JOIN usuario u ON p.id_usu = u.id_usu
      INNER JOIN libro l ON p.id_libro = l.id_libro
      LEFT JOIN autor a ON l.id_autor = a.id_autor
      WHERE p.fecha_entrega_final IS NULL
      ORDER BY p.fecha_devol ASC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener préstamos por usuario
exports.getPrestamosByUsuario = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        l.nom_libro,
        l.isbn,
        a.nom_autor
      FROM prestamo p
      INNER JOIN libro l ON p.id_libro = l.id_libro
      LEFT JOIN autor a ON l.id_autor = a.id_autor
      WHERE p.id_usu = ?
      ORDER BY p.id_prest DESC
    `, [req.params.usuarioId]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
