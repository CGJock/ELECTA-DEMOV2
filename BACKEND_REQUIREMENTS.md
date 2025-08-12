# BACKEND REQUIREMENTS - Panel de Administrador ELECTA

## 📋 Descripción General
Este documento especifica todos los endpoints, estructuras de datos y funcionalidades que necesita el backend para implementar el panel de administrador de ELECTA.

## 🔐 Autenticación y Autorización

### Endpoints de Autenticación
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
GET  /api/auth/me
```

### Middleware de Autorización
- Verificar token JWT en todas las rutas `/api/admin/*`
- Role-based access control (RBAC) para administradores
- Rate limiting: 100 requests por minuto por IP

## 🏗️ Estructura de Base de Datos

### Tabla: site_configuration
```sql
CREATE TABLE site_configuration (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  data_type VARCHAR(50) NOT NULL, -- 'boolean', 'string', 'json', 'number'
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER REFERENCES users(id)
);
```

### Tabla: election_phases
```sql
CREATE TABLE election_phases (
  id SERIAL PRIMARY KEY,
  phase_name VARCHAR(50) NOT NULL, -- 'before', 'during', 'after'
  phase_display_name VARCHAR(100) NOT NULL, -- 'Before Election', 'During Election', 'After Election'
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: phase_components
```sql
CREATE TABLE phase_components (
  id SERIAL PRIMARY KEY,
  phase_id INTEGER REFERENCES election_phases(id) ON DELETE CASCADE,
  component_name VARCHAR(100) NOT NULL, -- 'header', 'map', 'stats', 'incidents'
  component_display_name VARCHAR(200) NOT NULL, -- 'Header Navigation', 'Interactive Map'
  is_visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: elections
```sql
CREATE TABLE elections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  country VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  election_type VARCHAR(100) NOT NULL, -- 'presidential', 'parliamentary', 'local'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'completed', 'cancelled'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);
```

### Tabla: access_codes
```sql
CREATE TABLE access_codes (
  id SERIAL PRIMARY KEY,
  code_hash VARCHAR(255) NOT NULL, -- SHA-256 hash del código
  is_active BOOLEAN DEFAULT true,
  max_uses INTEGER DEFAULT -1, -- -1 = ilimitado
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);
```

### Tabla: access_logs
```sql
CREATE TABLE access_logs (
  id SERIAL PRIMARY KEY,
  access_code_id INTEGER REFERENCES access_codes(id),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  attempted_code VARCHAR(100), -- código sin hashear para auditoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: maintenance_logs
```sql
CREATE TABLE maintenance_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(50) NOT NULL, -- 'enabled', 'disabled'
  reason TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 API Endpoints

### 1. Control del Sitio

#### GET /api/admin/site/configuration
Obtener toda la configuración del sitio
```json
{
  "maintenance_mode": {
    "enabled": false,
    "message": "Sitio en mantenimiento",
    "last_updated": "2024-01-15T10:30:00Z"
  },
  "private_access": {
    "enabled": false,
    "access_code": "****",
    "terms_message": "Términos y condiciones..."
  }
}
```

#### POST /api/admin/site/maintenance
Activar/desactivar modo mantenimiento
```json
{
  "enabled": true,
  "message": "Sitio en mantenimiento programado",
  "reason": "Actualización de sistema"
}
```

#### POST /api/admin/site/access-control
Configurar control de acceso
```json
{
  "enabled": true,
  "access_code": "ELECTA2024",
  "terms_message": "Acceso restringido a personal autorizado"
}
```

#### GET /api/admin/site/access-logs
Obtener logs de acceso (con paginación)
```json
{
  "logs": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150
  }
}
```

### 2. Selector de Componentes por Fase

#### GET /api/admin/phases
Obtener todas las fases disponibles
```json
[
  {
    "id": 1,
    "phase_name": "before",
    "phase_display_name": "Before Election",
    "is_active": true,
    "components": [...]
  }
]
```

#### GET /api/admin/phases/{phase_id}/components
Obtener componentes de una fase específica
```json
{
  "phase": {...},
  "components": [
    {
      "id": 1,
      "component_name": "header",
      "component_display_name": "Header Navigation",
      "is_visible": true,
      "order_index": 0
    }
  ]
}
```

#### PUT /api/admin/phases/{phase_id}/components
Actualizar visibilidad de componentes
```json
{
  "components": [
    {"id": 1, "is_visible": true, "order_index": 0},
    {"id": 2, "is_visible": false, "order_index": 1}
  ]
}
```

#### POST /api/admin/phases/{phase_id}/apply
Aplicar configuración a la fase activa
```json
{
  "apply_to_site": true,
  "notify_users": false
}
```

### 3. Configuración de Elecciones

#### GET /api/admin/elections
Obtener todas las elecciones
```json
[
  {
    "id": 1,
    "name": "Elección Presidencial Bolivia 2025",
    "country": "Bolivia",
    "election_type": "presidential",
    "start_date": "2025-10-20",
    "end_date": "2025-10-20",
    "is_active": true,
    "status": "active"
  }
]
```

#### POST /api/admin/elections
Crear nueva elección
```json
{
  "name": "Elección Presidencial Bolivia 2025",
  "country": "Bolivia",
  "region": "Nacional",
  "election_type": "presidential",
  "start_date": "2025-10-20",
  "end_date": "2025-10-20"
}
```

#### PUT /api/admin/elections/{id}
Actualizar elección existente
```json
{
  "name": "Elección Presidencial Bolivia 2025 - Actualizada",
  "end_date": "2025-10-21"
}
```

#### DELETE /api/admin/elections/{id}
Eliminar elección (soft delete)
```json
{
  "reason": "Elección cancelada por el TSE"
}
```

#### POST /api/admin/elections/{id}/activate
Activar/desactivar elección
```json
{
  "activate": true,
  "reason": "Elección oficialmente iniciada"
}
```

## 🔒 Seguridad y Validaciones

### Validaciones de Entrada
- Sanitización de HTML en campos de texto
- Validación de fechas (fecha inicio < fecha fin)
- Validación de códigos de acceso (mínimo 6 caracteres, máximo 20)
- Rate limiting por IP y usuario

### Encriptación
- Códigos de acceso hasheados con bcrypt (salt rounds: 12)
- Tokens JWT con expiración de 24 horas
- Refresh tokens con expiración de 7 días

### Auditoría
- Log de todos los cambios de configuración
- Log de accesos exitosos y fallidos
- Log de activación/desactivación de elecciones
- Backup automático de configuraciones antes de cambios

## 📊 Funcionalidades Adicionales

### Notificaciones
- WebSocket para notificaciones en tiempo real
- Email notifications para cambios críticos
- Slack/Discord webhooks para alertas

### Backup y Recuperación
- Backup automático diario de configuraciones
- API para restaurar configuraciones anteriores
- Export/import de configuraciones en formato JSON

### Monitoreo
- Health checks de endpoints críticos
- Métricas de uso de códigos de acceso
- Alertas de intentos de acceso fallidos

## 🚀 Implementación Recomendada

### Tecnologías Sugeridas
- **Framework**: Express.js o Fastify
- **Base de Datos**: PostgreSQL con TypeORM/Prisma
- **Autenticación**: JWT + bcrypt
- **Validación**: Joi o Zod
- **Logging**: Winston + Morgan
- **Testing**: Jest + Supertest

### Estructura de Archivos
```
src/
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   └── siteController.js
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   └── rateLimiter.js
├── models/
│   ├── SiteConfiguration.js
│   ├── ElectionPhase.js
│   └── Election.js
├── services/
│   ├── adminService.js
│   ├── authService.js
│   └── notificationService.js
└── routes/
    ├── admin.js
    └── auth.js
```

## 📝 Notas de Implementación

1. **Migraciones**: Usar sistema de migraciones para cambios de BD
2. **Variables de Entorno**: Configurar todas las claves y URLs
3. **CORS**: Configurar para dominio del frontend
4. **Helmet**: Implementar headers de seguridad
5. **Compresión**: Habilitar gzip para respuestas
6. **Cache**: Implementar cache Redis para configuraciones frecuentes

## 🔄 Flujo de Trabajo

1. **Setup inicial**: Crear BD, tablas, índices
2. **Autenticación**: Implementar login/logout con JWT
3. **CRUD básico**: Endpoints para crear/leer/actualizar/eliminar
4. **Validaciones**: Implementar validaciones de entrada
5. **Middleware**: Auth, rate limiting, logging
6. **Testing**: Tests unitarios y de integración
7. **Documentación**: Swagger/OpenAPI specs
8. **Deployment**: Docker, CI/CD pipeline

---

**Fecha de Creación**: Enero 2025  
**Versión**: 1.0  
**Estado**: Pendiente de implementación  
**Prioridad**: Alta
