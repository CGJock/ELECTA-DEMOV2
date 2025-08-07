# Configuración de Traducción Automática - Microsoft Translator

## Descripción

Este sistema integra Microsoft Translator API para traducir automáticamente los incidentes reportados en tiempo real durante las elecciones. Los incidentes se pueden reportar en español y se traducen automáticamente al inglés.

## Características

- ✅ Traducción automática en tiempo real
- ✅ Soporte para español → inglés
- ✅ Configuración fácil desde la interfaz
- ✅ 2 millones de caracteres gratis por mes
- ✅ Traducción de títulos, descripciones y ubicaciones
- ✅ Fallback al texto original si falla la traducción

## Configuración

### 1. Obtener API Key de Microsoft Translator

1. Ve a [Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/translator/)
2. Crea una cuenta gratuita de Azure (si no tienes una)
3. Crea un recurso de "Translator" en Azure Portal
4. Copia la API Key desde la sección "Keys and Endpoint"

### 2. Configurar en la Aplicación

#### Opción A: Desde la Interfaz (Recomendado)

1. Abre la aplicación
2. Haz clic en el botón de incidentes (🚨)
3. En el panel de incidentes, haz clic en el ícono de configuración (⚙️)
4. Ingresa tu API Key de Microsoft Translator
5. Selecciona tu región de Azure
6. Haz clic en "Probar Conexión" para verificar
7. Haz clic en "Guardar"

#### Opción B: Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_MICROSOFT_TRANSLATOR_KEY=tu_api_key_aqui
```

### 3. Verificar Configuración

- El ícono de idiomas (🌐) aparecerá en el panel de incidentes cuando esté configurado
- Los campos de incidentes mostrarán placeholders indicando traducción automática
- Se mostrará un indicador "Traduciendo..." durante la traducción

## Uso

### Reportar Incidentes

1. **Sin traducción automática:**
   - Los incidentes se guardan solo en el idioma ingresado
   - No se requiere configuración adicional

2. **Con traducción automática:**
   - Escribe el incidente en español
   - La traducción se realiza automáticamente al inglés
   - Se guardan ambas versiones (español e inglés)

### Detección Automática

El sistema detecta automáticamente texto en español basándose en:
- Palabras comunes en español (el, la, los, las, de, del, en, con, por, para, etc.)
- Longitud mínima del texto (10 caracteres para títulos, 20 para descripciones)

### Traducción Manual

Si necesitas traducir manualmente:
1. Escribe el texto en español
2. Espera a que se detecte y traduzca automáticamente
3. O usa el servicio de traducción programáticamente:

```typescript
import { translationService } from '@/services/translationService';

// Traducir texto
const translatedText = await translationService.translateText('Hola mundo', 'en', 'es');

// Traducir incidente completo
const translatedIncident = await translationService.translateIncident(incident);
```

## Estructura de Datos

Los incidentes traducidos tienen esta estructura:

```typescript
interface Incident {
  id: string;
  title: {
    es: string;  // Título en español
    en: string;  // Título traducido al inglés
  };
  description: {
    es: string;  // Descripción en español
    en: string;  // Descripción traducida al inglés
  };
  location: {
    es: string;  // Ubicación en español
    en: string;  // Ubicación traducida al inglés
  };
  status: 'stuck' | 'new' | 'resolved';
  timestamp: string;
}
```

## Límites y Costos

### Plan Gratuito
- **2 millones de caracteres por mes**
- **Suficiente para ~10,000 incidentes promedio**
- **Sin tarjeta de crédito requerida**

### Planes de Pago
- **$10 por millón de caracteres adicionales**
- **Escalable según necesidades**

## Solución de Problemas

### Error: "API key no configurada"
- Verifica que hayas ingresado la API key correctamente
- Asegúrate de que la key esté activa en Azure Portal

### Error: "Error de traducción"
- Verifica tu conexión a internet
- Confirma que la API key sea válida
- Revisa los límites de uso en Azure Portal

### Traducción no funciona
- Verifica que el texto esté en español
- Asegúrate de que el texto tenga la longitud mínima
- Revisa la consola del navegador para errores

### Problemas de Rendimiento
- Las traducciones se realizan en segundo plano
- Los textos largos pueden tomar más tiempo
- Considera implementar caché para textos repetidos

## Desarrollo

### Estructura de Archivos

```
src/
├── services/
│   └── translationService.ts     # Servicio principal de traducción
├── hooks/
│   └── useTranslationService.ts  # Hook personalizado
├── components/
│   ├── TranslationConfig.tsx     # Modal de configuración
│   └── IncidentForm.tsx          # Formulario con traducción
```

### Agregar Nuevos Idiomas

Para agregar soporte para otros idiomas:

1. Modifica `translationService.ts`:
```typescript
// Agregar nuevo idioma
async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string> {
  // Agregar validación para el nuevo idioma
  if (!['en', 'es', 'fr', 'de'].includes(targetLanguage)) {
    throw new Error('Idioma no soportado');
  }
  // ... resto del código
}
```

2. Actualiza los tipos en `election.ts`:
```typescript
interface Incident {
  title: {
    es: string;
    en: string;
    fr?: string;  // Nuevo idioma
  };
  // ...
}
```

## Seguridad

- Las API keys se almacenan localmente en el navegador
- No se envían al servidor
- Se recomienda usar variables de entorno en producción
- Las traducciones se realizan directamente con Microsoft

## Soporte

Para problemas técnicos:
1. Revisa la documentación de [Microsoft Translator](https://learn.microsoft.com/en-us/azure/ai-services/translator/)
2. Verifica los logs en la consola del navegador
3. Contacta al equipo de desarrollo

## Changelog

### v1.0.0
- ✅ Integración inicial con Microsoft Translator
- ✅ Traducción automática de incidentes
- ✅ Interfaz de configuración
- ✅ Detección automática de idioma
- ✅ Fallback al texto original
- ✅ Documentación completa 