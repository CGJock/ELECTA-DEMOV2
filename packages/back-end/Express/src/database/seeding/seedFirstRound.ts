import { getOrCreateElection } from '@utils/getElection.js';
import { firstRoundSetter } from '@utils/firstRoundsetter.js';
import { getElectionRoundId } from '@utils/getElectionAndRound.js';

export async function seedFirstElectionRound(
  electionType: number,
  roundDate: string
): Promise<void> {
  const roundNumber = 1;
  const year = parseInt(roundDate.split('-')[0], 10);

  const electionId = await getOrCreateElection(electionType, year);
  if (!electionId) {
    console.error(`❌ No se pudo obtener o crear la elección de tipo ${electionType}.`);
    return;
  }

  const roundId = await getElectionRoundId(electionType, roundDate, roundNumber);
  if (roundId) {
    console.log(`ℹ La primera ronda ya existe para tipo ${electionType}.`);
    return;
  }

  const inserted = await firstRoundSetter(electionId, roundDate, roundNumber);
  if (inserted) {
    console.log(`✅ Primera ronda insertada para elección tipo ${electionType}.`);
  } else {
    console.error(`❌ No se pudo insertar la primera ronda para elección tipo ${electionType}.`);
  }
}