import { emailService, type SubscriptionEmailData, type WinnerNotificationData } from '@/services/emailService';

export interface Subscription {
  id: number;
  email: string;
}

interface DBResponse {
  success: boolean;
  error?: string;
  data?: any;
}

class SubscriptionService {
  private subscriptions: Subscription[] = [];

  constructor() {
    this.loadSubscriptions();
  }

  private loadSubscriptions(): void {
    try {
      const stored = localStorage.getItem('electa_subscriptions');
      if (stored) {
        this.subscriptions = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      this.subscriptions = [];
    }
  }

  private saveSubscriptions(): void {
    try {
      localStorage.setItem('electa_subscriptions', JSON.stringify(this.subscriptions));
    } catch (error) {
      console.error('Error saving subscriptions:', error);
    }
  }

  // Método para guardar suscripción en la base de datos
  private async saveSubscriptionToDB(email: string): Promise<DBResponse> {
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.error || 'Error al guardar en la base de datos' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error saving subscription to DB:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  }

  // Método para eliminar suscripción de la base de datos
  private async removeSubscriptionFromDB(email: string): Promise<DBResponse> {
    try {
      const response = await fetch(`/api/newsletter/unsubscribe`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.error || 'Error al eliminar de la base de datos' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error removing subscription from DB:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  }

  // Método para cargar suscripciones desde la base de datos
  private async loadSubscriptionsFromDB(): Promise<void> {
    try {
      const response = await fetch('/api/newsletter/subscriptions');
      if (response.ok) {
        const data = await response.json();
        this.subscriptions = data.map((item: any) => ({
          id: item.id,
          email: item.mail || item.email
        }));
        this.saveSubscriptions();
      }
    } catch (error) {
      console.error('Error loading subscriptions from DB:', error);
      // Si falla, mantener las suscripciones locales
    }
  }

  async subscribeUser(email: string, name?: string, language: 'es' | 'en' = 'es'): Promise<{ success: boolean; error?: string }> {
    try {
      // Validar email
      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Email inválido' };
      }

      // Verificar si ya existe localmente
      const existingSubscription = this.subscriptions.find(sub => sub.email.toLowerCase() === email.toLowerCase());
      if (existingSubscription) {
        return { success: false, error: 'Este email ya está suscrito' };
      }

      // Intentar guardar en la base de datos
      const dbResult = await this.saveSubscriptionToDB(email);
      
      if (!dbResult.success) {
        // Si falla la base de datos, guardar localmente como respaldo
        console.warn('Failed to save to DB, saving locally:', dbResult.error);
        const newSubscription: Subscription = {
          id: Date.now(), // ID temporal
          email,
        };
        this.subscriptions.push(newSubscription);
        this.saveSubscriptions();
      } else {
        // Si se guardó exitosamente en la DB, agregar a la lista local
        const newSubscription: Subscription = {
          id: dbResult.data?.id || Date.now(),
          email,
        };
        this.subscriptions.push(newSubscription);
        this.saveSubscriptions();
      }

      // Enviar email de confirmación
      const emailResult = await emailService.sendSubscriptionEmail({
        email,
        name,
        language,
      });

      if (!emailResult.success) {
        console.warn('Failed to send subscription email:', emailResult.error);
        // No fallar la suscripción si el email falla
      }

      return { success: true };
    } catch (error) {
      console.error('Error subscribing user:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }

  async unsubscribeUser(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const subscription = this.subscriptions.find(sub => sub.email.toLowerCase() === email.toLowerCase());
      
      if (!subscription) {
        return { success: false, error: 'Email no encontrado en las suscripciones' };
      }

      // Intentar eliminar de la base de datos
      const dbResult = await this.removeSubscriptionFromDB(email);
      
      if (!dbResult.success) {
        console.warn('Failed to remove from DB:', dbResult.error);
      }

      // Eliminar localmente
      this.subscriptions = this.subscriptions.filter(sub => sub.email.toLowerCase() !== email.toLowerCase());
      this.saveSubscriptions();

      // Enviar email de confirmación de desuscripción
      const emailResult = await emailService.sendUnsubscriptionEmail({
        email: subscription.email,
        name: undefined,
        language: 'es',
      });

      if (!emailResult.success) {
        console.warn('Failed to send unsubscription email:', emailResult.error);
        // No fallar la desuscripción si el email falla
      }

      return { success: true };
    } catch (error) {
      console.error('Error unsubscribing user:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }

  async sendWinnerNotification(winnerName: string, winnerParty: string, percentage: number): Promise<{ success: boolean; error?: string }> {
    try {
      // Cargar suscripciones desde la base de datos si es posible
      await this.loadSubscriptionsFromDB();
      
      const activeSubscriptions = this.subscriptions;
      
      if (activeSubscriptions.length === 0) {
        return { success: true }; // No hay suscriptores, no es un error
      }

      let successCount = 0;
      let errorCount = 0;

      // Enviar notificación a todos los suscriptores activos
      for (const subscription of activeSubscriptions) {
        const emailResult = await emailService.sendWinnerNotificationEmail({
          email: subscription.email,
          name: undefined,
          winnerName,
          winnerParty,
          percentage,
          language: 'es',
        });

        if (emailResult.success) {
          successCount++;
        } else {
          errorCount++;
          console.error(`Failed to send winner notification to ${subscription.email}:`, emailResult.error);
        }
      }

      console.log(`Winner notification sent: ${successCount} successful, ${errorCount} failed`);

      return { success: true };
    } catch (error) {
      console.error('Error sending winner notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }

  getActiveSubscriptions(): Subscription[] {
    return this.subscriptions;
  }

  getSubscriptionByEmail(email: string): Subscription | undefined {
    return this.subscriptions.find(sub => sub.email.toLowerCase() === email.toLowerCase());
  }

  getTotalSubscriptions(): number {
    return this.subscriptions.length;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método para sincronizar con la base de datos
  async syncWithDatabase(): Promise<void> {
    await this.loadSubscriptionsFromDB();
  }
}

export const subscriptionService = new SubscriptionService(); 