import { getVotesBreakdown, getGlobalSummary, getLocationSummary } from './summaryHelpers.js'
import { getProposalsByCandidate } from './db.js'

export function setupSocketHandlers(io, db) {
  io.on('connection', (socket) => {
    console.log(`Client conected ${socket.id} `)
    
    //VOTES COUNT
    socket.on('get-vote-breakdown', async () => {
        try{
            const data = await getVotesBreakdown(db);
            socket.emit('vote-breakdown', data);
        } catch (err) {
          console.error('Error:', err);
          socket.emit('vote-breakdown', { error: 'Failed to fetch vote breakdown' });
        }
});


    socket.on('get-global-summary', async () => {
    try {
      const data = await getGlobalSummary(db);
      socket.emit('global-vote-summary', data);
    } catch (err) {
      socket.emit('global-vote-summary', { error: 'Failed to fetch global summary' });
    }

    const interval = setInterval(async () => {
      try {
        const data = await getGlobalSummary(db);
        socket.emit('global-vote-summary', data);
      } catch (err) {
        socket.emit('global-vote-summary', { error: 'Failed to fetch global summary' });
      }
    }, 10000);

    socket.on('disconnect', () => {
      clearInterval(interval);
    });
});

    // LOCATION SUMMARY
    socket.on('get-location-summary', async (locationId) => {
      try {
        const data = await getLocationSummary(db, locationId)
        socket.emit('location-breakdown-summary', data);
      } catch (err) {
        socket.emit('location-breakdown-summary', { error: 'Failed to fetch global summary' });
      }
    });

    // CANDIDATE PROPOSALS
    socket.on('get-candidate-proposals', async ({ candidateId, language = 'es' }) => {
      try {
        console.log('[Socket] get-candidate-proposals recibido para candidateId:', candidateId, 'y language:', language);
        const proposals = await getProposalsByCandidate(db, candidateId, language);
        console.log('[Socket] Propuestas encontradas:', proposals);
        socket.emit('candidate-proposals', { candidateId, proposals });
      } catch (err) {
        console.error('Error fetching candidate proposals:', err);
        socket.emit('candidate-proposals', { candidateId, error: 'Failed to fetch proposals' });
      }
    });

    // Handler para obtener partidos y candidatos reales
    socket.on('get-parties-candidates', async () => {
      try {
        // Obtener partidos
        const parties = await db.all(`SELECT * FROM parties`);
        // Obtener candidatos
        const candidates = await db.all(`SELECT * FROM candidates`);
        // Asociar candidatos a partidos
        const partiesWithCandidates = parties.map(party => {
          const candidate = candidates.find(c => c.party_id === party.id);
          return {
            id: party.id,
            name: party.name,
            abbreviation: party.abbr,
            color: candidate ? candidate.color : '#888',
            votes: candidate ? candidate.votes : 0,
            percentage: candidate ? candidate.percentage : 0,
            candidate: candidate ? {
              id: candidate.id,
              name: candidate.name,
              photo: candidate.photo,
              age: candidate.age,
              party: party.name,
              experience: candidate.experience,
              education: candidate.education,
              proposals: [] // Las propuestas se piden aparte
            } : null
          };
        });
        socket.emit('parties-candidates', partiesWithCandidates);
      } catch (err) {
        console.error('Error fetching parties and candidates:', err);
        socket.emit('parties-candidates', { error: 'Failed to fetch parties and candidates' });
      }
    });
})};

