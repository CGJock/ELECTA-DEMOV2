
import { initTables } from '@db/initTables.js';

import  { seedDepartments }  from '@db/seeding/seedDepartments.js';
import  { seedProvinces }  from '@db/seeding/seedProvinces.js';
import  { seedMunicipalities }  from '@db/seeding/seedMunicipalities.js';

import { insertElection } from '@db/seeding/seedElections.js'
import { seedElectionTypes } from '@db/seeding/seedElectionTypes.js'
import { insertVotes } from '@db/seeding/seedVotes.js'
import { setupVotesTrigger } from '@db/triggers.js';
import  { seedFirstElectionRound } from '@db/seeding/seedFirstRound.js'
import  { seedSecondElectionRound } from '@db/seeding/seedSecondRound.js'

 
export async function runMigrations() {
  console.log('Iniciando migraciones...');
  // await ensureDatabase();
  await initTables();
  await seedDepartments();
  await seedProvinces();
  await seedMunicipalities();
  
  
  await seedElectionTypes();
  await insertElection();
  
  await seedFirstElectionRound(1, '2025-08-17');//introduce the election type and election date 
  await insertVotes();
  await setupVotesTrigger(); // ← Este incluiría el NOTIFY de votos
  console.log('Migraciones completas.');
}
