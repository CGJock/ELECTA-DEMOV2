// Servicio de traducción usando Microsoft Translator API
// Documentación: https://learn.microsoft.com/en-us/azure/ai-services/translator/quickstart-translator

interface TranslationRequest {
  text: string;
  from?: string;
  to: string;
}

interface TranslationResponse {
  translations: Array<{
    text: string;
    to: string;
  }>;
}

interface TranslationError {
  error: {
    code: number;
    message: string;
  };
}

class TranslationService {
  private apiKey: string | null = null;
  private endpoint: string = 'https://api.cognitive.microsofttranslator.com';
  private region: string = 'global'; // Cambiar según tu región de Azure

  constructor() {
    // Intentar obtener la API key desde las variables de entorno
    if (typeof window !== 'undefined') {
      this.apiKey = process.env.NEXT_PUBLIC_MICROSOFT_TRANSLATOR_KEY || null;
    }
  }

  /**
   * Configura la API key para Microsoft Translator
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Configura la región de Azure
   */
  setRegion(region: string) {
    this.region = region;
  }

  /**
   * Traduce un texto usando Microsoft Translator
   */
  async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string> {
    if (!this.apiKey) {
      console.warn('Microsoft Translator API key no configurada');
      return text; // Retorna el texto original si no hay API key
    }

    if (!text || text.trim() === '') {
      return text;
    }

    try {
      const response = await fetch(`${this.endpoint}/translate?api-version=3.0&to=${targetLanguage}${sourceLanguage ? `&from=${sourceLanguage}` : ''}`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.apiKey,
          'Ocp-Apim-Subscription-Region': this.region,
          'Content-Type': 'application/json',
          'X-ClientTraceId': this.generateTraceId(),
        },
        body: JSON.stringify([{ text }]),
      });

      if (!response.ok) {
        const errorData: TranslationError = await response.json();
        throw new Error(`Error de traducción: ${errorData.error.message}`);
      }

      const data: TranslationResponse[] = await response.json();
      
      if (data && data[0] && data[0].translations && data[0].translations.length > 0) {
        return data[0].translations[0].text;
      }

      return text;
    } catch (error) {
      console.error('Error al traducir texto:', error);
      return text; // Retorna el texto original en caso de error
    }
  }

  /**
   * Traduce un objeto con propiedades en español a inglés
   */
  async translateObject<T extends Record<string, any>>(
    obj: T, 
    propertiesToTranslate: (keyof T)[],
    targetLanguage: 'en' | 'es' = 'en'
  ): Promise<T> {
    const translatedObj = { ...obj };

    for (const property of propertiesToTranslate) {
      if (typeof obj[property] === 'string' && obj[property]) {
        const translatedText = await this.translateText(
          obj[property] as string,
          targetLanguage,
          'es'
        );
        translatedObj[property] = translatedText;
      }
    }

    return translatedObj;
  }

  /**
   * Traduce un incidente completo
   */
  async translateIncident(incident: any): Promise<any> {
    const translatedIncident = { ...incident };

    // Traducir título
    if (incident.title && typeof incident.title === 'object' && incident.title.es) {
      translatedIncident.title = {
        ...incident.title,
        en: await this.translateText(incident.title.es, 'en', 'es')
      };
    }

    // Traducir descripción
    if (incident.description && typeof incident.description === 'object' && incident.description.es) {
      translatedIncident.description = {
        ...incident.description,
        en: await this.translateText(incident.description.es, 'en', 'es')
      };
    }

    // Traducir ubicación
    if (incident.location && typeof incident.location === 'object' && incident.location.es) {
      translatedIncident.location = {
        ...incident.location,
        en: await this.translateText(incident.location.es, 'en', 'es')
      };
    }

    return translatedIncident;
  }

  /**
   * Genera un ID único para el trace
   */
  private generateTraceId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Verifica si el servicio está configurado correctamente
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Obtiene información sobre el uso de la API
   */
  async getUsageInfo(): Promise<any> {
    if (!this.apiKey) {
      throw new Error('API key no configurada');
    }

    try {
      const response = await fetch(`${this.endpoint}/usage?api-version=3.0`, {
        headers: {
          'Ocp-Apim-Subscription-Key': this.apiKey,
          'Ocp-Apim-Subscription-Region': this.region,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener información de uso');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener información de uso:', error);
      throw error;
    }
  }
}

// Instancia singleton del servicio
export const translationService = new TranslationService();

// Exportar la clase para testing
export { TranslationService }; 