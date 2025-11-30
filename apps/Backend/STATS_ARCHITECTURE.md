# Sistema de Estadísticas - Arquitectura en Capas

Este módulo implementa un sistema de estadísticas para el Admin Panel siguiendo el patrón de arquitectura en capas (Repository → Service → Controller).

## 📁 Estructura

```
Backend/src/
├── repositories/          # Capa de acceso a datos
│   ├── UserRepository.ts
│   ├── SessionRepository.ts
│   └── AnswerRepository.ts
├── services/             # Capa de lógica de negocio
│   └── StatsService.ts
├── controllers/          # Capa de presentación
│   └── StatsController.ts
└── routers/             # Definición de rutas
    └── StatsRouter.ts
```

## 🏗️ Capas de la Arquitectura

### 1. **Repository Layer** (Acceso a Datos)

Responsable de las operaciones directas con la base de datos.

#### `UserRepository.ts`
- `getTotalCount()` - Obtiene el conteo total de usuarios
- `getActiveCount()` - Obtiene usuarios activos (no bloqueados)
- `getBannedCount()` - Obtiene usuarios bloqueados

#### `SessionRepository.ts`
- `getActiveSessionsCount()` - Sesiones activas en las últimas 24 horas
- `getTotalCount()` - Conteo total de sesiones

#### `AnswerRepository.ts`
- `getTotalCount()` - Conteo total de respuestas

**Principio:** Ningún repositorio debe contener lógica de negocio, solo queries a la base de datos.

### 2. **Service Layer** (Lógica de Negocio)

Orquesta múltiples repositorios y aplica lógica de negocio.

#### `StatsService.ts`
```typescript
class StatsService {
  // Obtiene todas las estadísticas del dashboard
  getDashboardStats(): Promise<DashboardStats>
  
  // Obtiene solo estadísticas de usuarios
  getUserStats(): Promise<UserStats>
  
  // Obtiene solo estadísticas de sesiones
  getSessionStats(): Promise<SessionStats>
}
```

**Características:**
- Ejecuta queries en paralelo usando `Promise.all()` para mejor rendimiento
- Combina datos de múltiples repositorios
- Calcula métricas derivadas (porcentajes, tendencias)
- No tiene conocimiento de HTTP (Request/Response)

### 3. **Controller Layer** (Presentación)

Maneja las peticiones HTTP y respuestas.

#### `StatsController.ts`
```typescript
class StatsController {
  // GET /api/stats/dashboard
  getDashboardStats(req, res)
  
  // GET /api/stats/users
  getUserStats(req, res)
  
  // GET /api/stats/sessions
  getSessionStats(req, res)
}
```

**Responsabilidades:**
- Maneja Request/Response
- Captura errores y devuelve respuestas apropiadas
- Valida permisos (a través de middleware RBAC)
- Formatea respuestas JSON

### 4. **Router Layer** (Rutas)

Define las rutas y sus permisos.

#### `StatsRouter.ts`
```typescript
GET /api/stats/dashboard   [ADMIN] - Estadísticas completas del dashboard
GET /api/stats/users       [ADMIN] - Solo estadísticas de usuarios
GET /api/stats/sessions    [ADMIN] - Solo estadísticas de sesiones
```

## 🔄 Flujo de Datos

```
Cliente (Admin Panel)
    ↓
Router (verifica permisos RBAC)
    ↓
Controller (maneja HTTP)
    ↓
Service (lógica de negocio)
    ↓
Repository (acceso a DB)
    ↓
Base de Datos (PostgreSQL)
```

## 📊 Endpoints Disponibles

### `GET /api/stats/dashboard`
Obtiene estadísticas completas para el dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": {
      "count": 1234,
      "percentageChange": 12.5,
      "trend": "up"
    },
    "activeSessions": {
      "count": 847,
      "percentageChange": 8.2,
      "trend": "up"
    },
    "totalResponses": {
      "count": 5678,
      "percentageChange": 15.3,
      "trend": "up"
    },
    "activeUsers": {
      "count": 1200,
      "percentageChange": 0,
      "trend": "stable"
    },
    "bannedUsers": {
      "count": 34,
      "percentageChange": 0,
      "trend": "stable"
    }
  }
}
```

### `GET /api/stats/users`
Solo estadísticas de usuarios.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 1234,
    "active": 1200,
    "banned": 34
  }
}
```

### `GET /api/stats/sessions`
Solo estadísticas de sesiones.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 5000,
    "activeLast24Hours": 847
  }
}
```

## 🔐 Seguridad

Todos los endpoints están protegidos con:
- **RBAC Middleware**: Solo usuarios con rol `ADMIN` pueden acceder
- **Authentication**: Requiere sesión activa válida
- **CORS**: Configurado para orígenes confiables