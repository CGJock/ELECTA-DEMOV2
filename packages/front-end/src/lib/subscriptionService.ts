// import { emailService, type SubscriptionEmailData, type GenericNotificationData } from '@/services/emailService';

// export interface Subscription {
//   id: number;
//   email: string;
// }

// interface DBResponse {
//   success: boolean;
//   error?: string;
//   data?: any;
// }

// class SubscriptionService {
//   private subscriptions: Subscription[] = [];
//   private apiBaseUrl: string;

//   constructor() {
//     this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
//     // Load subscriptions from database on initialization
//     this.loadSubscriptionsFromDB();
//   }

//   // Method to save subscription to database using the new endpoint
//   private async saveSubscriptionToDB(email: string): Promise<DBResponse> {
//     try {
//       const response = await fetch(`${this.apiBaseUrl}/email`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
//         },
//         body: JSON.stringify({ user_email: email }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         return { success: false, error: errorData.error || 'Error saving to database' };
//       }

//       const data = await response.json();
//       return { success: true, data };
//     } catch (error) {
//       console.error('Error saving subscription to DB:', error);
//       return { success: false, error: 'Server connection error' };
//     }
//   }

//   // Method to remove subscription from database
//   private async removeSubscriptionFromDB(email: string): Promise<DBResponse> {
//     try {
//       const response = await fetch(`${this.apiBaseUrl}/email`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
//         },
//         body: JSON.stringify({ user_email: email }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         return { success: false, error: errorData.error || 'Error removing from database' };
//       }

//       return { success: true };
//     } catch (error) {
//       console.error('Error removing subscription from DB:', error);
//       return { success: false, error: 'Server connection error' };
//     }
//   }

//   // Method to load subscriptions from database using the new endpoint
//   private async loadSubscriptionsFromDB(): Promise<void> {
//     try {
//       const response = await fetch(`${this.apiBaseUrl}/mails`, {
//         headers: {
//           'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
//         },
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         this.subscriptions = data.map((item: any) => ({
//           id: item.id,
//           email: item.email
//         }));
//         console.log(`Loaded ${this.subscriptions.length} subscriptions from database`);
//       } else {
//         console.warn('Failed to load subscriptions from DB, using empty array');
//         this.subscriptions = [];
//       }
//     } catch (error) {
//       console.error('Error loading subscriptions from DB:', error);
//       this.subscriptions = [];
//     }
//   }

//   async subscribeUser(email: string, language: 'es' | 'en' = 'es'): Promise<{ success: boolean; error?: string }> {
//     try {
//       // Validate email
//       if (!this.isValidEmail(email)) {
//         return { success: false, error: 'Invalid email' };
//       }

//       // Check if already exists locally
//       const existingSubscription = this.subscriptions.find(sub => sub.email.toLowerCase() === email.toLowerCase());
//       if (existingSubscription) {
//         return { success: false, error: 'This email is already subscribed' };
//       }

//       // Try to save to database
//       const dbResult = await this.saveSubscriptionToDB(email);
      
//              if (!dbResult.success) {
//          // If database fails, don't save anything
//          console.warn('Failed to save to DB:', dbResult.error);
//          return { success: false, error: 'Could not save subscription' };
//        } else {
//          // If successfully saved to DB, add to local list
//          const newSubscription: Subscription = {
//            id: dbResult.data?.id || Date.now(),
//            email,
//          };
//          this.subscriptions.push(newSubscription);
//          console.log(`Successful subscription for ${email}`);
//        }

//       // Send confirmation email
//       const emailResult = await emailService.sendSubscriptionEmail({
//         email,
//         language,
//       });

//       if (!emailResult.success) {
//         console.warn('Failed to send subscription email:', emailResult.error);
//         // Don't fail subscription if email fails
//       }

//       return { success: true };
//     } catch (error) {
//       console.error('Error subscribing user:', error);
//       return { 
//         success: false, 
//         error: error instanceof Error ? error.message : 'Error desconocido' 
//       };
//     }
//   }

//   async unsubscribeUser(email: string): Promise<{ success: boolean; error?: string }> {
//     try {
//       const subscription = this.subscriptions.find(sub => sub.email.toLowerCase() === email.toLowerCase());
      
//       if (!subscription) {
//         return { success: false, error: 'Email not found in subscriptions' };
//       }

//       // Try to remove from database
//       const dbResult = await this.removeSubscriptionFromDB(email);
      
//       if (!dbResult.success) {
//         console.warn('Failed to remove from DB:', dbResult.error);
//       }

//              // Remove locally
//        this.subscriptions = this.subscriptions.filter(sub => sub.email.toLowerCase() !== email.toLowerCase());
//        console.log(`Successful unsubscription for ${email}`);

//       // Send unsubscription confirmation email
//       const emailResult = await emailService.sendUnsubscriptionEmail({
//         email: subscription.email,
//         language: 'es',
//       });

//       if (!emailResult.success) {
//         console.warn('Failed to send unsubscription email:', emailResult.error);
//         // Don't fail unsubscription if email fails
//       }

//       return { success: true };
//     } catch (error) {
//       console.error('Error unsubscribing user:', error);
//       return { 
//         success: false, 
//         error: error instanceof Error ? error.message : 'Error desconocido' 
//       };
//     }
//   }

//   async sendGenericNotification(): Promise<{ success: boolean; error?: string }> {
//     try {
//       // Load subscriptions from database if possible
//       await this.loadSubscriptionsFromDB();
      
//       const activeSubscriptions = this.subscriptions;
      
//       if (activeSubscriptions.length === 0) {
//         console.log('No active subscribers to send notification to');
//         return { success: true }; // No subscribers, not an error
//       }

//       let successCount = 0;
//       let errorCount = 0;

//       console.log(`Sending generic notification to ${activeSubscriptions.length} subscribers`);

//       // Send notification to all active subscribers
//       for (const subscription of activeSubscriptions) {
//         const emailResult = await emailService.sendGenericNotificationEmail({
//           email: subscription.email,
//           language: 'es',
//         });

//         if (emailResult.success) {
//           successCount++;
//         } else {
//           errorCount++;
//           console.error(`Failed to send generic notification to ${subscription.email}:`, emailResult.error);
//         }
//       }

//       console.log(`Generic notification sent: ${successCount} successful, ${errorCount} failed`);

//       return { success: true };
//     } catch (error) {
//       console.error('Error sending generic notification:', error);
//       return { 
//         success: false, 
//         error: error instanceof Error ? error.message : 'Error desconocido' 
//       };
//     }
//   }

//   getActiveSubscriptions(): Subscription[] {
//     return this.subscriptions;
//   }

//   getSubscriptionByEmail(email: string): Subscription | undefined {
//     return this.subscriptions.find(sub => sub.email.toLowerCase() === email.toLowerCase());
//   }

//   getTotalSubscriptions(): number {
//     return this.subscriptions.length;
//   }

//   // Method to get subscription statistics
//   getSubscriptionStats(): { total: number; active: number; inactive: number } {
//     const total = this.subscriptions.length;
//     const active = this.subscriptions.length; // For now all are active
//     const inactive = 0;
    
//     return { total, active, inactive };
//   }

//   private isValidEmail(email: string): boolean {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email) && email.length > 0 && email.length <= 254;
//   }

//   // Method to sync with database
//   async syncWithDatabase(): Promise<void> {
//     try {
//       console.log('Syncing subscriptions with database...');
//       await this.loadSubscriptionsFromDB();
//       console.log('Sync completed');
//     } catch (error) {
//       console.error('Error syncing with database:', error);
//       // If sync fails, keep local subscriptions
//     }
//   }

//   // Method to clear local subscriptions (useful for testing)
//   clearLocalSubscriptions(): void {
//     this.subscriptions = [];
//     console.log('Local subscriptions cleared');
//   }

//   // Method to add test emails allowed in testing mode
//   addTestSubscriptions(): void {
//     const testEmails = ['electa.desk@gmail.com']; // Only emails allowed in testing
    
//     // Clear existing subscriptions
//     this.subscriptions = [];
    
//     // Add test emails
//     testEmails.forEach((email, index) => {
//       this.subscriptions.push({
//         id: index + 1,
//         email: email
//       });
//     });
    
//     console.log('Test emails added:', testEmails);
//   }

//   // Simple method for manual testing
//   async testNotification(): Promise<void> {
//     console.log('Sending test notification...');
//     await this.sendGenericNotification();
//   }

//   // Method to check database connection status
//   async checkDatabaseConnection(): Promise<{ connected: boolean; error?: string }> {
//     try {
//       const response = await fetch(`${this.apiBaseUrl}/mails`, {
//         headers: {
//           'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
//         },
//       });
      
//       return { connected: response.ok };
//     } catch (error) {
//       return { 
//         connected: false, 
//         error: error instanceof Error ? error.message : 'Unknown error' 
//       };
//     }
//   }

//   // Method to get debug information
//   getDebugInfo(): { 
//     totalSubscriptions: number; 
//     apiBaseUrl: string; 
//     hasApiKey: boolean; 
//     localSubscriptions: Subscription[] 
//   } {
//     return {
//       totalSubscriptions: this.subscriptions.length,
//       apiBaseUrl: this.apiBaseUrl,
//       hasApiKey: !!(process.env.NEXT_PUBLIC_API_KEY),
//       localSubscriptions: this.subscriptions
//     };
//   }

//   // Method to export subscriptions (useful for backup)
//   exportSubscriptions(): string {
//     return JSON.stringify(this.subscriptions, null, 2);
//   }

//   // Method to import subscriptions (useful for restore)
//   importSubscriptions(data: string): { success: boolean; error?: string } {
//     try {
//       const subscriptions = JSON.parse(data);
//       if (Array.isArray(subscriptions)) {
//         this.subscriptions = subscriptions;
//         console.log(`Imported ${subscriptions.length} subscriptions`);
//         return { success: true };
//       } else {
//         return { success: false, error: 'Invalid data format' };
//       }
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error instanceof Error ? error.message : 'Import error' 
//       };
//     }
//   }

//   // Method to validate and clean duplicate subscriptions
//   cleanDuplicateSubscriptions(): { removed: number; total: number } {
//     const uniqueSubscriptions = new Map<string, Subscription>();
    
//     for (const subscription of this.subscriptions) {
//       const key = subscription.email.toLowerCase();
//       if (!uniqueSubscriptions.has(key)) {
//         uniqueSubscriptions.set(key, subscription);
//       }
//     }
    
//     const removed = this.subscriptions.length - uniqueSubscriptions.size;
//     this.subscriptions = Array.from(uniqueSubscriptions.values());
    
//     console.log(`Cleanup completed: ${removed} duplicates removed`);
//     return { removed, total: this.subscriptions.length };
//   }
// }

// export const subscriptionService = new SubscriptionService(); 