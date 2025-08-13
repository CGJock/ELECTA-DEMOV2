// "use client";
// import React, { useEffect, useRef } from 'react';
// import { useSocketData } from '@contexts/context';
// import { subscriptionService } from '@/lib/subscriptionService';

// const DEBOUNCE_MS = 15 * 60 * 1000; // 15 minutos
// const MIN_VOTE_PERCENTAGE = 25; // Mínimo 25% de votos contados para enviar notificaciones

// // Utilidad para debouncing de eventos
// function useDebouncedEvent(key: string, ms: number) {
//   const lastSent = useRef<{ [k: string]: number }>({});
//   return () => {
//     const now = Date.now();
//     if (!lastSent.current[key] || now - lastSent.current[key] > ms) {
//       lastSent.current[key] = now;
//       return true;
//     }
//     return false;
//   };
// }

// /**
//  * NotificationService: Componente simplificado para notificaciones electorales
//  * Se monta en background, detecta eventos y envía correos genéricos
//  */
// const NotificationService = () => {
//   const { globalSummary } = useSocketData();
//   const prevDataHash = useRef<string>('');

//   // Debouncer para eventos
//   const canSendNotification = useDebouncedEvent('generic', DEBOUNCE_MS);

//   // Al inicio del componente, log para saber que está montado
//   console.log('[NotificationService] Componente montado - Sistema simplificado');

//   useEffect(() => {
//     if (!globalSummary || !globalSummary.partyBreakdown) {
//       return;
//     }

//     // Calcular el total de votos contados
//     const totalVotesCounted = globalSummary.partyBreakdown.reduce((sum, party) => {
//       const percentage = typeof party.percentage === 'string' ? parseFloat(party.percentage) : party.percentage;
//       return sum + (isNaN(percentage) ? 0 : percentage);
//     }, 0);

//     // Validar que el cálculo sea correcto
//     if (isNaN(totalVotesCounted) || totalVotesCounted <= 0) {
//       console.warn('[NotificationService] Cálculo de votos inválido:', { 
//         totalVotesCounted, 
//         partyBreakdown: globalSummary.partyBreakdown 
//       });
//       return;
//     }

//     // Solo enviar notificaciones si se han contado al menos 25% de los votos
//     if (totalVotesCounted < MIN_VOTE_PERCENTAGE) {
//       console.log(`[NotificationService] Votos insuficientes (${totalVotesCounted.toFixed(1)}%). Mínimo requerido: ${MIN_VOTE_PERCENTAGE}%`);
//       return;
//     }

//     // Crear un hash simple de los datos para detectar cambios
//     const dataHash = JSON.stringify(globalSummary.partyBreakdown.slice(0, 3).map(p => ({ name: p.name, percentage: p.percentage })));

//     // Detectar si hay cambios significativos
//     if (dataHash !== prevDataHash.current && canSendNotification()) {
//       prevDataHash.current = dataHash;
      
//       console.log('[NotificationService] Cambio detectado, enviando notificación genérica:', {
//         totalVotesCounted,
//         top3: globalSummary.partyBreakdown.slice(0, 3).map(p => ({ name: p.name, percentage: p.percentage }))
//       });
      
//       try {
//         subscriptionService.sendGenericNotification();
//         console.log('[NotificationService] Notificación genérica enviada exitosamente');
//       } catch (error) {
//         console.warn('[NotificationService] Error sending generic notification:', error);
//       }
//     }
//   }, [globalSummary]);

//   return null; // No renderiza nada
// };

// export default NotificationService; 