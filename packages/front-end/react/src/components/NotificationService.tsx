"use client";
import React, { useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useSocketData } from '@contexts/context';
import { useState } from 'react';

// Configuración desde variables de entorno
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID || '';
const TEMPLATE_40 = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_40 || '';
const TEMPLATE_TOP3 = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_TOP3 || '';
const TEMPLATE_WINNERS = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_WINNERS || '';
const NOTIFY_LINK = process.env.NEXT_PUBLIC_NOTIFICATION_LINK || 'https://tusitio.com/resultados';
const DEFAULT_RETRIES = 2;
const DEBOUNCE_MS = 5 * 60 * 1000; // 5 minutos

// Hook para cargar suscriptores activos desde el archivo público
function useActiveSubscribers() {
  const [subscribers, setSubscribers] = useState<{ name: string; email: string }[]>([]);
  useEffect(() => {
    fetch('/data/subscriptions.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSubscribers(data.filter(s => s.isActive).map(s => ({ name: s.name, email: s.email })));
        }
      });
  }, []);
  return subscribers;
}

// Utilidad de logging profesional
function logNotification(action: string, details: any) {
  // eslint-disable-next-line no-console
  console.log(`[NotificationService][${action}]`, details);
}

// Plantillas de correo internas
function candidateOver40Template(candidate: string, percentage: number) {
  return {
    subject: `¡${candidate} supera el 40% de los votos!`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#222;background:#f9f9f9;padding:24px;border-radius:8px;max-width:480px;margin:auto;">
        <h2>Notificación Electoral</h2>
        <p>El candidato <b>${candidate}</b> ha superado el <b>${percentage}%</b> de los votos.</p>
        <p>¡Sigue el conteo en tiempo real!</p>
        <a href="${NOTIFY_LINK}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:4px;text-decoration:none;font-weight:bold;">Ver resultados completos</a>
        <p style="font-size:12px;color:#888;margin-top:24px;">Gracias por seguir el proceso electoral.</p>
      </div>
    `,
    candidate,
    percentage,
    link: NOTIFY_LINK,
  };
}

function top3ChangedTemplate(oldRanking: string[], newRanking: string[]) {
  return {
    subject: `¡Cambio en el TOP 3 de candidatos!`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#222;background:#f9f9f9;padding:24px;border-radius:8px;max-width:480px;margin:auto;">
        <h2>Actualización de Ranking</h2>
        <p>El ranking de los tres primeros candidatos ha cambiado:</p>
        <table style="width:100%;margin:16px 0;">
          <tr><th style="text-align:left;">Anterior</th><th style="text-align:left;">Actual</th></tr>
          <tr>
            <td>${oldRanking.map((c, i) => `<div>${i + 1}. ${c}</div>`).join('')}</td>
            <td>${newRanking.map((c, i) => `<div>${i + 1}. ${c}</div>`).join('')}</td>
          </tr>
        </table>
        <a href="${NOTIFY_LINK}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:4px;text-decoration:none;font-weight:bold;">Ver detalles</a>
        <p style="font-size:12px;color:#888;margin-top:24px;">Gracias por tu interés en el proceso electoral.</p>
      </div>
    `,
    oldRanking: oldRanking.join(', '),
    newRanking: newRanking.join(', '),
    link: NOTIFY_LINK,
  };
}

function officialWinnersTemplate(winners: string[], results: string) {
  return {
    subject: `¡Resultados oficiales y ganadores anunciados!`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#222;background:#f9f9f9;padding:24px;border-radius:8px;max-width:480px;margin:auto;">
        <h2>¡Ganadores Oficiales!</h2>
        <p>Se han anunciado los resultados finales. Los ganadores son:</p>
        <ul style="margin:16px 0;">
          ${winners.map(w => `<li><b>${w}</b></li>`).join('')}
        </ul>
        <p><b>Resultados finales:</b></p>
        <pre style="background:#eee;padding:12px;border-radius:4px;">${results}</pre>
        <a href="${NOTIFY_LINK}" style="display:inline-block;padding:10px 20px;background:#059669;color:#fff;border-radius:4px;text-decoration:none;font-weight:bold;">Ver resultados completos</a>
        <p style="font-size:12px;color:#888;margin-top:24px;">Gracias por acompañarnos durante todo el proceso electoral.</p>
      </div>
    `,
    winners: winners.join(', '),
    results,
    link: NOTIFY_LINK,
  };
}

// Función para enviar correo con reintentos y logging
async function sendEmail({ templateId, to_email, to_name, ...params }: any, retries = DEFAULT_RETRIES) {
  if (!SERVICE_ID || !USER_ID || !templateId) {
    logNotification('error', { error: 'Faltan credenciales o templateId', to_email });
    return { success: false, error: 'Configuración incompleta' };
  }
  let attempt = 0;
  while (attempt <= retries) {
    try {
      await emailjs.send(SERVICE_ID, templateId, { to_email, to_name, ...params }, USER_ID);
      logNotification('success', { to_email, templateId });
      return { success: true };
    } catch (error: any) {
      logNotification('error', { to_email, templateId, error });
      attempt++;
      if (attempt > retries) {
        return { success: false, error: error?.message || 'Error enviando email' };
      }
      await new Promise(res => setTimeout(res, 500 * attempt));
    }
  }
  return { success: false, error: 'Error desconocido' };
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
 * Se monta en background, detecta eventos y envía correos automáticamente
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
  console.log('[NotificationService] Componente montado');

  useEffect(() => {
    // console.log('[NotificationService] useEffect ejecutado', globalSummary);

    // if (!globalSummary || !globalSummary.partyBreakdown) {
    //   console.log('[NotificationService] globalSummary vacío o sin partyBreakdown');
    //   return;
    // }

    // const sorted = [...globalSummary.partyBreakdown].sort((a, b) => b.percentage - a.percentage);
    // const top3 = sorted.slice(0, 3).map(p => p.name);
    // const winner = sorted[0]?.percentage >= 40 ? sorted[0].name : null;
    // const winners = sorted.filter(p => p.percentage >= 40).map(p => p.name);

    // console.log('[NotificationService] Datos para eventos:', { top3, winner, winners });

    // // Evento 1: Candidato supera 40%
    // if (winner && prevOver40.current !== winner && canSendOver40()) {
    //   prevOver40.current = winner;
    //   const candidate = sorted[0].name;
    //   const percentage = sorted[0].percentage;
    //   const template = candidateOver40Template(candidate, percentage);
    //   subscribers.forEach(sub => {
    //     console.log('[NotificationService][intent][over40]', sub.email, sub.name);
    //     sendEmail({
    //       templateId: TEMPLATE_40,
    //       to_email: sub.email,
    //       to_name: sub.name,
    //       ...template,
    //     });
    //   });
    //   logNotification('over40', { candidate, percentage });
    // }

    // // Evento 2: Cambio en el TOP 3
    // if (prevTop3.current.length && top3.join() !== prevTop3.current.join() && canSendTop3()) {
    //   const template = top3ChangedTemplate(prevTop3.current, top3);
    //   subscribers.forEach(sub => {
    //     console.log('[NotificationService][intent][top3]', sub.email, sub.name);
    //     sendEmail({
    //       templateId: TEMPLATE_TOP3,
    //       to_email: sub.email,
    //       to_name: sub.name,
    //       ...template,
    //     });
    //   });
    //   logNotification('top3', { old: prevTop3.current, new: top3 });
    // }
    // prevTop3.current = top3;

    // // Evento 3: Ganadores oficiales (simulado: todos >=40%)
    // if (winners.length && winners.join() !== prevWinners.current.join() && canSendWinners()) {
    //   const results = sorted.map(p => `${p.name}: ${p.percentage}%`).join('\n');
    //   const template = officialWinnersTemplate(winners, results);
    //   subscribers.forEach(sub => {
    //     console.log('[NotificationService][intent][winners]', sub.email, sub.name);
    //     sendEmail({
    //       templateId: TEMPLATE_WINNERS,
    //       to_email: sub.email,
    //       to_name: sub.name,
    //       ...template,
    //     });
    //   });
    //   logNotification('winners', { winners, results });
    // }
    // prevWinners.current = winners;
  }, [globalSummary]);

  return null; // No renderiza nada
};

export default NotificationService; 