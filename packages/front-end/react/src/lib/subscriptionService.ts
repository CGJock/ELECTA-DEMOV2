import type { Subscription } from '../data/mockData';

const API_URL = 'http://localhost:4000/api/subscriptions';

// Sanitización básica para evitar XSS
export function sanitize(input: string): string {
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
}

export function validateEmail(email: string): boolean {
  return /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function validateName(name: string): boolean {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,50}$/.test(name.trim());
}

export async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo obtener suscripciones');
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function checkSubscriptionExists(name: string, email: string): Promise<boolean> {
  const n = sanitize(name).toLowerCase();
  const e = sanitize(email).toLowerCase();
  const subs = await getSubscriptions();
  return subs.some(
    (s) => s.name.toLowerCase() === n && s.email.toLowerCase() === e && s.isActive
  );
}

export async function addSubscription(name: string, email: string): Promise<{ success: boolean; error?: string }> {
  const n = sanitize(name);
  const e = sanitize(email);
  if (!validateName(n)) return { success: false, error: 'Nombre inválido' };
  if (!validateEmail(e)) return { success: false, error: 'Email inválido' };
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: n, email: e }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Error desconocido' };
    return { success: true };
  } catch (e) {
    return { success: false, error: 'No se pudo guardar la suscripción' };
  }
}

export async function removeSubscription(name: string, email: string): Promise<{ success: boolean; error?: string }> {
  const n = sanitize(name);
  const e = sanitize(email);
  try {
    const res = await fetch(`${API_URL}/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: n, email: e }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Error desconocido' };
    return { success: true };
  } catch (e) {
    return { success: false, error: 'No se pudo eliminar la suscripción' };
  }
} 