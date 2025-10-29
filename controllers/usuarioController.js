const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
exports.getAllUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.*,
        r.tipo_rol,
        d.tipo_doc
      FROM usuario u
      LEFT JOIN rol r ON u.rol_usu = r.id_rol
      LEFT JOIN documento d ON u.tipo_doc_usu = d.id_doc
      ORDER BY u.id_usu DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener un usuario por ID
exports.getUsuarioById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.*,
        r.tipo_rol,
        d.tipo_doc
      FROM usuario u
      LEFT JOIN rol r ON u.rol_usu = r.id_rol
      LEFT JOIN documento d ON u.tipo_doc_usu = d.id_doc
      WHERE u.id_usu = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
  try {
    const {
      rol_usu,
      nom_usu,
      apell_usu,
      correo_usu,
      tipo_doc_usu,
      num_doc_usu,
      dircc_usu
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO usuario (rol_usu, nom_usu, apell_usu, correo_usu, tipo_doc_usu, num_doc_usu, dircc_usu) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [rol_usu, nom_usu, apell_usu, correo_usu, tipo_doc_usu, num_doc_usu, dircc_usu]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Usuario creado exitosamente',
      id: result.insertId 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false, 
        message: 'El correo o número de documento ya existe' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar un usuario
exports.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    
    const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(fields), id];

    const [result] = await pool.query(
      `UPDATE usuario SET ${setClause} WHERE id_usu = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar un usuario
exports.deleteUsuario = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM usuario WHERE id_usu = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener clientes
exports.getClientes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.*,
        u.nom_usu,
        u.apell_usu,
        u.correo_usu,
        u.num_doc_usu
      FROM cliente c
      INNER JOIN usuario u ON c.id_usu = u.id_usu
      ORDER BY c.fecha_regis_usu DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
