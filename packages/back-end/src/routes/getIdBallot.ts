
import { Router } from 'express';
import pool from '@db/db.js';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        verification_code AS id,
        department_code,
        image_url,
        raw_data
      FROM ballots_data
      WHERE verification_code = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ballot no encontrado' });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener ballot' });
  }
});

export default router;