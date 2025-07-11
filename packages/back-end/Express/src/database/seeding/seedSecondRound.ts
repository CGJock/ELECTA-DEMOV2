

import { getOrCreateElection } from '@utils/getElection.js';
import { secondRoundSetter } from '@utils/secondRoundSetter.js';
import { getElectionRoundId } from '@utils/getElectionAndRound.js';

/**
 * Inserta la primera ronda de una elección existente si no existe.
 * No retorna nada.
 *
 * @param electionType - ID del tipo de elección (ej. 1 = GENERALES)
 * @param roundDate - Fecha de la primera ronda (YYYY-MM-DD)
 */
export async function seedSecondElectionRound(
  electionType: number,
  roundDate: string
): Promise<void> {
  const roundNumber = 2;
  const year = parseInt(roundDate.split('-')[0], 10)

  const electionId = await getOrCreateElection(electionType,year);
  if (!electionId) {
    console.error(` La elección con tipo ${electionType} no existe.`);
    return;
  }

  const roundId = await getElectionRoundId();
  if (roundId) {
    console.log(`ℹ La primera ronda ya existe para tipo ${electionType}.`);
    return;
  }

  const inserted = await secondRoundSetter(electionId, roundDate, roundNumber);
  if (inserted) {
    console.log(`Primera ronda insertada para elección tipo ${electionType}.`);
  } else {
    console.error(`No se pudo insertar la primera ronda para elección tipo ${electionType}.`);
  }
}
