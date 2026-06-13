# API Documentation - Transport Routes, Categories & Stops

Documentação completa dos endpoints para integração com o frontend.

Base URL: `http://localhost:3000/v1`

## Authentication

Todos os endpoints requerem autenticação via JWT Bearer Token.

```
Authorization: Bearer {token}
```

---

## 1. Transport Route Categories (Categorias de Rotas)

### 1.1 Criar Categoria de Rota
**POST** `/route-categories`

**Permissões:** ADMIN

**Request Body:**
```json
{
  "name": "Rotas Urbanas",
  "description": "Rotas que circulam dentro da cidade",
  "is_active": true
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Rotas Urbanas",
  "description": "Rotas que circulam dentro da cidade",
  "is_active": true,
  "createdBy": {
    "id": 1,
    "name": "Admin User"
  },
  "updatedBy": {
    "id": 1,
    "name": "Admin User"
  },
  "createdAt": "2026-01-20T10:00:00.000Z",
  "updatedAt": "2026-01-20T10:00:00.000Z",
  "deletedAt": null
}
```

### 1.2 Listar Categorias de Rotas
**GET** `/route-categories?page=1&limit=10`

**Permissões:** ADMIN, OPERATOR

**Query Parameters:**
- `page` (opcional, default: 1)
- `limit` (opcional, default: 10, max: 50)

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": 1,
      "name": "Rotas Urbanas",
      "description": "Rotas que circulam dentro da cidade",
      "is_active": true,
      "createdBy": {
        "id": 1,
        "name": "Admin User"
      },
      "updatedBy": {
        "id": 1,
        "name": "Admin User"
      },
      "createdAt": "2026-01-20T10:00:00.000Z",
      "updatedAt": "2026-01-20T10:00:00.000Z",
      "deletedAt": null
    },
    {
      "id": 2,
      "name": "Rotas Interurbanas",
      "description": "Rotas entre cidades",
      "is_active": true,
      "createdBy": {
        "id": 1,
        "name": "Admin User"
      },
      "updatedBy": {
        "id": 1,
        "name": "Admin User"
      },
      "createdAt": "2026-01-20T11:00:00.000Z",
      "updatedAt": "2026-01-20T11:00:00.000Z",
      "deletedAt": null
    }
  ],
  "meta": {
    "totalItems": 2,
    "itemCount": 2,
    "itemsPerPage": 10,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

### 1.3 Obter Categoria por ID
**GET** `/route-categories/:id`

**Permissões:** ADMIN, OPERATOR

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Rotas Urbanas",
  "description": "Rotas que circulam dentro da cidade",
  "is_active": true,
  "routes": [
    {
      "id": 1,
      "name": "Linha 1 - Centro",
      "origin": "Terminal Central",
      "destination": "Bairro Norte"
    }
  ],
  "createdBy": {
    "id": 1,
    "name": "Admin User"
  },
  "updatedBy": {
    "id": 1,
    "name": "Admin User"
  },
  "createdAt": "2026-01-20T10:00:00.000Z",
  "updatedAt": "2026-01-20T10:00:00.000Z",
  "deletedAt": null
}
```

### 1.4 Atualizar Categoria
**PATCH** `/route-categories/:id`

**Permissões:** ADMIN

**Request Body:**
```json
{
  "name": "Rotas Urbanas Atualizadas",
  "description": "Nova descrição",
  "is_active": false
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Rotas Urbanas Atualizadas",
  "description": "Nova descrição",
  "is_active": false,
  "createdBy": {
    "id": 1,
    "name": "Admin User"
  },
  "updatedBy": {
    "id": 2,
    "name": "Editor User"
  },
  "createdAt": "2026-01-20T10:00:00.000Z",
  "updatedAt": "2026-01-20T15:00:00.000Z",
  "deletedAt": null
}
```

### 1.5 Deletar Categoria (Soft Delete)
**DELETE** `/route-categories/:id`

**Permissões:** ADMIN

**Response:** `200 OK`
```json
{}
```

### 1.6 Restaurar Categoria
**PATCH** `/route-categories/:id/restore`

**Permissões:** ADMIN

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Rotas Urbanas",
  "description": "Rotas que circulam dentro da cidade",
  "is_active": true,
  "createdBy": {
    "id": 1,
    "name": "Admin User"
  },
  "updatedBy": {
    "id": 1,
    "name": "Admin User"
  },
  "createdAt": "2026-01-20T10:00:00.000Z",
  "updatedAt": "2026-01-20T10:00:00.000Z",
  "deletedAt": null
}
```

---

## 2. Transport Routes (Rotas de Transporte)

### 2.1 Criar Rota
**POST** `/routes`

**Permissões:** ADMIN

**Request Body:**
```json
{
  "name": "Linha 1 - Centro",
  "origin": "Terminal Central",
  "destination": "Bairro Norte",
  "description": "Rota principal que conecta o centro ao norte da cidade",
  "categoryId": 1,
  "metadata": {
    "distancia_km": 15.5,
    "tempo_estimado": "45 minutos"
  },
  "is_active": true
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Linha 1 - Centro",
  "origin": "Terminal Central",
  "destination": "Bairro Norte",
  "description": "Rota principal que conecta o centro ao norte da cidade",
  "categoryId": 1,
  "metadata": {
    "distancia_km": 15.5,
    "tempo_estimado": "45 minutos"
  },
  "is_active": true,
  "createdBy": {
    "id": 1,
    "name": "Admin User"
  },
  "updatedBy": {
    "id": 1,
    "name": "Admin User"
  },
  "createdAt": "2026-01-20T10:00:00.000Z",
  "updatedAt": "2026-01-20T10:00:00.000Z",
  "deletedAt": null
}
```

### 2.2 Listar Rotas
**GET** `/routes?page=1&limit=10`

**Permissões:** ADMIN, OPERATOR

**Query Parameters:**
- `page` (opcional, default: 1)
- `limit` (opcional, default: 10, max: 50)

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": 1,
      "name": "Linha 1 - Centro",
      "origin": "Terminal Central",
      "destination": "Bairro Norte",
      "description": "Rota principal que conecta o centro ao norte da cidade",
      "categoryId": 1,
      "metadata": {
        "distancia_km": 15.5,
        "tempo_estimado": "45 minutos"
      },
      "is_active": true,
      "createdBy": {
        "id": 1,
        "name": "Admin User"
      },
      "updatedBy": {
        "id": 1,
        "name": "Admin User"
      },
      "createdAt": "2026-01-20T10:00:00.000Z",
      "updatedAt": "2026-01-20T10:00:00.000Z",
      "deletedAt": null
    }
  ],
  "meta": {
    "totalItems": 1,
    "itemCount": 1,
    "itemsPerPage": 10,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

### 2.3 Obter Rota por ID
**GET** `/routes/:id`

**Permissões:** ADMIN, OPERATOR

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Linha 1 - Centro",
  "origin": "Terminal Central",
  "destination": "Bairro Norte",
  "description": "Rota principal que conecta o centro ao norte da cidade",
  "categoryId": 1,
  "category": {
    "id": 1,
    "name": "Rotas Urbanas",
    "description": "Rotas que circulam dentro da cidade"
  },
  "metadata": {
    "distancia_km": 15.5,
    "tempo_estimado": "45 minutos"
  },
  "is_active": true,
  "routeTickets": [],
  "createdBy": {
    "id": 1,
    "name": "Admin User"
  },
  "updatedBy": {
    "id": 1,
    "name": "Admin User"
  },
  "createdAt": "2026-01-20T10:00:00.000Z",
  "updatedAt": "2026-01-20T10:00:00.000Z",
  "deletedAt": null
}
```

### 2.4 Atualizar Rota
**PATCH** `/routes/:id`

**Permissões:** ADMIN

**Request Body:**
```json
{
  "name": "Linha 1 - Centro (Atualizada)",
  "description": "Nova descrição da rota",
  "categoryId": 2,
  "is_active": false
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Linha 1 - Centro (Atualizada)",
  "origin": "Terminal Central",
  "destination": "Bairro Norte",
  "description": "Nova descrição da rota",
  "categoryId": 2,
  "metadata": {
    "distancia_km": 15.5,
    "tempo_estimado": "45 minutos"
  },
  "is_active": false,
  "createdBy": {
    "id": 1,
    "name": "Admin User"
  },
  "updatedBy": {
    "id": 2,
    "name": "Editor User"
  },
  "createdAt": "2026-01-20T10:00:00.000Z",
  "updatedAt": "2026-01-20T15:00:00.000Z",
  "deletedAt": null
}
```

### 2.5 Deletar Rota (Soft Delete)
**DELETE** `/routes/:id`

**Permissões:** ADMIN

**Response:** `200 OK`
```json
{}
```

### 2.6 Restaurar Rota
**PATCH** `/routes/:id/restore`

**Permissões:** ADMIN

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Linha 1 - Centro",
  "origin": "Terminal Central",
  "destination": "Bairro Norte",
  "description": "Rota principal que conecta o centro ao norte da cidade",
  "categoryId": 1,
  "metadata": {
    "distancia_km": 15.5,
    "tempo_estimado": "45 minutos"
  },
  "is_active": true,
  "createdBy": {
    "id": 1,
    "name": "Admin User"
  },
  "updatedBy": {
    "id": 1,
    "name": "Admin User"
  },
  "createdAt": "2026-01-20T10:00:00.000Z",
  "updatedAt": "2026-01-20T10:00:00.000Z",
  "deletedAt": null
}
```

---

## 3. Transport Route Stops (Paragens de Rotas)

### 3.1 Criar Paragem
**POST** `/route-stops`

**Permissões:** ADMIN

**Request Body:**
```json
{
  "name": "Praça Central",
  "description": "Paragem na praça principal da cidade",
  "order": 1,
  "routeId": 1,
  "is_active": true
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Praça Central",
  "description": "Paragem na praça principal da cidade",
  "order": 1,
  "routeId": 1,
  "is_active": true,
  "createdBy": {
    "id": 1,
    "name": "Admin User"
  },
  "updatedBy": {
    "id": 1,
    "name": "Admin User"
  },
  "createdAt": "2026-01-20T10:00:00.000Z",
  "updatedAt": "2026-01-20T10:00:00.000Z",
  "deletedAt": null
}
```

### 3.2 Listar Todas as Paragens
**GET** `/route-stops?page=1&limit=10`

**Permissões:** ADMIN, OPERATOR

**Query Parameters:**
- `page` (opcional, default: 1)
- `limit` (opcional, default: 10, max: 50)

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": 1,
      "name": "Praça Central",
      "description": "Paragem na praça principal da cidade",
      "order": 1,
      "routeId": 1,
      "route": {
        "id": 1,
        "name": "Linha 1 - Centro",
        "origin": "Terminal Central",
        "destination": "Bairro Norte"
      },
      "is_active": true,
      "createdBy": {
        "id": 1,
        "name": "Admin User"
      },
      "updatedBy": {
        "id": 1,
        "name": "Admin User"
      },
      "createdAt": "2026-01-20T10:00:00.000Z",
      "updatedAt": "2026-01-20T10:00:00.000Z",
      "deletedAt": null
    },
    {
      "id": 2,
      "name": "Avenida Principal",
      "description": "Paragem na avenida principal",
      "order": 2,
      "routeId": 1,
      "route": {
        "id": 1,
        "name": "Linha 1 - Centro",
        "origin": "Terminal Central",
        "destination": "Bairro Norte"
      },
      "is_active": true,
      "createdBy": {
        "id": 1,
        "name": "Admin User"
      },
      "updatedBy": {
        "id": 1,
        "name": "Admin User"
      },
      "createdAt": "2026-01-20T10:30:00.000Z",
      "updatedAt": "2026-01-20T10:30:00.000Z",
      "deletedAt": null
    }
  ],
  "meta": {
    "totalItems": 2,
    "itemCount": 2,
    "itemsPerPage": 10,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

### 3.3 Listar Paragens por Rota
**GET** `/route-stops/route/:routeId?page=1&limit=50`

**Permissões:** ADMIN, OPERATOR

**Query Parameters:**
- `page` (opcional, default: 1)
- `limit` (opcional, default: 50, max: 100)

**Response:** `200 OK`
```json
{
  "items": [
    {
      "id": 1,
      "name": "Praça Central",
      "description": "Paragem na praça principal da cidade",
      "order": 1,
      "routeId": 1,
      "route": {
        "id": 1,
        "name": "Linha 1 - Centro",
        "origin": "Terminal Central",
        "destination": "Bairro Norte"
      },
      "is_active": true,
      "createdBy": {
        "id": 1,
        "name": "Admin User"
      },
      "updatedBy": {
        "id": 1,
        "name": "Admin User"
      },
      "createdAt": "2026-01-20T10:00:00.000Z",
      "updatedAt": "2026-01-20T10:00:00.000Z",
      "deletedAt": null
    },
    {
      "id": 2,
      "name": "Avenida Principal",
      "description": "Paragem na avenida principal",
      "order": 2,
      "routeId": 1,
      "route": {
        "id": 1,
        "name": "Linha 1 - Centro",
        "origin": "Terminal Central",
        "destination": "Bairro Norte"
      },
      "is_active": true,
      "createdBy": {
        "id": 1,
        "name": "Admin User"
      },
      "updatedBy": {
        "id": 1,
        "name": "Admin User"
      },
      "createdAt": "2026-01-20T10:30:00.000Z",
      "updatedAt": "2026-01-20T10:30:00.000Z",
      "deletedAt": null
    },
    {
      "id": 3,
      "name": "Shopping Center",
      "description": "Paragem em frente ao shopping",
      "order": 3,
      "routeId": 1,
      "route": {
        "id": 1,
        "name": "Linha 1 - Centro",
        "origin": "Terminal Central",
        "destination": "Bairro Norte"
      },
      "is_active": true,
      "createdBy": {
        "id": 1,
        "name": "Admin User"
      },
      "updatedBy": {
        "id": 1,
        "name": "Admin User"
      },
      "createdAt": "2026-01-20T11:00:00.000Z",
      "updatedAt": "2026-01-20T11:00:00.000Z",
      "deletedAt": null
    }
  ],
  "meta": {
    "totalItems": 3,
    "itemCount": 3,
    "itemsPerPage": 50,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

### 3.4 Obter Paragem por ID
**GET** `/route-stops/:id`

**Permissões:** ADMIN, OPERATOR

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Praça Central",
  "description": "Paragem na praça principal da cidade",
  "order": 1,
  "routeId": 1,
  "route": {
    "id": 1,
    "name": "Linha 1 - Centro",
    "origin": "Terminal Central",
    "destination": "Bairro Norte",
    "categoryId": 1
  },
  "is_active": true,
  "createdBy": {
    "id": 1,
    "name": "Admin User"
  },
  "updatedBy": {
    "id": 1,
    "name": "Admin User"
  },
  "createdAt": "2026-01-20T10:00:00.000Z",
  "updatedAt": "2026-01-20T10:00:00.000Z",
  "deletedAt": null
}
```

### 3.5 Atualizar Paragem
**PATCH** `/route-stops/:id`

**Permissões:** ADMIN

**Request Body:**
```json
{
  "name": "Praça Central (Atualizada)",
  "description": "Nova descrição da paragem",
  "order": 2,
  "is_active": false
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Praça Central (Atualizada)",
  "description": "Nova descrição da paragem",
  "order": 2,
  "routeId": 1,
  "is_active": false,
  "createdBy": {
    "id": 1,
    "name": "Admin User"
  },
  "updatedBy": {
    "id": 2,
    "name": "Editor User"
  },
  "createdAt": "2026-01-20T10:00:00.000Z",
  "updatedAt": "2026-01-20T15:00:00.000Z",
  "deletedAt": null
}
```

### 3.6 Deletar Paragem (Soft Delete)
**DELETE** `/route-stops/:id`

**Permissões:** ADMIN

**Response:** `200 OK`
```json
{}
```

### 3.7 Restaurar Paragem
**PATCH** `/route-stops/:id/restore`

**Permissões:** ADMIN

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Praça Central",
  "description": "Paragem na praça principal da cidade",
  "order": 1,
  "routeId": 1,
  "is_active": true,
  "createdBy": {
    "id": 1,
    "name": "Admin User"
  },
  "updatedBy": {
    "id": 1,
    "name": "Admin User"
  },
  "createdAt": "2026-01-20T10:00:00.000Z",
  "updatedAt": "2026-01-20T10:00:00.000Z",
  "deletedAt": null
}
```

---

## Códigos de Status HTTP

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Token não fornecido ou inválido
- `403 Forbidden` - Sem permissão para acessar o recurso
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro no servidor

---

## Exemplo de Fluxo Completo

### 1. Criar uma categoria de rota
```bash
POST /v1/route-categories
{
  "name": "Rotas Urbanas",
  "description": "Rotas dentro da cidade"
}
```

### 2. Criar uma rota associada à categoria
```bash
POST /v1/routes
{
  "name": "Linha 1 - Centro",
  "origin": "Terminal Central",
  "destination": "Bairro Norte",
  "categoryId": 1
}
```

### 3. Criar paragens para a rota (em ordem)
```bash
POST /v1/route-stops
{
  "name": "Terminal Central",
  "description": "Ponto de partida",
  "order": 1,
  "routeId": 1
}

POST /v1/route-stops
{
  "name": "Praça Central",
  "description": "Centro da cidade",
  "order": 2,
  "routeId": 1
}

POST /v1/route-stops
{
  "name": "Shopping Center",
  "description": "Shopping da cidade",
  "order": 3,
  "routeId": 1
}

POST /v1/route-stops
{
  "name": "Bairro Norte",
  "description": "Destino final",
  "order": 4,
  "routeId": 1
}
```

### 4. Listar todas as paragens da rota
```bash
GET /v1/route-stops/route/1
```

---

## Notas Importantes

1. **Soft Delete**: Todos os recursos usam soft delete, ou seja, não são removidos permanentemente do banco de dados. Use o endpoint de restore para recuperá-los.

2. **Paginação**: Todos os endpoints de listagem suportam paginação através dos parâmetros `page` e `limit`.

3. **Relações**: 
   - Uma categoria pode ter várias rotas
   - Uma rota pertence a uma categoria (opcional)
   - Uma rota pode ter várias paragens
   - Uma paragem pertence a uma rota específica

4. **Campo Order**: O campo `order` nas paragens define a sequência das paragens na rota. Valores menores aparecem primeiro.

5. **Auditoria**: Todos os recursos incluem informações de auditoria (`createdBy`, `updatedBy`, `createdAt`, `updatedAt`, `deletedAt`).
