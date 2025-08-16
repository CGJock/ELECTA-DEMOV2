import { Router } from 'express';
import pool from '@db/db.js';

const router = Router();

// GET ballots_data con paginación, usando verification_code como id
router.get('/', async (req, res) => {
  try {
    // página actual (default = 1)
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = 100;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `
      SELECT 
        verification_code AS id,
        department_code,
        image_url
      FROM ballots_data
      ORDER BY verification_code DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    // contar total de filas
    const countResult = await pool.query('SELECT COUNT(*) FROM ballots_data');
    const total = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      page,
      totalPages,
      totalItems: total,
      items: result.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener ballots_data' });
  }
});

export default router;