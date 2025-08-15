import pool from '@db/db.js';
import bcrypt from 'bcryptjs';

export async function createFirstAdmin(): Promise<void> {
  try {
    // Verificar si ya existe algún administrador
    const existingAdmins = await pool.query('SELECT COUNT(*) FROM admins');
    const adminCount = parseInt(existingAdmins.rows[0].count);
    
    if (adminCount > 0) {
      console.log('Ya existen administradores en la base de datos');
      return;
    }
    
    // Crear el primer administrador
    const username = 'admin';
    const password = 'electa1234'; // Contraseña por defecto
    const email = 'admin@electa.com';
    const full_name = 'Administrador Principal';
    
    // Hash de la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Insertar el admin
    const result = await pool.query(
      'INSERT INTO admins (username, password_hash, email, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username',
      [username, passwordHash, email, full_name]
    );
    
    
  } catch (error) {
    console.error(' Error al crear el primer administrador:', error);
  }
}