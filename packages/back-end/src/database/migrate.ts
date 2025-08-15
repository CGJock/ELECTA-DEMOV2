
import { initTables } from '@db/initTables.js';

import  { seedDepartments }  from '@db/seeding/seedDepartments.js';
import  { seedProvinces }  from '@db/seeding/seedProvinces.js';
import  { seedMunicipalities }  from '@db/seeding/seedMunicipalities.js';
import { seedElectionTypes } from '@db/seeding/seedElectionTypes.js'
import { setupVotesTrigger } from '@db/triggers.js';
import { seedComponentVisibility } from '@db/seeding/seedComponentVisibility.js'
import { createFirstAdmin } from './createFirstAdmin.js';
import { seedSiteStatus } from '@db/seeding/seedSiteStatus.js'

 
export async function runMigrations() {
  console.log('Iniciando migraciones...');

  console.log('➤ initTables()');
  await initTables();
  
  console.log('➤ seedSiteStatus()');
  await seedSiteStatus();
  
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

  console.log('Seeding Super Admin');
  await createFirstAdmin()
  
  console.log('➤ setupVotesTrigger()');
  await setupVotesTrigger();

  console.log('✅ Migraciones completas.');
}

