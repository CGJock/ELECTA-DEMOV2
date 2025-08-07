// Exportaciones principales de servicios
export { apiService } from './apiService';
export { socketService } from './socketService';
export { dataService } from './dataService';
export { translationService } from './translationService';

// Exportar tipos
export type {
  Department,
  VoteSummary,
  GlobalSummary,
  LocationSummary,
  PartySummary
} from './apiService';

// Exportar hooks
export {
  useDepartments,
  useVoteBreakdown,
  useGlobalSummary,
  useLocationSummary,
  useCandidateProposals,
  usePartiesCandidates,
  useDepartmentCompleteData,
  useSocketStatus
} from './useDataService'; 