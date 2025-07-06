import pool from './db.js';

export async function setupVotesTrigger(): Promise<void> {
  try {
    // 1. Crear o reemplazar la función que envía el payload real en JSON
    await pool.query(`
      CREATE OR REPLACE FUNCTION notify_votes()
      RETURNS TRIGGER AS $$
      DECLARE
        payload TEXT;
      BEGIN
        SELECT json_build_object(
          'validVotes', valid_votes,
          'blankVotes', blank_votes,
          'nullVotes', null_votes,
          'totalVotes', valid_votes + blank_votes + null_votes
        ) INTO payload
        FROM votes
        WHERE id = 1;

        PERFORM pg_notify('votes_channel', payload);
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log('Función "notify_votes" actualizada.');

    // 2. Eliminar trigger anterior si existe
    await pool.query(`
      DROP TRIGGER IF EXISTS trigger_notify_votes ON votes;
    `);

    // 3. Crear el nuevo trigger que solo se ejecuta en UPDATE
    await pool.query(`
      CREATE TRIGGER trigger_notify_votes
      AFTER UPDATE ON votes
      FOR EACH STATEMENT
      EXECUTE FUNCTION notify_votes();
    `);

    console.log('Trigger "trigger_notify_votes" configurado correctamente.');
  } catch (error) {
    console.error('Error al configurar trigger de votos:', (error as Error).message);
  }
}
