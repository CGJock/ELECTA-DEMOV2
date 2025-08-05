// EmailService para el cliente - usa API routes para enviar emails

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface SubscriptionEmailData {
  email: string;
  name?: string;
  language?: 'es' | 'en';
}

export interface IncidentEmailData {
  email: string;
  name: string;
  incidentType: string;
  description: string;
  location: string;
  timestamp: string;
}

export interface WinnerNotificationData {
  email: string;
  name?: string;
  winnerName: string;
  winnerParty: string;
  percentage: number;
  language?: 'es' | 'en';
}

export interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

class EmailService {
  private async callEmailAPI(endpoint: string, data: any): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/email/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Email send failed' };
      }
    } catch (error) {
      console.error('Error calling email API:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async sendSubscriptionEmail(data: SubscriptionEmailData): Promise<{ success: boolean; error?: string }> {
    return this.callEmailAPI('subscription', data);
  }

  async sendUnsubscriptionEmail(data: SubscriptionEmailData): Promise<{ success: boolean; error?: string }> {
    return this.callEmailAPI('unsubscription', data);
  }

  async sendIncidentReportEmail(data: IncidentEmailData): Promise<{ success: boolean; error?: string }> {
    return this.callEmailAPI('incident', data);
  }

  async sendWinnerNotificationEmail(data: WinnerNotificationData): Promise<{ success: boolean; error?: string }> {
    return this.callEmailAPI('winner', data);
  }

  async sendContactEmail(data: ContactEmailData): Promise<{ success: boolean; error?: string }> {
    return this.callEmailAPI('contact', data);
  }
}

export const emailService = new EmailService(); 