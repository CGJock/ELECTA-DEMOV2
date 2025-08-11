// import pool from '@db/db.js';

// export async function setupVotesTrigger(): Promise<void> {
//   try {
//     // 1. Crear o reemplazar la función que envía el payload real en JSON
//     await pool.query(`
//       CREATE OR REPLACE FUNCTION notify_votes()
//       RETURNS TRIGGER AS $$
//       DECLARE
//         payload TEXT;
//       BEGIN
//         SELECT json_build_object(
//           'validVotes', valid_votes,
//           'blankVotes', blank_votes,
//           'nullVotes', null_votes,
//           'totalVotes', valid_votes + blank_votes + null_votes
//         ) INTO payload
//         FROM votes
//         WHERE id = 1;

//         PERFORM pg_notify('votes_channel', payload);
//         RETURN NULL;
//       END;
//       $$ LANGUAGE plpgsql;
//     `);

//     console.log('Función "notify_votes" actualizada.');

//     // 2. Eliminar trigger anterior si existe
//     await pool.query(`
//       DROP TRIGGER IF EXISTS trigger_notify_votes ON votes;
//     `);

//     // 3. Crear el nuevo trigger que solo se ejecuta en UPDATE
//     await pool.query(`
//       CREATE TRIGGER trigger_notify_votes
//       AFTER UPDATE ON votes
//       FOR EACH STATEMENT
//       EXECUTE FUNCTION notify_votes();
//     `);

//     console.log('Trigger "trigger_notify_votes" configurado correctamente.');
//   } catch (error) {
//     console.error('Error al configurar trigger de votos:', (error as Error).message);
//   }
// }


//new trigger 
import pool from '@db/db.js';

export async function setupVotesTrigger(): Promise<void> {
  try {
    // Crear o reemplazar la función que envía la suma total desde ballots_data
    await pool.query(`
      CREATE OR REPLACE FUNCTION notify_ballots_data()
        RETURNS TRIGGER AS $$
        DECLARE
          payload TEXT;
          validVotes INTEGER;
          blankVotes INTEGER;
          nullVotes INTEGER;
          totalVotes INTEGER;
        BEGIN
          WITH party_votes_per_ballot AS (
            SELECT
              id,
              SUM((party ->> 'votes')::INTEGER) AS validVotes
            FROM ballots_data,
            LATERAL jsonb_array_elements(raw_data -> 'parties') AS party
            WHERE election_round_id = NEW.election_round_id
            GROUP BY id
          ),
          votes_summary AS (
            SELECT
              p.validVotes,
              (b.raw_data ->> 'blankVotes')::INTEGER AS blankVotes,
              (b.raw_data ->> 'nullVotes')::INTEGER AS nullVotes
            FROM ballots_data b
            JOIN party_votes_per_ballot p ON b.id = p.id
            WHERE b.election_round_id = NEW.election_round_id
          )
          SELECT
            COALESCE(SUM(validVotes), 0),
            COALESCE(SUM(blankVotes), 0),
            COALESCE(SUM(nullVotes), 0),
            COALESCE(SUM(validVotes + blankVotes + nullVotes), 0)
          INTO validVotes, blankVotes, nullVotes, totalVotes
          FROM votes_summary;

          payload := json_build_object(
            'validVotes', validVotes,
            'blankVotes', blankVotes,
            'nullVotes', nullVotes,
            'totalVotes', totalVotes
          )::TEXT;

          PERFORM pg_notify('votes_channel', payload);
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    console.log('Function "notify_ballots_data" created or replaced.');

    // Eliminar trigger anterior si existe
    await pool.query(`
      DROP TRIGGER IF EXISTS trigger_notify_ballots_data ON ballots_data;
    `);

    // Crear nuevo trigger AFTER INSERT OR UPDATE
    await pool.query(`
      CREATE TRIGGER trigger_notify_ballots_data
      AFTER INSERT OR UPDATE ON ballots_data
      FOR EACH ROW
      EXECUTE FUNCTION notify_ballots_data();
    `);

    console.log('Trigger "trigger_notify_ballots_data" configured successfully.');
  } catch (error) {
    console.error('Error setting up votes trigger:', (error as Error).message);
  }
}

