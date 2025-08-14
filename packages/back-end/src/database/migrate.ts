
import { initTables } from '@db/initTables.js';

import  { seedDepartments }  from '@db/seeding/seedDepartments.js';
import  { seedProvinces }  from '@db/seeding/seedProvinces.js';
import  { seedMunicipalities }  from '@db/seeding/seedMunicipalities.js';

import { insertElection } from '@db/seeding/seedElections.js'
import { seedElectionTypes } from '@db/seeding/seedElectionTypes.js'
import { setupVotesTrigger } from '@db/triggers.js';
import  { seedFirstElectionRound } from '@db/seeding/seedFirstRound.js'
import { seedComponentVisibility } from '@db/seeding/seedComponentVisibility.js'

 
export async function runMigrations() {
  console.log('Iniciando migraciones...');

  console.log('➤ initTables()');
  await initTables();
  
  console.log('➤ seedComponentVisibility()');
  await seedComponentVisibility();
  
  console.log('➤ seedDepartments()');
  await seedDepartments();
  
  console.log('➤ seedProvinces()');
  await seedProvinces();
  
  console.log('➤ seedMunicipalities()');
  await seedMunicipalities();
  
  console.log('➤ seedElectionTypes()');
  await seedElectionTypes();
  
  // console.log('➤ insertElection()');
  // await insertElection();
  
  // console.log('➤ seedFirstElectionRound()');
  // await seedFirstElectionRound(1, '2025-08-17');



  console.log('➤ setupVotesTrigger()');
  await setupVotesTrigger();

  console.log('✅ Migraciones completas.');
}

