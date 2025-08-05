// cunction that transforms the data into percentaje
export function toPercenData(raw: {
  totalVotes: number;
  nullVotes: number;
  blankVotes: number;
  validVotes: number;
}) {
  const { totalVotes, nullVotes, blankVotes, validVotes } = raw;

  const toPercent = (value: number, total: number): number =>
    total ? parseFloat(((value / total) * 100).toFixed(2)) : 0;

  return {
    totalVotes,
    nullVotes,
    nullPercent: toPercent(nullVotes, totalVotes),
    blankVotes,
    blankPercent: toPercent(blankVotes, totalVotes),
    validVotes,
    validPercent: toPercent(validVotes, totalVotes),
  };
}
