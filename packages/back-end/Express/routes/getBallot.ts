import { Router } from 'express';
import pool from '@db/db.js';


const router = Router();

router.get('/:id', async (req, res) => {
    

  try {

    const id = parseInt(req.params.id); 

    if (!id) { 
      res.status(400).json({message: 'error'})
    }
    const data = await pool.query(
      `
        SELECT 
          verification_code,
          party_name,
          party_vote_count,
          null_votes,
          blank_votes,
          department_code
        FROM votes_data_tallies
        WHERE verification_code = $1
      `,
      [id]
    );

    if (data.rows.length === 0) {
    res.status(404).json({ message: 'No results found for that verification code' });
    }

    const result = {
      verification_code: data.rows[0].verification_code,
      null_votes: data.rows[0].null_votes,
      blank_votes: data.rows[0].blank_votes,
      department_code: data.rows[0].department_code,
      parties: data.rows.map(row => ({
        party_name: row.party_name,
        party_vote_count: row.party_vote_count
      }))
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting tallies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
