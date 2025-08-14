# Servicios de Datos - Electa Frontend

Este directorio contiene los servicios para consumir datos del backend de Electa.

## 📁 Estructura

```
services/
├── apiService.ts          # Servicio para endpoints REST
├── socketService.ts       # Servicio para WebSockets
├── dataService.ts         # Servicio unificado
├── useDataService.ts      # Hooks personalizados
└── index.ts              # Exportaciones principales
```

## 🚀 Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en `packages/front-end/react/` con:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_API_KEY=9700caf11b5140a62c7cad1eda831d3ed9026f03eec4d0459f89357d6c3e21c3
```

### 2. Instalación de Dependencias

```bash
cd packages/front-end/react
pnpm install socket.io-client
```

## 📊 Servicios Disponibles

### API Service (`apiService.ts`)

**Endpoints REST disponibles:**

- `getDepartments()` - Obtener todos los departamentos
- `getDepartmentByCode(code)` - Obtener departamento específico
- `updateVotes(voteData)` - Actualizar votos

### Socket Service (`socketService.ts`)

**Eventos WebSocket disponibles:**

- `get-vote-breakdown` → `vote-breakdown`
- `get-global-summary` → `global-vote-summary`
- `get-location-summary` → `location-breakdown-summary`
- `get-candidate-proposals` → `candidate-proposals`
- `get-parties-candidates` → `parties-candidates`

### Data Service (`dataService.ts`)

**Servicio unificado** que combina API REST y WebSockets.

## 🎣 Hooks Personalizados

### useDepartments()
```typescript
const { departments, loading, error, refetch } = useDepartments();
```

### useVoteBreakdown()
```typescript
const { voteBreakdown, loading, error } = useVoteBreakdown();
```

### useGlobalSummary()
```typescript
const { globalSummary, loading, error } = useGlobalSummary();
```

### useLocationSummary(locationId)
```typescript
const { locationSummary, loading, error } = useLocationSummary('LP');
```

### useCandidateProposals(candidateId, language)
```typescript
const { proposals, loading, error } = useCandidateProposals('1', 'es');
```

### usePartiesCandidates()
```typescript
const { partiesCandidates, loading, error } = usePartiesCandidates();
```

### useDepartmentCompleteData(departmentCode)
```typescript
const { departmentData, loading, error, refetch } = useDepartmentCompleteData('LP');
```

### useSocketStatus()
```typescript
const { isConnected, socketId } = useSocketStatus();
```

## 💡 Ejemplo de Uso

```typescript
import { useDepartments, useGlobalSummary } from '@/services';

function MyComponent() {
  const { departments, loading: deptLoading } = useDepartments();
  const { globalSummary, loading: summaryLoading } = useGlobalSummary();

  if (deptLoading || summaryLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Departamentos ({departments.length})</h2>
      <ul>
        {departments.map(dept => (
          <li key={dept.code}>{dept.name}</li>
        ))}
      </ul>
      
      <h2>Resumen Global</h2>
      <p>Total de votos: {globalSummary?.totalVotes}</p>
    </div>
  );
}
```

## 🔧 Uso Directo de Servicios

```typescript
import { dataService } from '@/services';

// Obtener departamentos
const departments = await dataService.getDepartments();

// Escuchar cambios en tiempo real
const cleanup = dataService.getGlobalSummary((data) => {
  console.log('Nuevos datos:', data);
});

// Limpiar listener
cleanup();
```

## ⚠️ Notas Importantes

1. **No modificar componentes existentes**: Los componentes `GlobalCounter`, `votechart`, `VotingStats` y `Map` no deben ser modificados.

2. **WebSocket automático**: Los WebSockets se conectan automáticamente y manejan reconexiones.

3. **Cleanup automático**: Los hooks limpian automáticamente los listeners al desmontar componentes.

4. **Manejo de errores**: Todos los servicios incluyen manejo de errores y estados de carga.

## 🐛 Troubleshooting

### WebSocket no conecta
- Verificar que el backend esté corriendo en `http://localhost:5000`
- Verificar variables de entorno
- Revisar consola del navegador para errores

### API no responde
- Verificar que el backend esté corriendo
- Verificar URL en `NEXT_PUBLIC_API_URL`
- Verificar API key en `NEXT_PUBLIC_API_KEY` 