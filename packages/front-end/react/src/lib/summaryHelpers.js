

//---Helper: Only total votes
export async function getVotesBreakdown(db) {
  const result = await db.get(`
    SELECT
      COUNT(*) AS totalVotes,
      SUM(CASE WHEN null_vote = 1 THEN 1 ELSE 0 END) AS nullVotes,
      SUM(CASE WHEN blank_vote = 1 THEN 1 ELSE 0 END) AS blankVotes,
      SUM(CASE WHEN (null_vote != 1 AND blank_vote != 1) THEN 1 ELSE 0 END) AS validVotes
    FROM votes
  `);

  const { totalVotes, nullVotes, blankVotes, validVotes } = result;

  return {
    totalVotes,
    nullVotes,
    nullPercent: totalVotes ? ((nullVotes / totalVotes) * 100).toFixed(2) : "0.00",

    blankVotes,
    blankPercent: totalVotes ? ((blankVotes / totalVotes) * 100).toFixed(2) : "0.00",

    validVotes,
    validPercent: totalVotes ? ((validVotes / totalVotes) * 100).toFixed(2) : "0.00"
  };
}

// --- Helper: Global vote summary ---
export async function getGlobalSummary(db) {
  const totalVotes = (await db.get(`SELECT COUNT(*) as count FROM votes`)).count;
  const totalLocations = (await db.get(`SELECT COUNT(*) as count FROM locations`)).count;
  const totalParties = (await db.get(`SELECT COUNT(*) as count FROM parties`)).count;

  const votesPerParty = await db.all(`
    SELECT p.name, p.abbr, COUNT(v.id) as count
    FROM parties p
    LEFT JOIN votes v ON p.id = v.party_id
    GROUP BY p.id
  `);

  const partyPercentages = votesPerParty.map((party) => ({
    name: party.name,
    abbr: party.abbr,
    count: party.count,
    percentage: totalVotes ? ((party.count / totalVotes) * 100).toFixed(2) : "0.00"
  }));

  return {
    totalVotes,
    totalLocations,
    totalParties,
    partyBreakdown: partyPercentages
  };
}

// --- Helper: Location-specific summary ---
export async function getLocationSummary(db, locationId) {
  const totalVotes = (await db.get(
    `SELECT COUNT(*) as count FROM votes WHERE location_id = ?`,
    [locationId]
  )).count;

  const votesPerParty = await db.all(
    `
    SELECT p.name, p.abbr, COUNT(v.id) as count
    FROM parties p
    LEFT JOIN votes v ON p.id = v.party_id AND v.location_id = ?
    GROUP BY p.id
  `,
    [locationId]
  );

  const partyPercentages = votesPerParty.map((party) => ({
    name: party.name,
    abbr: party.abbr,
    count: party.count,
    percentage: totalVotes ? ((party.count / totalVotes) * 100).toFixed(2) : "0.00"
  }));

  const locationName = await db.get(
    `SELECT name FROM locations WHERE id = ?`,
    [locationId]
  );

  return {
    locationId,
    locationName: locationName?.name || `ID ${locationId}`,
    totalVotes,
    partyBreakdown: partyPercentages
  };
}

// // --- Helper: Only total votes ---
// export function getVotesBreakdown(db) {
//   const result = db.prepare(`
//     SELECT
//       COUNT(*) AS totalVotes,
//       SUM(CASE WHEN null_vote = 1 THEN 1 ELSE 0 END) AS nullVotes,
//       SUM(CASE WHEN blank_vote = 1 THEN 1 ELSE 0 END) AS blankVotes,
//       SUM(CASE WHEN (null_vote != 1 AND blank_vote != 1) THEN 1 ELSE 0 END) AS validVotes
//     FROM votes
//   `).get();

//   const { totalVotes, nullVotes, blankVotes, validVotes } = result;

//   return {
//     totalVotes,
//     nullVotes,
//     nullPercent: totalVotes ? ((nullVotes / totalVotes) * 100).toFixed(2) : "0.00",

//     blankVotes,
//     blankPercent: totalVotes ? ((blankVotes / totalVotes) * 100).toFixed(2) : "0.00",

//     validVotes,
//     validPercent: totalVotes ? ((validVotes / totalVotes) * 100).toFixed(2) : "0.00"
//   };
// }

// // --- Helper: Global vote summary ---
// export function getGlobalSummary(db) {
//   const totalVotes = db.prepare(`SELECT COUNT(*) as count FROM votes`).get().count;
//   const totalLocations = db.prepare(`SELECT COUNT(*) as count FROM locations`).get().count;
//   const totalParties = db.prepare(`SELECT COUNT(*) as count FROM parties`).get().count;

//   const votesPerParty = db.prepare(`
//     SELECT p.name, COUNT(v.id) as count
//     FROM parties p
//     LEFT JOIN votes v ON p.id = v.party_id
//     GROUP BY p.id
//   `).all();

//   const partyPercentages = votesPerParty.map((party) => ({
//     name: party.name,
//     count: party.count,
//     percent: totalVotes ? ((party.count / totalVotes) * 100).toFixed(2) : "0.00"
//   }));

//   return {
//     totalVotes,
//     totalLocations,
//     totalParties,
//     partyBreakdown: partyPercentages
//   };
// }

// // --- Helper: Location-specific summary ---
// export function getLocationSummary(db, locationId) {
//   const totalVotes = db.prepare(
//     `SELECT COUNT(*) as count FROM votes WHERE location_id = ?`
//   ).get(locationId).count;

//   const votesPerParty = db.prepare(
//     `
//     SELECT p.name, COUNT(v.id) as count
//     FROM parties p
//     LEFT JOIN votes v ON p.id = v.party_id AND v.location_id = ?
//     GROUP BY p.id
//   `
//   ).all(locationId);

//   const partyPercentages = votesPerParty.map((party) => ({
//     name: party.name,
//     count: party.count,
//     percent: totalVotes ? ((party.count / totalVotes) * 100).toFixed(2) : "0.00"
//   }));

//   const locationName = db.prepare(
//     `SELECT name FROM locations WHERE id = ?`
//   ).get(locationId);

//   return {
//     location: locationName?.name || `ID ${locationId}`,
//     totalVotes,
//     partyBreakdown: partyPercentages
//   };
// }
