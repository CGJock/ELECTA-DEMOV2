# ELECTA - Sistema de Monitoreo Electoral

Este es un proyecto [Next.js](https://nextjs.org) para el monitoreo de elecciones en tiempo real, con soporte para reportes de incidentes y traducción automática.

## Características Principales

- 🗳️ **Monitoreo de Elecciones en Tiem Real**
- 🚨 **Sistema de Reportes de Incidentes**
- 🌐 **Traducción Automática** (Español ↔ Inglés)
- 📊 **Estadísticas y Gráficos**
- 🗺️ **Mapa Interactivo**
- 📱 **Diseño Responsivo**

## Funcionalidades de Traducción

### Traducción Automática de Incidentes

El sistema incluye integración con **Microsoft Translator API** para traducir automáticamente los incidentes reportados:

- ✅ Traducción automática en tiempo real
- ✅ Soporte para español → inglés
- ✅ 2 millones de caracteres gratis por mes
- ✅ Configuración fácil desde la interfaz
- ✅ Fallback al texto original si falla la traducción

#### Configuración Rápida

1. **Obtener API Key:**
   - Ve a [Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/translator/)
   - Crea una cuenta gratuita y un recurso "Translator"
   - Copia la API Key

2. **Configurar en la App:**
   - Abre la aplicación
   - Haz clic en el botón de incidentes (🚨)
   - Haz clic en el ícono de configuración (⚙️)
   - Ingresa tu API Key y región
   - Haz clic en "Probar Conexión" y "Guardar"

Para más detalles, consulta [TRANSLATION_SETUP.md](./TRANSLATION_SETUP.md)

## Getting Started

### Prerrequisitos

- Node.js 18+ 
- pnpm (recomendado) o npm

### Instalación

1. **Clonar el repositorio:**
```bash
git clone <repository-url>
cd ELECTA-DEMOV2
```

2. **Instalar dependencias:**
```bash
# Instalar dependencias del workspace
pnpm install

# O instalar solo las dependencias del frontend
cd packages/front-end/react
pnpm install
```

3. **Configurar variables de entorno (opcional):**
```bash
# Crear archivo .env.local
cp .env.example .env.local

# Agregar tu API key de Microsoft Translator (opcional)
NEXT_PUBLIC_MICROSOFT_TRANSLATOR_KEY=tu_api_key_aqui
```

4. **Ejecutar en desarrollo:**
```bash
# Desde la raíz del proyecto
pnpm dev

# O desde el directorio del frontend
cd packages/front-end/react
pnpm dev
```

5. **Abrir en el navegador:**
   - Ve a [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

```
packages/
├── front-end/
│   └── react/
│       ├── src/
│       │   ├── components/           # Componentes React
│       │   │   ├── IncidentForm.tsx  # Formulario de incidentes
│       │   │   ├── IncidentsFlag.tsx # Panel de incidentes
│       │   │   └── TranslationConfig.tsx # Configuración de traducción
│       │   ├── services/
│       │   │   └── translationService.ts # Servicio de traducción
│       │   ├── hooks/
│       │   │   └── useTranslationService.ts # Hook de traducción
│       │   └── types/
│       │       └── election.ts       # Tipos TypeScript
│       ├── TRANSLATION_SETUP.md      # Documentación de traducción
│       └── README.md                 # Este archivo
└── back-end/
    └── Express/                      # API Backend
```

## Uso

### Reportar Incidentes

1. **Sin traducción automática:**
   - Los incidentes se guardan solo en el idioma ingresado
   - No se requiere configuración adicional

2. **Con traducción automática:**
   - Escribe el incidente en español
   - La traducción se realiza automáticamente al inglés
   - Se guardan ambas versiones (español e inglés)

### Configuración de Traducción

- **Desde la interfaz:** Usa el modal de configuración en el panel de incidentes
- **Variables de entorno:** Configura `NEXT_PUBLIC_MICROSOFT_TRANSLATOR_KEY`
- **localStorage:** La configuración se guarda automáticamente en el navegador

## Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Ejecutar en modo desarrollo
pnpm build            # Construir para producción
pnpm start            # Ejecutar en modo producción
pnpm lint             # Ejecutar linter
pnpm type-check       # Verificar tipos TypeScript
```

### Agregar Nuevas Funcionalidades

1. **Nuevos componentes:** Crear en `src/components/`
2. **Nuevos servicios:** Crear en `src/services/`
3. **Nuevos hooks:** Crear en `src/hooks/`
4. **Nuevos tipos:** Agregar en `src/types/`

## Tecnologías Utilizadas

- **Frontend:** Next.js 14, React 18, TypeScript
- **Estilos:** Tailwind CSS
- **Traducción:** Microsoft Translator API
- **Estado:** React Hooks
- **Formularios:** React Hook Form
- **Iconos:** Lucide React

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para problemas técnicos:
1. Revisa la documentación en `TRANSLATION_SETUP.md`
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
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
