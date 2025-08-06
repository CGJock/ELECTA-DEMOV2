
import { Router, Request, Response } from 'express';
import pool from '@db/db.js';
import { z } from 'zod';
import { validateApiKey, votosLimiter } from '@middlerare/security.js';

const mailSchema = z.object({
     user_email: z.string().email()
})

const router = Router();

// GET tallies
router.post('/', validateApiKey, votosLimiter ,async (req: Request, res: Response): Promise<void> => {
  try {

    //checks data structure integrity
    const parseResult = mailSchema.safeParse(req.body);
    if (!parseResult.success) {
        res.status(400).json({
            error: 'Email not valid',
            details: parseResult.error.format()
        });
        return;
        }

    const { user_email } = parseResult.data;

    // checks if the user exists in db
    const exists = await pool.query(
      'SELECT 1 FROM newsletter_mails WHERE email = $1',
      [user_email]
    );

     if (exists.rows.length > 0) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    // inserts if not exists
    await pool.query(
      'INSERT INTO newsletter_mails (email) VALUES ($1)',
      [user_email]
    );

    res.status(201).json({ message: 'Email succesfully registered' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error in the server' });
  }
});

export default router;
