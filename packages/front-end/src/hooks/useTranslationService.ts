import { useState, useCallback, useEffect } from 'react';
import { translationService } from '@/services/translationService';
import type { Incident } from '@/types/election';

interface UseTranslationServiceReturn {
  translateIncident: (incident: Incident) => Promise<Incident>;
  translateText: (text: string, targetLanguage?: string) => Promise<string>;
  isTranslating: boolean;
  isConfigured: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook personalizado para manejar la traducción de incidentes
 */
export const useTranslationService = (): UseTranslationServiceReturn => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Verificar si el servicio está configurado al montar el hook
    setIsConfigured(translationService.isConfigured());
  }, []);

  const translateText = useCallback(async (text: string, targetLanguage: string = 'en'): Promise<string> => {
    if (!text || text.trim() === '') {
      return text;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const translatedText = await translationService.translateText(text, targetLanguage, 'es');
      return translatedText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al traducir';
      setError(errorMessage);
      console.error('Error al traducir texto:', err);
      return text; // Retorna el texto original en caso de error
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const translateIncident = useCallback(async (incident: Incident): Promise<Incident> => {
    setIsTranslating(true);
    setError(null);

    try {
      const translatedIncident = await translationService.translateIncident(incident);
      return translatedIncident;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al traducir incidente';
      setError(errorMessage);
      console.error('Error al traducir incidente:', err);
      return incident; // Retorna el incidente original en caso de error
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    translateIncident,
    translateText,
    isTranslating,
    isConfigured,
    error,
    clearError,
  };
}; 