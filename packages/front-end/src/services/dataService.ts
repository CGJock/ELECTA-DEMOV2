// // Data Service unificado que combina API REST y WebSockets
// import { apiService, type Department, type VoteSummary, type GlobalSummary, type LocationSummary } from './apiService';
// import { socketService } from './socketService';

// export type { Department, VoteSummary, GlobalSummary, LocationSummary } from './apiService';

// class DataService {
//   // ===== MÉTODOS DE API REST =====

//   // Obtener todos los departamentos
//   async getDepartments(): Promise<Department[]> {
//     return await apiService.getDepartments();
//   }

//   // Obtener departamento por código
//   async getDepartmentByCode(code: string): Promise<Department | null> {
//     return await apiService.getDepartmentByCode(code);
//   }

//   // Actualizar votos
//   async updateVotes(voteData: any): Promise<any> {
//     return await apiService.updateVotes(voteData);
//   }

//   // ===== MÉTODOS DE WEBSOCKET =====

//   // Obtener breakdown de votos (WebSocket)
//   getVoteBreakdown(callback: (data: VoteSummary) => void): () => void {
//     socketService.on('vote-breakdown', callback);
//     socketService.emit('get-vote-breakdown');
    
//     // Retorna función para limpiar el listener
//     return () => socketService.off('vote-breakdown', callback);
//   }

//   // Obtener resumen global (WebSocket con actualización automática)
//   getGlobalSummary(callback: (data: GlobalSummary) => void): () => void {
//     socketService.on('global-vote-summary', callback);
//     socketService.emit('get-global-summary');
    
//     // Retorna función para limpiar el listener
//     return () => socketService.off('global-vote-summary', callback);
//   }

//   // Obtener resumen por ubicación (WebSocket)
//   getLocationSummary(locationId: string, callback: (data: LocationSummary) => void): () => void {
//     socketService.on('location-breakdown-summary', callback);
//     socketService.emit('get-location-summary', locationId);
    
//     // Retorna función para limpiar el listener
//     return () => socketService.off('location-breakdown-summary', callback);
//   }

//   // Obtener propuestas de candidato (WebSocket)
//   getCandidateProposals(candidateId: string, language: string = 'es', callback: (data: { candidateId: string; proposals: any[] }) => void): () => void {
//     socketService.on('candidate-proposals', callback);
//     socketService.emit('get-candidate-proposals', { candidateId, language });
    
//     // Retorna función para limpiar el listener
//     return () => socketService.off('candidate-proposals', callback);
//   }

//   // Obtener partidos y candidatos (WebSocket)
//   getPartiesCandidates(callback: (data: any[]) => void): () => void {
//     socketService.on('parties-candidates', callback);
//     socketService.emit('get-parties-candidates');
    
//     // Retorna función para limpiar el listener
//     return () => socketService.off('parties-candidates', callback);
//   }

//   // ===== MÉTODOS DE UTILIDAD =====

//   // Verificar si el WebSocket está conectado
//   isSocketConnected(): boolean {
//     return socketService.connected;
//   }

//   // Obtener ID del socket
//   getSocketId(): string | undefined {
//     return socketService.socketId;
//   }

//   // Desconectar WebSocket
//   disconnectSocket(): void {
//     socketService.disconnect();
//   }

//   // ===== MÉTODOS DE DATOS COMBINADOS =====

//   // Obtener datos completos de un departamento (REST + WebSocket)
//   async getDepartmentCompleteData(departmentCode: string): Promise<{
//     department: Department | null;
//     summary: LocationSummary | null;
//   }> {
//     try {
//       // Obtener datos del departamento via REST
//       const department = await this.getDepartmentByCode(departmentCode);
      
//       // Obtener resumen via WebSocket (retorna Promise)
//       const summary = await this.getLocationSummaryPromise(departmentCode);
      
//       return { department, summary };
//     } catch (error) {
//       console.error('Error getting complete department data:', error);
//       return { department: null, summary: null };
//     }
//   }

//   // Versión Promise del getLocationSummary para uso en async/await
//   private getLocationSummaryPromise(locationId: string): Promise<LocationSummary | null> {
//     return new Promise((resolve) => {
//       const cleanup = this.getLocationSummary(locationId, (data) => {
//         cleanup();
//         resolve(data);
//       });
      
//       // Timeout después de 5 segundos
//       setTimeout(() => {
//         cleanup();
//         resolve(null);
//       }, 5000);
//     });
//   }
// }

// export const dataService = new DataService(); 