# 🎯 Recommendations Service

Microservicio de recomendaciones de productos para la plataforma de e-commerce. Proporciona recomendaciones personalizadas basadas en el historial de usuarios.

## 📋 Descripción

El servicio de recomendaciones genera sugerencias de productos para cada usuario basándose en:

- **Viewed** - Productos que el usuario ha visto
- **Purchased** - Productos que el usuario ha comprado
- **Similar Category** - Productos de categorías similares
- **Trending** - Productos tendencia

## 🏗️ Arquitectura

Implementa **Arquitectura Hexagonal** (Ports & Adapters) con principios **SOLID**:

```
Domain/
  ├── entities/         # Modelos de negocio
  └── ports/            # Contratos de puertos

Application/
  └── use-cases/        # Lógica de aplicación

Infrastructure/
  ├── persistence/      # MongoDB repository
  ├── services/         # Clientes HTTP, JWT
  └── messaging/        # RabbitMQ (future)

Interfaces/
  └── http/             # Controllers, Guards
```

## 🚀 API Endpoints

### Obtener Recomendaciones

```bash
GET /api/recommendations?limit=10&skip=0

Headers:
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "user-id",
      "productId": "product-id",
      "basedOnProduct": "product-id",
      "score": 85,
      "reason": "viewed|purchased|similar_category|trending",
      "createdAt": "2024-01-01T00:00:00Z",
      "expiresAt": "2024-02-01T00:00:00Z"
    }
  ],
  "count": 10
}
```

### Crear Recomendación

```bash
POST /api/recommendations

Headers:
Authorization: Bearer <JWT_TOKEN>

Body:
{
  "productId": "product-id",
  "basedOnProduct": "product-id",
  "score": 85,
  "reason": "viewed"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

### Limpiar Recomendaciones Expiradas

```bash
POST /api/admin/recommendations/cleanup

Response:
{
  "success": true,
  "message": "Cleaned up 15 expired recommendations",
  "deleted": 15
}
```

### Health Check

```bash
GET /api/recommendations/health

Response:
{
  "status": "ok",
  "service": "recommendations-service",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🗄️ Base de Datos

- **MongoDB**: Almacenamiento de recomendaciones
- **TTL Index**: Auto-eliminación de recomendaciones después de 30 días
- **Índices**: userId para búsquedas rápidas

## 📝 Variables de Entorno

```env
PORT=3006
MONGO_URI=mongodb://mongo-recommendations:27017/recommendations
JWT_SECRET=your-secret-key
PRODUCTS_URL=http://products-service:3003
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
```

## 🔧 Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo con watch
npm run start:dev

# Build
npm run build

# Producción
npm run start:prod
```

## 🐳 Docker

```bash
# Build
docker build -t recommendations-service .

# Run
docker run -p 3006:3006 \
  -e PORT=3006 \
  -e MONGO_URI=mongodb://localhost:27017/recommendations \
  -e JWT_SECRET=secret \
  -e PRODUCTS_URL=http://products-service:3003 \
  recommendations-service
```

## 📦 Stack Tecnológico

- **NestJS** - Framework
- **MongoDB** - Base de datos
- **Mongoose** - ODM
- **JWT** - Autenticación
- **Axios** - Cliente HTTP
- **Docker** - Containerización

## 🎯 Características

✅ Recomendaciones personalizadas por usuario
✅ Múltiples razones de recomendación
✅ TTL automático de 30 días
✅ Autenticación JWT
✅ Health check
✅ Arquitectura hexagonal
✅ Inversión de dependencias con DI
✅ Integración con Products Service

## 🔮 Próximas Características

- [ ] Event sourcing con RabbitMQ
- [ ] Algoritmo de recomendación ML
- [ ] Caché Redis
- [ ] Métricas Prometheus
- [ ] Integración con órdenes para recomendaciones basadas en compras
