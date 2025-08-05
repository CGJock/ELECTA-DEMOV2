# Configuración del Formulario de Contacto

## Pasos para configurar el formulario de contacto con Resend

### 1. Obtener API Key de Resend

1. Ve a [https://resend.com](https://resend.com)
2. Crea una cuenta o inicia sesión
3. Ve a la sección "API Keys"
4. Crea una nueva API key
5. Copia la API key (empieza con `re_`)

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la carpeta `packages/front-end/react/` con el siguiente contenido:

```bash
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email de contacto donde recibirás los mensajes del formulario
CONTACT_EMAIL=tu-email@ejemplo.com
```

**Importante:**
- Reemplaza `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` con tu API key real de Resend
- Reemplaza `tu-email@ejemplo.com` con el email donde quieres recibir los mensajes de contacto

### 3. Verificar Dominio en Resend (Opcional)

Para usar un dominio personalizado para enviar emails:

1. Ve a la sección "Domains" en Resend
2. Agrega tu dominio
3. Configura los registros DNS según las instrucciones
4. Una vez verificado, puedes cambiar el `from` en `packages/front-end/react/src/app/api/email/contact/route.ts`

### 4. Probar el Formulario

1. Inicia el servidor de desarrollo: `pnpm dev`
2. Ve a la página "About Us"
3. Llena el formulario de contacto
4. Verifica que recibas el email en la dirección configurada

### 5. Personalización

Puedes personalizar:

- **Template del email**: Edita el HTML en `packages/front-end/react/src/app/api/email/contact/route.ts`
- **Validaciones**: Modifica las validaciones en el componente `AboutUs.tsx`
- **Mensajes**: Actualiza los mensajes en los archivos de traducción

### 6. Troubleshooting

**Error: "Invalid API key"**
- Verifica que la API key esté correctamente configurada en `.env.local`
- Asegúrate de que la API key sea válida y esté activa

**Error: "Email not sent"**
- Verifica que el email de destino (`CONTACT_EMAIL`) esté correctamente configurado
- Revisa los logs del servidor para más detalles

**Error: "Rate limit exceeded"**
- Resend tiene límites de rate limiting. Considera implementar rate limiting en tu aplicación

### 7. Seguridad

- Nunca commits el archivo `.env.local` al repositorio
- Usa variables de entorno diferentes para desarrollo y producción
- Considera implementar rate limiting para prevenir spam 