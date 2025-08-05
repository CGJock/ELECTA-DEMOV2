"use client";
import React, { useEffect, useRef } from 'react';
import { useSocketData } from '@contexts/context';
import { emailService } from '@/services/emailService';
import { subscriptionService } from '@/lib/subscriptionService';

const DEBOUNCE_MS = 5 * 60 * 1000; // 5 minutos

// Utilidad de logging profesional
function logNotification(action: string, details: any) {
  console.log(`[NotificationService][${action}]`, details);
}

// Utilidad para debouncing de eventos
function useDebouncedEvent(key: string, ms: number) {
  const lastSent = useRef<{ [k: string]: number }>({});
  return () => {
    const now = Date.now();
    if (!lastSent.current[key] || now - lastSent.current[key] > ms) {
      lastSent.current[key] = now;
      return true;
    }
    return false;
  };
}

/**
 * NotificationService: Componente plug-and-play para notificaciones electorales
 * Se monta en background, detecta eventos y envía correos automáticamente usando Resend
 */
const NotificationService: React.FC = () => {
  const { globalSummary } = useSocketData();
  const prevTop3 = useRef<string[]>([]);
  const prevWinners = useRef<string[]>([]);
  const prevOver40 = useRef<string | null>(null);

  // Debouncers para cada evento
  const canSendOver40 = useDebouncedEvent('over40', DEBOUNCE_MS);
  const canSendTop3 = useDebouncedEvent('top3', DEBOUNCE_MS);
  const canSendWinners = useDebouncedEvent('winners', DEBOUNCE_MS);

  // Al inicio del componente, log para saber que está montado
  console.log('[NotificationService] Componente montado con Resend');

  useEffect(() => {
    if (!globalSummary || !globalSummary.partyBreakdown) {
      return;
    }

    const sorted = [...globalSummary.partyBreakdown].sort((a, b) => b.percentage - a.percentage);
    const top3 = sorted.slice(0, 3).map(p => p.name);
    const winner = sorted[0]?.percentage >= 40 ? sorted[0].name : null;
    const winners = sorted.filter(p => p.percentage >= 40).map(p => p.name);

    console.log('[NotificationService] Datos para eventos:', { top3, winner, winners });

    // Evento 1: Candidato supera 40%
    if (winner && prevOver40.current !== winner && canSendOver40()) {
      prevOver40.current = winner;
      const candidate = sorted[0].name;
      const percentage = sorted[0].percentage;
      
      // Enviar notificación usando Resend (solo si está configurado)
      try {
        subscriptionService.sendWinnerNotification(candidate, 'Partido', percentage);
        logNotification('over40', { candidate, percentage });
      } catch (error) {
        console.warn('[NotificationService] Error sending winner notification:', error);
      }
    }

    // Evento 2: Cambio en el TOP 3
    if (prevTop3.current.length && top3.join() !== prevTop3.current.join() && canSendTop3()) {
      logNotification('top3', { old: prevTop3.current, new: top3 });
      // Aquí podrías implementar notificación específica para cambios en TOP 3
    }
    prevTop3.current = top3;

    // Evento 3: Ganadores oficiales
    if (winners.length && winners.join() !== prevWinners.current.join() && canSendWinners()) {
      const winner = winners[0];
      const winnerData = sorted.find(p => p.name === winner);
      if (winnerData) {
        try {
          subscriptionService.sendWinnerNotification(winner, 'Partido', winnerData.percentage);
          logNotification('winners', { winners, results: winnerData });
        } catch (error) {
          console.warn('[NotificationService] Error sending winner notification:', error);
        }
      }
    }
    prevWinners.current = winners;
  }, [globalSummary]);

  return null; // No renderiza nada
};

export default NotificationService; 