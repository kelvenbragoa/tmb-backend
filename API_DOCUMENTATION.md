# 📚 Documentação da API - Sistema Transportadora

## 🔐 Autenticação

Todos os endpoints (exceto login) requerem autenticação via Bearer Token JWT.

```bash
Authorization: Bearer <jwt_token>
```

### Níveis de Acesso:
- **ADMIN**: Acesso total ao sistema
- **OPERATOR**: Operações de venda e consulta

---

## 🔑 Auth Module

### POST `/auth/login`
Autentica usuário e retorna JWT token.

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN",
    "is_active": true
  }
}
```

**Errors:**
- `401`: Credenciais inválidas
- `400`: Dados inválidos

---

## 👤 User Module

### GET `/users`
Lista todos os usuários (paginado) - **ADMIN only**

**Query Params:**
- `page`: número da página (default: 1)
- `limit`: itens por página (default: 10, max: 50)

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "ADMIN",
      "is_active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
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

### POST `/users`
Cria novo usuário - **ADMIN only**

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "123456",
  "role": "OPERATOR"
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "OPERATOR",
  "is_active": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET `/users/:id`
Busca usuário por ID - **ADMIN only**

**Response (200):**
```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "ADMIN",
  "is_active": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PATCH `/users/:id`
Atualiza usuário - **ADMIN only**

**Body:**
```json
{
  "name": "João Silva Santos",
  "is_active": false
}
```

**Response (200):** Mesmo formato do GET

### DELETE `/users/:id`
Remove usuário - **ADMIN only**

**Response (200):** Vazio

---

## 👥 Customer Module

### GET `/costumers`
Lista todos os clientes (paginado)

**Query Params:**
- `page`: número da página (default: 1)
- `limit`: itens por página (default: 10, max: 50)

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Maria Silva",
      "email": "maria@example.com",
      "mobile": "+258 84 123 4567",
      "nuit": "123456789",
      "customer_number": "CUST000001",
      "ticket_type_id": 1,
      "ticketType": {
        "id": 1,
        "name": "Adulto",
        "code": "ADL"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
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

### POST `/costumers`
Cria novo cliente

**Body:**
```json
{
  "name": "João Santos",
  "email": "joao.santos@example.com",
  "mobile": "+258 84 987 6543",
  "nuit": "987654321",
  "ticket_type_id": 2
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "João Santos",
  "email": "joao.santos@example.com",
  "mobile": "+258 84 987 6543",
  "nuit": "987654321",
  "customer_number": "CUST000002",
  "ticket_type_id": 2,
  "ticketType": {
    "id": 2,
    "name": "Estudante",
    "code": "EST"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET `/costumers/by-number/:customerNumber`
Busca cliente por número do cliente

**Response (200):**
```json
{
  "id": 1,
  "name": "Maria Silva",
  "email": "maria@example.com",
  "mobile": "+258 84 123 4567",
  "nuit": "123456789",
  "customer_number": "CUST000001",
  "ticket_type_id": 1,
  "ticketType": {
    "id": 1,
    "name": "Adulto",
    "code": "ADL"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- `404`: Cliente não encontrado

### GET `/costumers/:id`
Busca cliente por ID

**Response (200):** Mesmo formato do endpoint anterior

### PATCH `/costumers/:id`
Atualiza dados do cliente

**Body:**
```json
{
  "name": "Maria Silva Santos",
  "email": "maria.santos@example.com",
  "mobile": "+258 84 111 2222"
}
```

**Response (200):** Dados atualizados

### DELETE `/costumers/:id`
Remove cliente

**Response (200):**
```json
{
  "message": "Costumer deleted successfully"
}
```

---

## 🎫 Ticket Type Module

### GET `/ticket-types`
Lista todos os tipos de bilhete (paginado)

**Query Params:**
- `page`: número da página (default: 1)
- `limit`: itens por página (default: 10, max: 50)

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Adulto",
      "description": "Bilhete para adultos",
      "code": "ADL",
      "is_active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "createdBy": {
        "id": 1,
        "name": "Admin User"
      }
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

### POST `/ticket-types`
Cria novo tipo de bilhete - **ADMIN only**

**Body:**
```json
{
  "name": "Estudante",
  "description": "Bilhete para estudantes",
  "code": "EST"
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "Estudante",
  "description": "Bilhete para estudantes",
  "code": "EST",
  "is_active": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "createdBy": {
    "id": 1,
    "name": "Admin User"
  }
}
```

### GET `/ticket-types/:id`
Busca tipo de bilhete por ID

**Response (200):** Mesmo formato do item individual

### PATCH `/ticket-types/:id`
Atualiza tipo de bilhete - **ADMIN only**

**Body:**
```json
{
  "name": "Estudante Universitário",
  "is_active": false
}
```

### DELETE `/ticket-types/:id`
Remove tipo de bilhete - **ADMIN only**

---

## 🛣️ Transport Route Module

### GET `/routes`
Lista todas as rotas (paginado)

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Maputo - Matola",
      "origin": "Maputo",
      "destination": "Matola",
      "description": "Rota principal",
      "is_active": true,
      "metadata": {
        "distance": "25km",
        "duration": "45min"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
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

### POST `/routes`
Cria nova rota - **ADMIN only**

**Body:**
```json
{
  "name": "Maputo - Beira",
  "origin": "Maputo",
  "destination": "Beira",
  "description": "Rota intercidades",
  "metadata": {
    "distance": "530km",
    "duration": "8h"
  }
}
```

### GET `/routes/:id`
Busca rota por ID

### PATCH `/routes/:id`
Atualiza rota - **ADMIN only**

### DELETE `/routes/:id`
Remove rota - **ADMIN only**

### GET `/routes/:id/tickets`
Lista bilhetes disponíveis para uma rota

**Response (200):**
```json
[
  {
    "id": 1,
    "route_id": 1,
    "ticket_type_id": 1,
    "price": "50.00",
    "is_active": true,
    "route": {
      "id": 1,
      "name": "Maputo - Matola"
    },
    "ticketType": {
      "id": 1,
      "name": "Adulto",
      "code": "ADL"
    }
  }
]
```

### GET `/routes/:id/vehicles`
Lista veículos disponíveis para uma rota

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Ônibus 001",
      "plate": "ABC-1234",
      "model": "Mercedes-Benz",
      "brand": "Mercedes",
      "capacity": 50,
      "is_active": true
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

---

## 🎟️ Route Ticket Module

### GET `/route-tickets`
Lista todos os bilhetes de rota (paginado)

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "route_id": 1,
      "ticket_type_id": 1,
      "price": "50.00",
      "is_active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "route": {
        "id": 1,
        "name": "Maputo - Matola",
        "origin": "Maputo",
        "destination": "Matola"
      },
      "ticketType": {
        "id": 1,
        "name": "Adulto",
        "code": "ADL"
      }
    }
  ]
}
```

### POST `/route-tickets`
Cria novo bilhete de rota - **ADMIN only**

**Body:**
```json
{
  "route_id": 1,
  "ticket_type_id": 1,
  "price": 75.50
}
```

### GET `/route-tickets/:id`
Busca bilhete de rota por ID

### PATCH `/route-tickets/:id`
Atualiza bilhete de rota - **ADMIN only**

**Body:**
```json
{
  "price": 80.00,
  "is_active": false
}
```

### DELETE `/route-tickets/:id`
Remove bilhete de rota - **ADMIN only**

---

## 🚗 Vehicle Module

### GET `/vehicles`
Lista todos os veículos (paginado)

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Ônibus 001",
      "plate": "ABC-1234",
      "model": "Sprinter",
      "brand": "Mercedes-Benz",
      "capacity": 20,
      "description": "Van para rotas curtas",
      "is_active": true,
      "routes": [
        {
          "id": 1,
          "name": "Maputo - Matola",
          "origin": "Maputo",
          "destination": "Matola"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
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

### GET `/vehicles/active`
Lista apenas veículos ativos (paginado)

### GET `/vehicles/route/:routeId`
Lista veículos disponíveis para uma rota específica

### POST `/vehicles`
Cria novo veículo - **ADMIN only**

**Body:**
```json
{
  "name": "Ônibus 002",
  "plate": "XYZ-5678",
  "model": "Sprinter",
  "brand": "Mercedes-Benz",
  "capacity": 25,
  "description": "Van nova",
  "route_ids": [1, 2]
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "Ônibus 002",
  "plate": "XYZ-5678",
  "model": "Sprinter",
  "brand": "Mercedes-Benz",
  "capacity": 25,
  "description": "Van nova",
  "is_active": true,
  "routes": [
    {
      "id": 1,
      "name": "Maputo - Matola"
    },
    {
      "id": 2,
      "name": "Maputo - Beira"
    }
  ]
}
```

### GET `/vehicles/:id`
Busca veículo por ID

### PATCH `/vehicles/:id`
Atualiza veículo - **ADMIN only**

**Body:**
```json
{
  "name": "Ônibus 002 - Renovado",
  "capacity": 30,
  "is_active": false,
  "route_ids": [1]
}
```

### DELETE `/vehicles/:id`
Remove veículo - **ADMIN only**

**Errors:**
- `400`: Não é possível excluir veículo com sessões ativas

### POST `/vehicles/:id/routes/:routeId`
Associa veículo a uma rota - **ADMIN only**

### DELETE `/vehicles/:id/routes/:routeId`
Remove associação veículo-rota - **ADMIN only**

---

## 💰 Session Module

### GET `/sessions`
Lista todas as sessões (paginado)

**Query Params:**
- `status`: filtro por status (`open`, `closed`)

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "operator_id": 2,
      "route_id": 1,
      "vehicle_id": 1,
      "status": "open",
      "opened_at": "2024-01-01T08:00:00.000Z",
      "closed_at": null,
      "total_sales": "250.00",
      "total_tickets_sold": 5,
      "notes": "Sessão matinal",
      "operator": {
        "id": 2,
        "name": "João Silva",
        "email": "joao@example.com"
      },
      "route": {
        "id": 1,
        "name": "Maputo - Matola",
        "origin": "Maputo",
        "destination": "Matola"
      },
      "vehicle": {
        "id": 1,
        "name": "Ônibus 001",
        "plate": "ABC-1234"
      }
    }
  ]
}
```

### GET `/sessions/my`
Lista sessões do operador logado

### POST `/sessions`
Abre nova sessão

**Body:**
```json
{
  "route_id": 1,
  "vehicle_id": 1,
  "notes": "Sessão vespertina"
}
```

**Response (201):**
```json
{
  "id": 2,
  "operator_id": 2,
  "route_id": 1,
  "vehicle_id": 1,
  "status": "open",
  "opened_at": "2024-01-01T14:00:00.000Z",
  "closed_at": null,
  "total_sales": "0.00",
  "total_tickets_sold": 0,
  "notes": "Sessão vespertina"
}
```

**Validações:**
- Operador não pode ter mais de uma sessão aberta
- Veículo deve estar ativo
- Veículo deve estar associado à rota selecionada

### GET `/sessions/:id`
Busca sessão por ID

### PATCH `/sessions/:id/close`
Fecha sessão

**Body:**
```json
{
  "notes": "Sessão encerrada normalmente"
}
```

**Response (200):**
```json
{
  "id": 1,
  "status": "closed",
  "closed_at": "2024-01-01T18:00:00.000Z",
  "total_sales": "450.00",
  "total_tickets_sold": 9,
  "notes": "Sessão encerrada normalmente"
}
```

---

## 🎫 Ticket Sale Module

### GET `/ticket-sales`
Lista todas as vendas (paginado) - **ADMIN only**

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "session_id": 1,
      "operator_id": 2,
      "route_id": 1,
      "route_ticket_id": 1,
      "vehicle_id": 1,
      "price_at_sale": "50.00",
      "quantity": 2,
      "total": "100.00",
      "sold_at": "2024-01-01T10:30:00.000Z",
      "notes": "Venda normal",
      "operator": {
        "id": 2,
        "name": "João Silva"
      },
      "route": {
        "id": 1,
        "name": "Maputo - Matola"
      },
      "routeTicket": {
        "id": 1,
        "price": "50.00",
        "ticketType": {
          "id": 1,
          "name": "Adulto",
          "code": "ADL"
        }
      },
      "vehicle": {
        "id": 1,
        "name": "Ônibus 001",
        "plate": "ABC-1234"
      }
    }
  ]
}
```

### GET `/sessions/:sessionId/sales`
Lista vendas de uma sessão específica

### POST `/sessions/:sessionId/sales`
Registra venda em uma sessão

**Body:**
```json
{
  "route_ticket_id": 1,
  "quantity": 3,
  "notes": "Grupo familiar",
  "customer_id": 1,
  "customer_number": "CUST000001"
}
```

**Campos Opcionais do Cliente:**
- `customer_id`: ID do cliente registrado
- `customer_number`: Número do cliente registrado
- Se fornecido `customer_id` ou `customer_number`, o cliente será associado à venda
- Se ambos forem fornecidos, `customer_id` tem prioridade

**Response (201):**
```json
{
  "id": 2,
  "session_id": 1,
  "operator_id": 2,
  "route_id": 1,
  "route_ticket_id": 1,
  "vehicle_id": 1,
  "customer_id": 1,
  "customer_number": "CUST000001",
  "price_at_sale": "50.00",
  "quantity": 3,
  "total": "150.00",
  "sold_at": "2024-01-01T11:15:00.000Z",
  "notes": "Grupo familiar",
  "customer": {
    "id": 1,
    "name": "Maria Silva",
    "customer_number": "CUST000001",
    "ticketType": {
      "id": 1,
      "name": "Adulto",
      "code": "ADL"
    }
  }
}
```

**Validações:**
- Sessão deve estar aberta
- Operador deve ser dono da sessão
- Bilhete deve estar ativo
- Bilhete deve pertencer à rota da sessão

### GET `/ticket-sales/:id`
Busca venda por ID

---

## 📊 Códigos de Status HTTP

### Sucesso
- `200` - OK (operação bem-sucedida)
- `201` - Created (recurso criado)

### Erros do Cliente
- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (sem permissão)
- `404` - Not Found (recurso não encontrado)
- `409` - Conflict (conflito de dados)

### Erros do Servidor
- `500` - Internal Server Error (erro interno)

---

## 🔄 Formato de Paginação

Todos os endpoints paginados retornam:

```json
{
  "items": [...],
  "meta": {
    "totalItems": 25,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 3,
    "currentPage": 1
  }
}
```

**Query Params para Paginação:**
- `page`: Número da página (default: 1)
- `limit`: Itens por página (default: 10, máximo: 50)

---

## 🛡️ Tratamento de Erros

Formato padrão de erro:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Erros de Validação:

```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "email must be an email"
  ],
  "error": "Bad Request"
}
```

---

## 🚀 Fluxo de Trabalho Típico

### 1. Autenticação
```javascript
// Login
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'operator@example.com',
    password: '123456'
  })
});

const { access_token } = await response.json();
```

### 2. Operador Abre Sessão
```javascript
// Buscar rotas disponíveis
const routes = await fetch('/routes', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});

// Buscar veículos para a rota selecionada
const vehicles = await fetch(`/routes/1/vehicles`, {
  headers: { 'Authorization': `Bearer ${access_token}` }
});

// Abrir sessão
const session = await fetch('/sessions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    route_id: 1,
    vehicle_id: 1,
    notes: 'Sessão matinal'
  })
});
```

### 3. Realizar Vendas
```javascript
// Buscar bilhetes da rota
const tickets = await fetch(`/routes/1/tickets`, {
  headers: { 'Authorization': `Bearer ${access_token}` }
});

// Registrar venda
const sale = await fetch(`/sessions/1/sales`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    route_ticket_id: 1,
    quantity: 2,
    notes: 'Venda normal'
  })
});
```

### 4. Fechar Sessão
```javascript
const closedSession = await fetch('/sessions/1/close', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    notes: 'Sessão encerrada'
  })
});
```

---

## 📱 Exemplos de Uso Frontend

### React/JavaScript
```javascript
// Hook personalizado para API
const useApi = () => {
  const token = localStorage.getItem('token');
  
  const apiCall = async (endpoint, options = {}) => {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  };
  
  return { apiCall };
};

// Componente de vendas
const SalesForm = ({ sessionId }) => {
  const { apiCall } = useApi();
  
  const handleSale = async (saleData) => {
    try {
      const result = await apiCall(`/sessions/${sessionId}/sales`, {
        method: 'POST',
        body: JSON.stringify(saleData)
      });
      console.log('Venda realizada:', result);
    } catch (error) {
      console.error('Erro na venda:', error);
    }
  };
};
```

Esta documentação fornece todos os endpoints, estruturas de dados e exemplos necessários para a equipe de frontend implementar a interface completa do sistema de transportadora! 🚌📱