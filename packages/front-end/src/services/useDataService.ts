// // Custom hooks to use data services
// import { useState, useEffect, useCallback } from 'react';
// import { dataService, type Department, type VoteSummary, type GlobalSummary, type LocationSummary } from './dataService';

// // Hook to get departments
// export function useDepartments() {
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchDepartments = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await dataService.getDepartments();
//       setDepartments(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Error fetching departments');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDepartments();
//   }, [fetchDepartments]);

//   return { departments, loading, error, refetch: fetchDepartments };
// }

// // Hook to get vote breakdown
// export function useVoteBreakdown() {
//   const [voteBreakdown, setVoteBreakdown] = useState<VoteSummary | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     const cleanup = dataService.getVoteBreakdown((data) => {
//       setVoteBreakdown(data);
//       setLoading(false);
//     });

//     // Cleanup function
//     return cleanup;
//   }, []);

//   return { voteBreakdown, loading, error };
// }

// // Hook to get global summary
// export function useGlobalSummary() {
//   const [globalSummary, setGlobalSummary] = useState<GlobalSummary | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     const cleanup = dataService.getGlobalSummary((data) => {
//       setGlobalSummary(data);
//       setLoading(false);
//     });

//     // Cleanup function
//     return cleanup;
//   }, []);

//   return { globalSummary, loading, error };
// }

// // Hook to get location summary
// export function useLocationSummary(locationId: string) {
//   const [locationSummary, setLocationSummary] = useState<LocationSummary | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!locationId) {
//       setLocationSummary(null);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     const cleanup = dataService.getLocationSummary(locationId, (data) => {
//       setLocationSummary(data);
//       setLoading(false);
//     });

//     // Cleanup function
//     return cleanup;
//   }, [locationId]);

//   return { locationSummary, loading, error };
// }

// // Hook to get candidate proposals
// export function useCandidateProposals(candidateId: string, language: string = 'es') {
//   const [proposals, setProposals] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!candidateId) {
//       setProposals([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     const cleanup = dataService.getCandidateProposals(candidateId, language, (data) => {
//       if (data.candidateId === candidateId) {
//         setProposals(data.proposals || []);
//         setLoading(false);
//       }
//     });

//     // Cleanup function
//     return cleanup;
//   }, [candidateId, language]);

//   return { proposals, loading, error };
// }

// // Hook to get parties and candidates
// export function usePartiesCandidates() {
//   const [partiesCandidates, setPartiesCandidates] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     const cleanup = dataService.getPartiesCandidates((data) => {
//       setPartiesCandidates(data);
//       setLoading(false);
//     });

//     // Cleanup function
//     return cleanup;
//   }, []);

//   return { partiesCandidates, loading, error };
// }

// // Hook to get complete department data
// export function useDepartmentCompleteData(departmentCode: string) {
//   const [departmentData, setDepartmentData] = useState<{
//     department: Department | null;
//     summary: LocationSummary | null;
//   } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = useCallback(async () => {
//     if (!departmentCode) {
//       setDepartmentData(null);
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       const data = await dataService.getDepartmentCompleteData(departmentCode);
//       setDepartmentData(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Error fetching department data');
//     } finally {
//       setLoading(false);
//     }
//   }, [departmentCode]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return { departmentData, loading, error, refetch: fetchData };
// }

// // Hook to check WebSocket status
// export function useSocketStatus() {
//   const [isConnected, setIsConnected] = useState(dataService.isSocketConnected());
//   const [socketId, setSocketId] = useState<string | undefined>(dataService.getSocketId());

//   useEffect(() => {
//     const checkConnection = () => {
//       setIsConnected(dataService.isSocketConnected());
//       setSocketId(dataService.getSocketId());
//     };

//     // Check every second
//     const interval = setInterval(checkConnection, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   return { isConnected, socketId };
// } 