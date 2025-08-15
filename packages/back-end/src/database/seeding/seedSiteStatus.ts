import pool from '@db/db.js';

export async function seedSiteStatus(): Promise<void> {
  try {
    console.log('🌱 Iniciando seeding de site_status...');

    // Verificar si ya existe un registro
    const existingStatus = await pool.query('SELECT COUNT(*) FROM site_status');
    
    if (existingStatus.rows[0].count === '0') {
      // Insertar estado inicial del sitio
      await pool.query(`
        INSERT INTO site_status (is_maintenance, maintenance_message) 
        VALUES (FALSE, 'Sitio funcionando normalmente')
      `);
      console.log('✅ Estado inicial del sitio creado');
    } else {
      console.log('✅ Estado del sitio ya existe');
    }

    console.log('✅ Seeding de site_status completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante el seeding de site_status:', error);
    throw error;
  }
}
