import { Router } from 'express';
import pool from '@db/db.js';
import { validateApiKey, votosLimiter } from '../middlewares/security.js';

const router = Router();

// GET all mais in the table newsletter_mails
router.get('/', validateApiKey,votosLimiter, async (_req, res) => {
  try {
    const result = await pool.query('SELECT id, email FROM newsletter_mails');
    res.status(200).json(result.rows);
    console.log(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching emails' });
  }
});

export default router;
