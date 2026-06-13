# API de Vendas de Bilhetes de Multa (Penalty Ticket Sales) - v1

Base path: `/v1/penalty-ticket-sales`

## Visão Geral

Esta API gerencia a venda de bilhetes de multa (penalty tickets). Cada bilhete configurado no sistema possui um preço normal e um preço de multa. As vendas de multa são registradas separadamente das vendas normais e podem opcionalmente referenciar uma venda original de bilhete.

---

## POST /v1/penalty-ticket-sales/session/:sessionId

Criar vendas de bilhetes de multa para uma sessão.

**Autenticação:** Requerida (OPERATOR ou ADMIN)

**Parâmetros de URL:**
- `sessionId` (number) - ID da sessão ativa

**Body (JSON):** Array de objetos de venda de multa

```json
[
  {
    "route_ticket_id": 1,
    "quantity": 2,
    "route_stop_id": 5,
    "vehicle_id": 3,
    "driver_id": 2,
    "customer_id": 10,
    "ticket_sale_id": 123,
    "notes": "Multa por viagem sem bilhete válido"
  },
  {
    "route_ticket_id": 2,
    "quantity": 1,
    "customer_number": "CUST12345",
    "notes": "Multa aplicada"
  }
]
```

**Campos do objeto:**
- `route_ticket_id` (number, obrigatório) - ID do bilhete de rota
- `quantity` (number, obrigatório) - Quantidade (mínimo 1)
- `route_stop_id` (number, obrigatório) - ID da parada da rota
- `vehicle_id` (number, opcional) - ID do veículo
- `driver_id` (number, opcional) - ID do motorista
- `customer_id` (number, opcional) - ID do cliente
- `customer_number` (string, opcional) - Número do cliente (alternativa ao customer_id)
- `ticket_sale_id` (number, opcional) - ID da venda de bilhete original (se existir)
- `notes` (string, opcional) - Notas adicionais

**Resposta:** 201 Created

```json
{
  "total_sales": 150.00,
  "total_tickets_sold": 3,
  "sales": [
    {
      "id": 45,
      "session_id": 10,
      "operator_id": 5,
      "route_id": 2,
      "route_stop_id": 5,
      "route_ticket_id": 1,
      "vehicle_id": 3,
      "driver_id": 2,
      "customer_id": 10,
      "customer_number": "CUST00010",
      "ticket_sale_id": 123,
      "penalty_price_at_sale": 75.00,
      "quantity": 2,
      "total": 150.00,
      "sold_at": "2026-01-25T10:30:00.000Z",
      "notes": "Multa por viagem sem bilhete válido",
      "createdAt": "2026-01-25T10:30:00.000Z"
    }
  ]
}
```

**Validações:**
- A sessão deve estar aberta e pertencer ao operador
- O route_ticket deve estar ativo
- O route_ticket deve ter um penalty_price configurado (> 0)
- Se customer_id ou customer_number for fornecido, o cliente deve existir
- A sessão é atualizada automaticamente com os totais

---

## GET /v1/penalty-ticket-sales/session/:sessionId?page=1&limit=10

Listar vendas de multa de uma sessão específica (paginado).

**Autenticação:** Requerida (OPERATOR ou ADMIN)

**Parâmetros de URL:**
- `sessionId` (number) - ID da sessão

**Query params:**
- `page` (number, default 1) - Número da página
- `limit` (number, default 10, máximo 100) - Itens por página

**Resposta:** 200 OK

```json
{
  "items": [
    {
      "id": 45,
      "session_id": 10,
      "operator_id": 5,
      "route_id": 2,
      "route_ticket_id": 1,
      "penalty_price_at_sale": 75.00,
      "quantity": 2,
      "total": 150.00,
      "sold_at": "2026-01-25T10:30:00.000Z",
      "operator": {
        "id": 5,
        "name": "João Operator"
      },
      "route": {
        "id": 2,
        "name": "Centro - Aeroporto"
      },
      "routeTicket": {
        "id": 1,
        "price": 50.00,
        "penalty_price": 75.00,
        "ticketType": {
          "id": 1,
          "name": "Adulto",
          "code": "ADU"
        }
      },
      "driver": {
        "id": 2,
        "name": "Carlos Silva"
      },
      "ticketSale": {
        "id": 123,
        "sold_at": "2026-01-20T08:00:00.000Z"
      }
    }
  ],
  "meta": {
    "totalItems": 15,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 2,
    "currentPage": 1
  }
}
```

---

## GET /v1/penalty-ticket-sales/session/:sessionId/report

Obter relatório de vendas de multa de uma sessão.

**Autenticação:** Requerida (OPERATOR ou ADMIN)

**Parâmetros de URL:**
- `sessionId` (number) - ID da sessão

**Resposta:** 200 OK

```json
{
  "session": {
    "id": 10,
    "status": "OPEN",
    "opened_at": "2026-01-25T08:00:00.000Z",
    "total_sales": 1500.00,
    "total_tickets_sold": 45
  },
  "salesByTicketType": [
    {
      "ticketTypeName": "Adulto",
      "ticketTypeCode": "ADU",
      "totalQuantity": "30",
      "totalAmount": "2250.00",
      "averagePenaltyPrice": "75.00"
    },
    {
      "ticketTypeName": "Criança",
      "ticketTypeCode": "CHD",
      "totalQuantity": "15",
      "totalAmount": "525.00",
      "averagePenaltyPrice": "35.00"
    }
  ],
  "totalPenaltySales": 2775.00,
  "totalPenaltyTicketsSold": 45
}
```

---

## GET /v1/penalty-ticket-sales?page=1&limit=10&operatorId=5

Listar todas as vendas de multa (paginado) - ADMIN apenas.

**Autenticação:** Requerida (ADMIN)

**Query params:**
- `page` (number, default 1) - Número da página
- `limit` (number, default 10, máximo 100) - Itens por página
- `operatorId` (number, opcional) - Filtrar por operador

**Resposta:** 200 OK

```json
{
  "items": [
    {
      "id": 45,
      "session_id": 10,
      "operator_id": 5,
      "penalty_price_at_sale": 75.00,
      "quantity": 2,
      "total": 150.00,
      "sold_at": "2026-01-25T10:30:00.000Z",
      "session": {
        "id": 10,
        "status": "OPEN"
      },
      "operator": {
        "id": 5,
        "name": "João Operator"
      },
      "routeTicket": {
        "ticketType": {
          "name": "Adulto",
          "code": "ADU"
        }
      }
    }
  ],
  "meta": {
    "totalItems": 100,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 10,
    "currentPage": 1
  }
}
```

---

## GET /v1/penalty-ticket-sales/:id

Obter detalhes de uma venda de multa específica.

**Autenticação:** Requerida (OPERATOR ou ADMIN)

**Parâmetros de URL:**
- `id` (number) - ID da venda de multa

**Resposta:** 200 OK

```json
{
  "id": 45,
  "session_id": 10,
  "operator_id": 5,
  "route_id": 2,
  "route_stop_id": 5,
  "route_ticket_id": 1,
  "vehicle_id": 3,
  "driver_id": 2,
  "customer_id": 10,
  "customer_number": "CUST00010",
  "ticket_sale_id": 123,
  "penalty_price_at_sale": 75.00,
  "quantity": 2,
  "total": 150.00,
  "sold_at": "2026-01-25T10:30:00.000Z",
  "notes": "Multa por viagem sem bilhete válido",
  "session": {
    "id": 10,
    "status": "OPEN",
    "opened_at": "2026-01-25T08:00:00.000Z"
  },
  "operator": {
    "id": 5,
    "name": "João Operator",
    "email": "joao@example.com"
  },
  "route": {
    "id": 2,
    "name": "Centro - Aeroporto",
    "origin": "Centro",
    "destination": "Aeroporto"
  },
  "routeTicket": {
    "id": 1,
    "price": 50.00,
    "penalty_price": 75.00,
    "ticketType": {
      "id": 1,
      "name": "Adulto",
      "code": "ADU"
    }
  },
  "driver": {
    "id": 2,
    "name": "Carlos Silva",
    "mobile": "999999999"
  },
  "ticketSale": {
    "id": 123,
    "quantity": 1,
    "total": 50.00,
    "sold_at": "2026-01-20T08:00:00.000Z"
  },
  "createdBy": {
    "id": 5,
    "name": "João Operator"
  },
  "createdAt": "2026-01-25T10:30:00.000Z",
  "updatedAt": "2026-01-25T10:30:00.000Z"
}
```

**Resposta:** 404 Not Found se não existir



## Notas Importantes

1. **Preço de Multa:** Cada route_ticket deve ter um `penalty_price` configurado para permitir vendas de multa
2. **Validação:** O sistema valida se o penalty_price existe e é maior que 0 antes de criar uma venda
3. **Sessão:** As vendas de multa atualizam os totais da sessão (total_sales e total_tickets_sold)
4. **Relacionamento Opcional:** O campo `ticket_sale_id` permite referenciar a venda original que gerou a multa
5. **Soft Delete:** As vendas de multa suportam soft delete (campo deletedAt)
6. **Auditoria:** Todas as vendas incluem createdBy e updatedBy para rastreabilidade

---

## Códigos de Erro Comuns

- **400 Bad Request:** Sessão fechada, route_ticket inativo, penalty_price não configurado
- **401 Unauthorized:** Token de autenticação ausente ou inválido
- **403 Forbidden:** Usuário sem permissão (role incorreta) ou tentando acessar sessão de outro operador
- **404 Not Found:** Sessão, route_ticket, customer ou venda não encontrada

---

## Fluxo de Uso Típico

1. Operador abre uma sessão
2. Durante o dia, identifica passageiros sem bilhete válido
3. Cria vendas de multa usando `POST /v1/penalty-ticket-sales/session/:sessionId`
4. Opcionalmente referencia a venda original com `ticket_sale_id`
5. Consulta vendas de multa da sessão com `GET /v1/penalty-ticket-sales/session/:sessionId`
6. Ao final do turno, gera relatório com `GET /v1/penalty-ticket-sales/session/:sessionId/report`
7. Admin pode visualizar todas as vendas de multa do sistema

***






