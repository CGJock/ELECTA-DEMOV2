import { initTables } from './initTables.js';
import { insertParties } from './seedParties.js';
import { insertDepartments } from './seedDepartments.js';
import { insertCandidates } from './seedCandidates.js';
import { insertVotes } from './seedVotes.js'
import { setupVotesTrigger } from './triggers.js';

export async function runMigrations() {
  console.log('Iniciando migraciones...');
  await initTables();
  await insertDepartments();
  await insertCandidates();
  await insertParties();
  await insertVotes();
  await setupVotesTrigger(); // ← Este incluiría el NOTIFY de votos
  console.log('Migraciones completas.');
}
