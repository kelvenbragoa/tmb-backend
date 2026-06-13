# API Documentation - Purchase Order Module

## Visão Geral

O módulo **Purchase Order** (Ordem de Compra) é um sistema completo de gestão de ordens de compra para empresas, com suporte a multi-tenancy, autenticação JWT e funcionalidades avançadas de ERP.

**Base URL**: `http://localhost:3000/api/v1/purchase-orders`

**Autenticação**: Todos os endpoints requerem JWT token no header:
```
Authorization: Bearer {JWT_TOKEN}
```

---

## Endpoints Disponíveis

### 1. Criar Ordem de Compra

**POST** `/api/v1/purchase-orders`

Cria uma nova ordem de compra com itens e cálculos automáticos.

#### Request Body
```json
{
  "supplier_id": 1,
  "order_number": "OC-202510-0001", // Opcional - gerado automaticamente
  "status": "draft", // Opcional - default: draft
  "order_date": "2025-10-03T00:00:00.000Z",
  "expected_delivery_date": "2025-11-03T00:00:00.000Z",
  "delivery_terms": "fob", // Opcional - valores: exw, fca, fas, fob, cfr, cif, cpt, cip, dap, dpu, ddp
  "delivery_address": "Rua da Empresa, 123, Centro", // Opcional
  "tax_rate": 18.0, // Opcional - percentual
  "discount_rate": 5.0, // Opcional - percentual
  "discount_amount": 100.00, // Opcional - valor absoluto
  "shipping_cost": 50.00, // Opcional
  "notes": "Observações da ordem", // Opcional
  "terms_and_conditions": "Termos e condições", // Opcional
  "reference_number": "REF-001", // Opcional
  "items": [
    {
      "product_id": 1,
      "description": "Produto A",
      "quantity": 10,
      "unit_price": 100.00,
      "discount_rate": 2.0, // Opcional - percentual por item
      "discount_amount": 20.00 // Opcional - valor absoluto por item
    },
    {
      "product_id": 2,
      "description": "Produto B",
      "quantity": 5,
      "unit_price": 200.00
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "id": 1,
  "organization_id": 1,
  "supplier_id": 1,
  "order_number": "OC-202510-0001",
  "status": "draft",
  "order_date": "2025-10-03T00:00:00.000Z",
  "expected_delivery_date": "2025-11-03T00:00:00.000Z",
  "delivery_terms": "fob",
  "delivery_address": "Rua da Empresa, 123, Centro",
  "subtotal": 1980.00,
  "tax_rate": 18.0,
  "tax_amount": 356.40,
  "discount_rate": 5.0,
  "discount_amount": 100.00,
  "shipping_cost": 50.00,
  "total": 2286.40,
  "notes": "Observações da ordem",
  "terms_and_conditions": "Termos e condições",
  "reference_number": "REF-001",
  "received_amount": 0.00,
  "remaining_amount": 2286.40,
  "created_by": 1,
  "updated_by": 1,
  "createdAt": "2025-10-03T10:00:00.000Z",
  "updatedAt": "2025-10-03T10:00:00.000Z",
  "deletedAt": null,
  "supplier": {
    "id": 1,
    "name": "Fornecedor ABC Ltda",
    "email": "contato@fornecedor.com"
  },
  "items": [
    {
      "id": 1,
      "purchase_order_id": 1,
      "product_id": 1,
      "description": "Produto A",
      "quantity": 10,
      "unit_price": 100.00,
      "discount_rate": 2.0,
      "discount_amount": 20.00,
      "line_total": 980.00,
      "received_quantity": 0.00,
      "remaining_quantity": 10.00,
      "product": {
        "id": 1,
        "name": "Produto A",
        "sku": "PROD-A-001"
      }
    }
  ],
  "createdByUser": {
    "id": 1,
    "name": "João Silva"
  }
}
```

---

### 2. Listar Ordens de Compra

**GET** `/api/v1/purchase-orders`

Lista ordens de compra com paginação e filtros avançados.

#### Query Parameters
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `page` | number | 1 | Página atual |
| `limit` | number | 10 | Itens por página (máx: 100) |
| `status` | string | - | Filtrar por status |
| `supplier_id` | number | - | Filtrar por fornecedor |
| `search` | string | - | Buscar em número da ordem ou nome do fornecedor |

#### Exemplos de URL
```bash
# Básico
GET /api/v1/purchase-orders

# Com paginação
GET /api/v1/purchase-orders?page=2&limit=20

# Com filtros
GET /api/v1/purchase-orders?status=confirmed&supplier_id=1

# Com busca
GET /api/v1/purchase-orders?search=OC-2025

# Combinado
GET /api/v1/purchase-orders?page=1&limit=50&status=draft&supplier_id=2&search=urgent
```

#### Response (200 OK)
```json
{
  "items": [
    {
      "id": 1,
      "order_number": "OC-202510-0001",
      "status": "draft",
      "order_date": "2025-10-03T00:00:00.000Z",
      "expected_delivery_date": "2025-11-03T00:00:00.000Z",
      "total": 2286.40,
      "supplier": {
        "id": 1,
        "name": "Fornecedor ABC Ltda"
      },
      "items": [...],
      "createdByUser": {
        "id": 1,
        "name": "João Silva"
      }
    }
  ],
  "meta": {
    "totalItems": 50,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 5,
    "currentPage": 1
  },
  "links": {
    "first": "?page=1&limit=10",
    "previous": null,
    "next": "?page=2&limit=10",
    "last": "?page=5&limit=10"
  }
}
```

---

### 3. Buscar Ordem por ID

**GET** `/api/v1/purchase-orders/:id`

Retorna uma ordem de compra específica com todos os detalhes e relacionamentos.

#### Response (200 OK)
```json
{
  "id": 1,
  "organization_id": 1,
  "supplier_id": 1,
  "order_number": "OC-202510-0001",
  "status": "draft",
  "order_date": "2025-10-03T00:00:00.000Z",
  "expected_delivery_date": "2025-11-03T00:00:00.000Z",
  "delivery_terms": "fob",
  "delivery_address": "Rua da Empresa, 123, Centro",
  "subtotal": 1980.00,
  "tax_rate": 18.0,
  "tax_amount": 356.40,
  "discount_rate": 5.0,
  "discount_amount": 100.00,
  "shipping_cost": 50.00,
  "total": 2286.40,
  "notes": "Observações da ordem",
  "terms_and_conditions": "Termos e condições",
  "reference_number": "REF-001",
  "received_amount": 0.00,
  "remaining_amount": 2286.40,
  "supplier": {...},
  "items": [...],
  "createdByUser": {...},
  "updatedByUser": {...}
}
```

#### Error Response (404 Not Found)
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Ordem de compra não encontrada"
}
```

---

### 4. Atualizar Ordem de Compra

**PATCH** `/api/v1/purchase-orders/:id`

Atualiza uma ordem de compra. Não é possível editar ordens com status `received`.

#### Request Body
```json
{
  "expected_delivery_date": "2025-12-03T00:00:00.000Z",
  "delivery_address": "Novo endereço de entrega",
  "notes": "Observações atualizadas",
  "items": [
    {
      "product_id": 1,
      "description": "Produto A - Atualizado",
      "quantity": 15,
      "unit_price": 95.00,
      "discount_rate": 3.0
    }
  ]
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "order_number": "OC-202510-0001",
  "status": "draft",
  "expected_delivery_date": "2025-12-03T00:00:00.000Z",
  "delivery_address": "Novo endereço de entrega",
  "notes": "Observações atualizadas",
  "subtotal": 1380.75,
  "total": 1574.49,
  "updated_by": 1,
  "updatedAt": "2025-10-03T11:00:00.000Z",
  // ... outros campos
}
```

#### Error Response (400 Bad Request)
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Não é possível editar uma ordem já recebida"
}
```

---

### 5. Deletar Ordem de Compra

**DELETE** `/api/v1/purchase-orders/:id`

Remove uma ordem de compra (soft delete). Não é possível deletar ordens com status `received`.

#### Response (200 OK)
```json
{
  "affected": 1,
  "raw": []
}
```

#### Error Response (400 Bad Request)
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Não é possível excluir uma ordem já recebida"
}
```

---

### 6. Atualizar Status da Ordem

**PATCH** `/api/v1/purchase-orders/:id/status`

Atualiza apenas o status de uma ordem de compra.

#### Request Body
```json
{
  "status": "confirmed"
}
```

#### Status Disponíveis
- `draft` - Rascunho
- `sent` - Enviada
- `confirmed` - Confirmada
- `partially_received` - Parcialmente recebida
- `received` - Recebida
- `cancelled` - Cancelada

#### Response (200 OK)
```json
{
  "id": 1,
  "status": "confirmed",
  "updated_by": 1,
  "updatedAt": "2025-10-03T12:00:00.000Z",
  // ... outros campos
}
```

---

### 7. Duplicar Ordem de Compra

**POST** `/api/v1/purchase-orders/:id/duplicate`

Cria uma nova ordem de compra baseada em uma existente, com novo número e status `draft`.

#### Response (201 Created)
```json
{
  "id": 2,
  "order_number": "OC-202510-0002",
  "status": "draft",
  "received_amount": 0.00,
  "remaining_amount": 2286.40,
  "created_by": 1,
  "updated_by": 1,
  "createdAt": "2025-10-03T13:00:00.000Z",
  "updatedAt": "2025-10-03T13:00:00.000Z",
  // ... outros campos copiados da ordem original
}
```

---

## Modelos de Dados

### PurchaseOrder Entity
```typescript
{
  id: number;
  organization_id: number;
  supplier_id: number;
  order_number: string; // Único - formato: OC-YYYYMM-XXXX
  status: PurchaseOrderStatus;
  order_date: Date;
  expected_delivery_date: Date;
  delivery_terms?: DeliveryTerms;
  delivery_address?: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_rate: number;
  discount_amount: number;
  shipping_cost: number;
  total: number;
  notes?: string;
  terms_and_conditions?: string;
  reference_number?: string;
  received_amount: number;
  remaining_amount: number;
  created_by: number;
  updated_by: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### PurchaseOrderItem Entity
```typescript
{
  id: number;
  purchase_order_id: number;
  product_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  discount_rate: number;
  discount_amount: number;
  line_total: number;
  received_quantity: number;
  remaining_quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Enums

#### PurchaseOrderStatus
- `draft` - Rascunho
- `sent` - Enviada
- `confirmed` - Confirmada
- `partially_received` - Parcialmente recebida
- `received` - Recebida
- `cancelled` - Cancelada

#### DeliveryTerms (Incoterms)
- `exw` - Ex Works
- `fca` - Free Carrier
- `fas` - Free Alongside Ship
- `fob` - Free on Board
- `cfr` - Cost and Freight
- `cif` - Cost, Insurance and Freight
- `cpt` - Carriage Paid To
- `cip` - Carriage and Insurance Paid To
- `dap` - Delivered at Place
- `dpu` - Delivered at Place Unloaded
- `ddp` - Delivered Duty Paid

---

## Validações e Regras de Negócio

### Validações de Input
- **supplier_id**: Obrigatório, deve existir na organização
- **order_date**: Obrigatório, formato ISO date
- **expected_delivery_date**: Obrigatório, formato ISO date
- **items**: Obrigatório, array não vazio
- **quantity**: Mínimo 0.001
- **unit_price**: Mínimo 0
- **discount_rate**: Mínimo 0 (percentual)
- **discount_amount**: Mínimo 0 (valor absoluto)

### Regras de Negócio
1. **Multi-tenancy**: Todas as operações respeitam `organization_id` do usuário
2. **Numeração automática**: Formato `OC-YYYYMM-XXXX` baseado na data
3. **Cálculos automáticos**:
   - Subtotal = Soma dos line_totals dos itens
   - Desconto = discount_amount OU (subtotal * discount_rate / 100)
   - Base para imposto = subtotal - desconto
   - Imposto = base_imposto * tax_rate / 100
   - Total = base_imposto + imposto + shipping_cost
4. **Controle de edição**: Não é possível editar/deletar ordens com status `received`
5. **Controle de recebimento**: Campos `received_amount` e `remaining_amount` para futuro controle de entregas

### Cálculos por Item
- **line_total** = (quantity * unit_price) - discount_amount
- **discount_amount** (se não informado) = (quantity * unit_price) * discount_rate / 100

---

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Bad Request - Dados inválidos ou regra de negócio violada |
| 401 | Unauthorized - Token JWT inválido ou ausente |
| 403 | Forbidden - Usuário sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 422 | Unprocessable Entity - Erro de validação |
| 500 | Internal Server Error - Erro interno do servidor |

### Exemplos de Erros de Validação
```json
{
  "statusCode": 422,
  "error": "Unprocessable Entity",
  "message": [
    "supplier_id must be a number",
    "order_date must be a valid ISO 8601 date string",
    "items should not be empty"
  ]
}
```

---

## Considerações de Performance

1. **Paginação**: Limite máximo de 100 itens por página
2. **Índices**: Campos `organization_id`, `supplier_id`, `status` e `order_number` são indexados
3. **Lazy Loading**: Relacionamentos carregados apenas quando necessário
4. **Soft Delete**: Registros deletados mantidos para auditoria
5. **Queries otimizadas**: Contagem separada para melhor performance em listas grandes

---

## Exemplos de Uso Completos

### Criar uma ordem completa
```bash
curl -X POST "http://localhost:3000/api/v1/purchase-orders" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": 1,
    "order_date": "2025-10-03T00:00:00.000Z",
    "expected_delivery_date": "2025-11-03T00:00:00.000Z",
    "delivery_terms": "fob",
    "tax_rate": 18.0,
    "shipping_cost": 50.00,
    "notes": "Entrega urgente",
    "items": [
      {
        "product_id": 1,
        "description": "Produto A",
        "quantity": 10,
        "unit_price": 100.00,
        "discount_rate": 5.0
      }
    ]
  }'
```

### Listar ordens com filtros
```bash
curl -X GET "http://localhost:3000/api/v1/purchase-orders?page=1&limit=20&status=confirmed&supplier_id=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Atualizar status
```bash
curl -X PATCH "http://localhost:3000/api/v1/purchase-orders/1/status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'
```

---

Esta documentação cobre todos os aspectos do módulo Purchase Order, incluindo endpoints, validações, regras de negócio e exemplos práticos de uso.