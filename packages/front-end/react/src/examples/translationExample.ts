// Ejemplo de uso del servicio de traducción
// Este archivo muestra cómo usar el servicio de traducción de Microsoft Translator

import { translationService } from '@/services/translationService';
import type { Incident } from '@/types/election';

/**
 * Ejemplo básico de traducción de texto
 */
export async function translateTextExample() {
  try {
    // Configurar la API key (en producción, esto se haría desde la interfaz)
    translationService.setApiKey('tu_api_key_aqui');
    translationService.setRegion('global');

    // Traducir un texto simple
    const originalText = 'Problema de conectividad en el centro de votación';
    const translatedText = await translationService.translateText(originalText, 'en', 'es');
    
    console.log('Texto original:', originalText);
    console.log('Texto traducido:', translatedText);
    
    return translatedText;
  } catch (error) {
    console.error('Error al traducir texto:', error);
    return originalText; // Fallback al texto original
  }
}

/**
 * Ejemplo de traducción de un incidente completo
 */
export async function translateIncidentExample() {
  try {
    // Configurar la API key
    translationService.setApiKey('tu_api_key_aqui');
    translationService.setRegion('global');

    // Incidente de ejemplo en español
    const incident: Incident = {
      id: '1',
      title: { es: 'Falta de material electoral', en: '' },
      description: { 
        es: 'No hay suficientes boletas en el recinto electoral. Los votantes están esperando.', 
        en: '' 
      },
      location: { es: 'La Paz, Centro', en: '' },
      status: 'new',
      timestamp: new Date().toISOString()
    };

    // Traducir el incidente completo
    const translatedIncident = await translationService.translateIncident(incident);
    
    console.log('Incidente original:', incident);
    console.log('Incidente traducido:', translatedIncident);
    
    return translatedIncident;
  } catch (error) {
    console.error('Error al traducir incidente:', error);
    return incident; // Fallback al incidente original
  }
}

/**
 * Ejemplo de traducción de múltiples textos
 */
export async function translateMultipleTextsExample() {
  try {
    // Configurar la API key
    translationService.setApiKey('tu_api_key_aqui');
    translationService.setRegion('global');

    const texts = [
      'Problema de conectividad',
      'Falta de material electoral',
      'Lento procesamiento de votos',
      'Error en el sistema de conteo'
    ];

    const translations = await Promise.all(
      texts.map(text => translationService.translateText(text, 'en', 'es'))
    );

    console.log('Textos originales:', texts);
    console.log('Traducciones:', translations);
    
    return translations;
  } catch (error) {
    console.error('Error al traducir múltiples textos:', error);
    return texts; // Fallback a los textos originales
  }
}

/**
 * Ejemplo de verificación de configuración
 */
export function checkTranslationService() {
  const isConfigured = translationService.isConfigured();
  console.log('Servicio de traducción configurado:', isConfigured);
  
  if (!isConfigured) {
    console.log('Para configurar el servicio:');
    console.log('1. Obtén una API key de Microsoft Translator');
    console.log('2. Usa el componente TranslationConfig');
    console.log('3. O configura la variable de entorno NEXT_PUBLIC_MICROSOFT_TRANSLATOR_KEY');
  }
  
  return isConfigured;
}

/**
 * Ejemplo de manejo de errores
 */
export async function handleTranslationErrors() {
  try {
    // Intentar traducir sin API key configurada
    const result = await translationService.translateText('Hola mundo', 'en', 'es');
    console.log('Resultado:', result);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error específico:', error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
}

// Ejemplo de uso en un componente React
export function useTranslationExample() {
  // Este es un ejemplo de cómo usar el hook en un componente
  /*
  import { useTranslationService } from '@/hooks/useTranslationService';
  
  function MyComponent() {
    const { translateText, isTranslating, isConfigured, error } = useTranslationService();
    
    const handleTranslate = async () => {
      if (isConfigured) {
        const translated = await translateText('Texto en español', 'en');
        console.log('Traducido:', translated);
      } else {
        console.log('Servicio no configurado');
      }
    };
    
    return (
      <div>
        <button onClick={handleTranslate} disabled={isTranslating}>
          {isTranslating ? 'Traduciendo...' : 'Traducir'}
        </button>
        {error && <p>Error: {error}</p>}
      </div>
    );
  }
  */
} 