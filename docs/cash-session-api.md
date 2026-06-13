# Cash Session API - Sistema Completo de Controle de Caixa

## Visão Geral

O sistema de Cash Session permite controle completo de caixa para pontos de venda, incluindo abertura/fechamento de sessões, movimentações automáticas e relatórios detalhados.

## Entidades

### CashSession (Sessão de Caixa)
- **Tabela**: `cash_sessions`
- **Campos principais**:
  - `session_number`: Número único da sessão (CS-YYYYMM-XXXX)
  - `opening_balance`: Saldo inicial
  - `closing_balance`: Saldo final (informado no fechamento)
  - `expected_balance`: Saldo esperado (calculado automaticamente)
  - `total_entries`: Total de entradas
  - `total_exits`: Total de saídas
  - `total_sales`: Total de vendas
  - `status`: OPEN | CLOSED
  - `opened_at`: Data/hora de abertura
  - `closed_at`: Data/hora de fechamento

### CashMovement (Movimento de Caixa)
- **Tabela**: `cash_movements`
- **Campos principais**:
  - `movement_number`: Número único do movimento (CM-YYYYMMDD-XXXX)
  - `type`: ENTRY | EXIT | OPENING | CLOSING
  - `category`: SALE | PAYMENT_RECEIVED | PAYMENT_MADE | CASH_WITHDRAWAL | CASH_DEPOSIT | OPENING_BALANCE | CLOSING_BALANCE | ADJUSTMENT | OTHER
  - `amount`: Valor do movimento
  - `balance_before`: Saldo antes do movimento
  - `balance_after`: Saldo após o movimento
  - `reference_type`: Tipo da referência (sale, invoice, receipt)
  - `reference_id`: ID da entidade relacionada

## Endpoints da API

### 1. Abrir Sessão de Caixa
```http
POST /cash-sessions/open
Authorization: Bearer {token}
Content-Type: application/json

{
  "opening_balance": 100.00,
  "point_of_sale_id": 1,
  "opening_notes": "Abertura do caixa matutino"
}
```

**Resposta de Sucesso (201)**:
```json
{
  "id": 1,
  "session_number": "CS-202410-0001",
  "opening_balance": 100.00,
  "status": "open",
  "opened_at": "2024-10-07T08:00:00Z",
  "user": {
    "id": 1,
    "name": "João Silva"
  },
  "point_of_sale": {
    "id": 1,
    "name": "Caixa Principal"
  }
}
```

### 2. Fechar Sessão de Caixa
```http
PATCH /cash-sessions/{id}/close
Authorization: Bearer {token}
Content-Type: application/json

{
  "closing_balance": 450.50,
  "closing_notes": "Fechamento normal do dia"
}
```

**Resposta de Sucesso (200)**:
```json
{
  "id": 1,
  "session_number": "CS-202410-0001",
  "opening_balance": 100.00,
  "closing_balance": 450.50,
  "expected_balance": 445.00,
  "difference": 5.50,
  "status": "closed",
  "closed_at": "2024-10-07T18:00:00Z"
}
```

### 3. Listar Sessões de Caixa
```http
GET /cash-sessions?status=open&startDate=2024-10-01&endDate=2024-10-07
Authorization: Bearer {token}
```

**Parâmetros de Query**:
- `status`: open | closed
- `startDate`: Data inicial (YYYY-MM-DD)
- `endDate`: Data final (YYYY-MM-DD)

### 4. Buscar Sessão Ativa
```http
GET /cash-sessions/active
Authorization: Bearer {token}
```

**Resposta com Sessão Ativa (200)**:
```json
{
  "active_session": {
    "id": 1,
    "session_number": "CS-202410-0001",
    "opening_balance": 100.00,
    "closing_balance": null,
    "expected_balance": 145.50,
    "total_entries": 245.50,
    "total_exits": 100.00,
    "total_sales": 200.00,
    "status": "open",
    "opened_at": "2024-10-07T08:00:00Z",
    "closed_at": null,
    "user": {
      "id": 1,
      "name": "João Silva"
    },
    "point_of_sale": {
      "id": 1,
      "name": "Caixa Principal"
    }
  },
  "has_active_session": true,
  "message": "Sessão ativa encontrada"
}
```

**Resposta sem Sessão Ativa (200)**:
```json
{
  "active_session": null,
  "has_active_session": false,
  "message": "Nenhuma sessão de caixa ativa encontrada"
}
```

### 5. Buscar Sessão Específica
```http
GET /cash-sessions/{id}
Authorization: Bearer {token}
```

### 6. Listar Movimentos de uma Sessão
```http
GET /cash-sessions/{id}/movements
Authorization: Bearer {token}
```

### 7. Criar Movimento Manual
```http
POST /cash-sessions/{id}/movements
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "entry",
  "category": "cash_deposit",
  "amount": 50.00,
  "description": "Suprimento de caixa",
  "notes": "Reforço para troco"
}
```

### 8. Gerar Relatório de Caixa
```http
GET /cash-sessions/{id}/report
Authorization: Bearer {token}
```

**Resposta**:
```json
{
  "session": {
    "id": 1,
    "session_number": "CS-202410-0001",
    "opening_balance": 100.00,
    "closing_balance": 450.50,
    "expected_balance": 445.00
  },
  "totals": {
    "difference": 5.50,
    "total_entries": 375.00,
    "total_exits": 30.00,
    "movement_count": 25
  },
  "categories": {
    "sale": {
      "count": 15,
      "total": 300.00,
      "movements": [...]
    },
    "payment_received": {
      "count": 5,
      "total": 75.00,
      "movements": [...]
    }
  }
}
```

### 9. Dashboard de Caixa
```http
GET /cash-sessions/dashboard/summary
Authorization: Bearer {token}
```

## Integrações Automáticas

### Vendas (Sales)
Quando uma venda é realizada com pagamento em dinheiro:
- **Entrada**: Valor pago pelo cliente
- **Saída**: Troco (se houver)

### Faturas (Invoices)
Quando uma fatura é paga em dinheiro:
- **Entrada**: Valor pago

### Recibos (Receipts)
Quando um recibo é emitido:
- **Entrada**: Valor do recibo

## Tipos de Movimento

### Entradas (ENTRY)
- **SALE**: Vendas em dinheiro
- **PAYMENT_RECEIVED**: Pagamentos recebidos
- **CASH_DEPOSIT**: Suprimento de caixa
- **OPENING_BALANCE**: Saldo inicial
- **ADJUSTMENT**: Ajustes positivos
- **OTHER**: Outras entradas

### Saídas (EXIT)
- **PAYMENT_MADE**: Pagamentos efetuados
- **CASH_WITHDRAWAL**: Sangria de caixa
- **CLOSING_BALANCE**: Saldo final
- **ADJUSTMENT**: Ajustes negativos
- **OTHER**: Outras saídas (ex: troco)

## Regras de Negócio

### Abertura de Sessão
1. Apenas uma sessão ativa por usuário/organização
2. Saldo inicial obrigatório (≥ 0)
3. Movimento automático de abertura criado

### Fechamento de Sessão
1. Apenas sessões abertas podem ser fechadas
2. Saldo final obrigatório
3. Calcula diferença entre esperado e informado
4. Movimento automático de fechamento criado

### Movimentos
1. Movimentos não podem resultar em saldo negativo
2. Numeração automática sequencial
3. Histórico completo de saldos
4. Rastreabilidade de referências

### Segurança
1. Autenticação JWT obrigatória
2. Isolamento por organização
3. Auditoria completa de ações

## Códigos de Erro

- **400**: Dados inválidos ou regra de negócio violada
- **401**: Token de autenticação inválido
- **403**: Acesso negado à organização
- **404**: Sessão ou movimento não encontrado
- **409**: Conflito (ex: sessão já aberta)

## Exemplos de Uso

### Fluxo Completo de Caixa
1. **Manhã**: Operador abre o caixa com R$ 100,00
2. **Durante o dia**: Vendas e movimentos são registrados automaticamente
3. **Tarde**: Sangria de R$ 200,00 para cofre
4. **Noite**: Suprimento de R$ 50,00 para troco
5. **Fechamento**: Operador conta R$ 445,50 e fecha o caixa

### Integração com Vendas
```javascript
// No service de vendas, após criar uma venda:
if (sale.payment_method === 'cash') {
  await this.cashIntegrationService.processSale(sale, userId, organizationId);
}
```

### Relatórios Gerenciais
- Resumo diário de caixa
- Diferenças entre esperado e real
- Movimentação por categoria
- Performance por ponto de venda

## Considerações Técnicas

### Performance
- Índices em campos de consulta frequente
- Paginação em listagens
- Cache de sessões ativas

### Backup e Auditoria
- Soft delete para movimentos críticos
- Log de todas as operações
- Backup automático de dados financeiros

### Extensibilidade
- Suporte a múltiplas moedas (futuro)
- Integração com balanças (futuro)
- Relatórios customizáveis (futuro)