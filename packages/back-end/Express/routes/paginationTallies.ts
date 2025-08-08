import { Router } from 'express';
import pool from '@db/db.js';
import { validateApiKey, votosLimiter } from '@middlerare/security.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const pageParam = req.query.page;
    const page = typeof pageParam === 'string' ? parseInt(pageParam) : 1;
    const limit = 100;
    const offset = (page - 1) * limit;

    // get paginated data
    const dataQuery = `
      SELECT 
        id,
        project_id,
        project_name,
        date_start_time,
        date_time_complete,
        created_at,
        verification_code,
        election_round_id,
        department_code,
        image_url
      FROM ballot_tallies
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const dataResult = await pool.query(dataQuery, [limit, offset]);

    // makes the count of registers
    const countQuery = `SELECT COUNT(*) FROM ballot_tallies`;
    const countResult = await pool.query(countQuery);
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      page,
      totalPages,
      totalCount,
      count: dataResult.rowCount,
      data: dataResult.rows
    });
  } catch (error) {
    console.error('Error fetching ballot tallies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router