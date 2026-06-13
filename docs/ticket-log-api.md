# Ticket Log API

## Descrição

O módulo de Ticket Log permite registrar vendas de bilhetes em um log separado, sem afetar os totais da sessão. Isso é útil para registros históricos, auditorias ou sincronização de dados offline.

## Endpoint

### POST /v1/ticket-sales/sessions/:sessionId/log

Cria registros de log de bilhetes para uma sessão específica.

**Autenticação:** Requerida (JWT)

#### Parâmetros de URL

- `sessionId` (number): ID da sessão

#### Body (Array)

```json
[
  {
    "route_ticket_id": 1,
    "quantity": 2,
    "customer_id": 5,
    "vehicle_id": 10,
    "driver_id": 3,
    "origin_route_stop_id": 1,
    "destination_route_stop_id": 5,
    "customer_number": "CUST123",
    "notes": "Venda offline",
    "ticket_sold_at": "2026-03-12T10:30:00Z",
    "reference": "REF-001"
  }
]
```

#### Campos

| Campo | Tipo | Requerido | Descrição |
|-------|------|-----------|-----------|
| `route_ticket_id` | number | Sim | ID do tipo de bilhete |
| `quantity` | number | Sim | Quantidade de bilhetes (mínimo 1) |
| `customer_id` | number | Não | ID do cliente |
| `vehicle_id` | number | Não | ID do veículo |
| `driver_id` | number | Não | ID do motorista |
| `origin_route_stop_id` | number | Não | ID da paragem de origem |
| `destination_route_stop_id` | number | Não | ID da paragem de destino |
| `customer_number` | string | Não | Número do cliente |
| `notes` | string | Não | Observações |
| `ticket_sold_at` | string (ISO 8601) | Não | Data/hora da venda real |
| `reference` | string | Não | Referência da venda |

#### Resposta de Sucesso (201)

```json
{
  "total_logs": 50.00,
  "total_tickets_logged": 2,
  "logs": [
    {
      "id": 1,
      "session_id": 10,
      "operator_id": 5,
      "route_id": 1,
      "route_ticket_id": 1,
      "vehicle_id": 10,
      "driver_id": 3,
      "customer_id": 5,
      "customer_number": "CUST123",
      "price_at_sale": 25.00,
      "quantity": 2,
      "total": 50.00,
      "sold_at": "2026-03-12T12:00:00Z",
      "ticket_sold_at": "2026-03-12T10:30:00Z",
      "reference": "REF-001",
      "print_count": 1,
      "notes": "Venda offline",
      "createdAt": "2026-03-12T12:00:00Z",
      "updatedAt": "2026-03-12T12:00:00Z"
    }
  ]
}
```

#### Erros

- `400 Bad Request`: Dados inválidos ou bilhete inativo
- `401 Unauthorized`: Não autenticado
- `404 Not Found`: Sessão, bilhete ou cliente não encontrado

## Diferenças entre Sales e Log

| Aspecto | Sales | Log |
|---------|-------|-----|
| Tabela | `ticket_sales` | `ticket_logs` |
| Endpoint | `POST /sessions/:sessionId/sales` | `POST /sessions/:sessionId/log` |
| Atualiza totais da sessão | ✅ Sim | ❌ Não |
| Uso | Vendas em tempo real | Registro histórico/auditoria |

## Estrutura da Tabela

A tabela `ticket_logs` tem a mesma estrutura da tabela `ticket_sales`:

- Campos de venda: session_id, operator_id, route_id, route_ticket_id, etc.
- Campos financeiros: price_at_sale, quantity, total
- Campos de auditoria: createdAt, updatedAt, deletedAt, createdBy, etc.
- Campos opcionais: vehicle_id, driver_id, customer_id, notes, etc.

## Migração

Execute o script SQL em `migrations/create-ticket-logs-table.sql` para criar a tabela:

\`\`\`bash
psql -d your_database -f migrations/create-ticket-logs-table.sql
\`\`\`

## Exemplo de Uso

### Registrar venda offline

\`\`\`bash
curl -X POST http://localhost:3000/v1/ticket-sales/sessions/10/log \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '[
    {
      "route_ticket_id": 1,
      "quantity": 2,
      "customer_number": "CUST123",
      "ticket_sold_at": "2026-03-12T10:30:00Z",
      "reference": "OFFLINE-001",
      "notes": "Sincronização de venda offline"
    }
  ]'
\`\`\`

### Registrar múltiplas vendas

\`\`\`bash
curl -X POST http://localhost:3000/v1/ticket-sales/sessions/10/log \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '[
    {
      "route_ticket_id": 1,
      "quantity": 1,
      "vehicle_id": 10,
      "driver_id": 3
    },
    {
      "route_ticket_id": 2,
      "quantity": 3,
      "vehicle_id": 10,
      "driver_id": 3
    }
  ]'
\`\`\`
