// voteCache.ts o .js

let latestVoteData: object | null = null;

/**
 * Guarda el último resumen de votos en caché.
 */
export function setLatestVoteData(data: object) {
  latestVoteData = data;
}

/**
 * Devuelve el resumen de votos desde caché, o null si no hay datos aún.
 */
export function getLatestVoteData(): object | null {
  return latestVoteData;
}