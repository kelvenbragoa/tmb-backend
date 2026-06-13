# API de Detalhes da Sessão - Documentação Frontend

## Endpoint: GET /sessions/:id

### Descrição
Este endpoint retorna todos os detalhes completos de uma sessão de caixa, incluindo indicadores, estatísticas de vendas, histórico de transações e análises por tipo de bilhete, rota e horário. Ideal para alimentar a página de visualização detalhada da sessão.

### URL
```
GET /sessions/:id
```

### Parâmetros de URL
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| id | number | Sim | ID da sessão |

### Headers
```
Authorization: Bearer {token}
```

### Resposta de Sucesso (200 OK)

```typescript
{
  // Informações básicas da sessão
  id: number;
  status: "OPEN" | "CLOSED";
  opened_at: string;  // ISO 8601 datetime
  closed_at: string | null;  // ISO 8601 datetime
  total_sales: number;  // Valor total de vendas normais
  total_penalty_sales: number;  // Valor total de vendas de multas
  total_amount: number;  // Valor total geral (vendas + multas)
  total_tickets_sold: number;  // Total de bilhetes vendidos (normais + multas)
  actual_amount_delivered: number | null;  // Valor real entregue no fecho
  notes: string | null;  // Observações da sessão
  
  // Informações do operador
  operator: {
    id: number;
    name: string;
    email: string;
  };
  
  // Informações do turno (pode ser null)
  shift: {
    id: number;
    name: string;
    start_time: string;  // Formato: "HH:mm:ss"
    end_time: string;    // Formato: "HH:mm:ss"
  } | null;
  
  // Indicadores gerais da sessão
  indicators: {
    total_regular_tickets: number;    // Quantidade de bilhetes normais
    total_penalty_tickets: number;    // Quantidade de bilhetes de multa
    total_regular_sales: number;      // Valor total de vendas normais
    total_penalty_sales: number;      // Valor total de vendas de multa
    average_ticket_price: number;     // Preço médio por bilhete
    total_transactions: number;       // Total de transações realizadas
  };
  
  // Vendas agrupadas por tipo de bilhete
  salesByTicketType: Array<{
    ticket_type_id: number;
    ticket_type_name: string;
    quantity: number;           // Quantidade vendida deste tipo
    total_amount: number;       // Valor total vendido deste tipo
    percentage: number;         // Percentual do total de vendas (0-100)
  }>;
  
  // Vendas agrupadas por rota
  salesByRoute: Array<{
    route_id: number;
    route_name: string;
    regular_tickets: number;    // Bilhetes normais vendidos nesta rota
    penalty_tickets: number;    // Bilhetes de multa vendidos nesta rota
    total_tickets: number;      // Total de bilhetes (regular + multa)
    total_amount: number;       // Valor total vendido nesta rota
    percentage: number;         // Percentual do total de vendas (0-100)
  }>;

  // Vendas agrupadas por veículo
  salesByVehicle: Array<{
    vehicle_id: number;
    vehicle_name: string;
    vehicle_plate: string;
    regular_tickets: number;    // Bilhetes normais vendidos neste veículo
    penalty_tickets: number;    // Bilhetes de multa vendidos neste veículo
    total_tickets: number;      // Total de bilhetes (regular + multa)
    total_amount: number;       // Valor total vendido neste veículo
    percentage: number;         // Percentual do total de vendas (0-100)
  }>;
  
  // Vendas distribuídas por hora do dia
  salesByHour: Array<{
    hour: number;               // Hora do dia (0-23)
    regular_tickets: number;
    penalty_tickets: number;
    total_tickets: number;
    total_amount: number;
  }>;
  
  // Histórico das últimas 20 vendas
  recentSales: Array<{
    id: number;
    type: "regular" | "penalty";
    route_name: string;
    ticket_type_name: string;
    quantity: number;
    price: number;              // Preço unitário
    total: number;              // Total da venda
    sold_at: string;            // ISO 8601 datetime
    customer_number: string | null;
    vehicle_plate: string | null;
    driver_name: string | null;
  }>;
  
  // Informações de auditoria
  createdBy: {
    id: number;
    name: string;
  };
  updatedBy: {
    id: number;
    name: string;
  } | null;
  closedBy: {
    id: number;
    name: string;
  } | null;
  createdAt: string;  // ISO 8601 datetime
  updatedAt: string;  // ISO 8601 datetime
}
```

### Exemplo de Resposta

```json
{
  "id": 1,
  "status": "OPEN",
  "actual_amount_delivered": null,
  "opened_at": "2026-02-05T08:00:00.000Z",
  "closed_at": null,
  "total_sales": 15750.00,
  "total_tickets_sold": 350,
  "notes": null,
  "operator": {
    "id": 5,
    "name": "João Silva",
    "email": "joao.silva@example.com"
  },
  "shift": {
    "id": 1,
    "name": "Turno Manhã",
    "start_time": "06:00:00",
    "end_time": "14:00:00"
  },
  "indicators": {
    "total_regular_tickets": 320,
    "total_penalty_tickets": 30,
    "total_regular_sales": 14400.00,
    "total_penalty_sales": 1350.00,
    "average_ticket_price": 45.00,
    "total_transactions": 87
  },
  "salesByTicketType": [
    {
      "ticket_type_id": 1,
      "ticket_type_name": "Adulto",
      "quantity": 200,
      "total_amount": 10000.00,
      "percentage": 63.49
    },
    {
      "ticket_type_id": 2,
      "ticket_type_name": "Estudante",
      "quantity": 100,
      "total_amount": 3750.00,
      "percentage": 23.81
    },
    {
      "ticket_type_id": 3,
      "ticket_type_name": "Idoso",
      "quantity": 50,
      "total_amount": 2000.00,
      "percentage": 12.70
    }
  ],
  "salesByRoute": [
    {
      "route_id": 10,
      "route_name": "Centro - Matola",
      "regular_tickets": 150,
      "penalty_tickets": 15,
      "total_tickets": 165,
      "total_amount": 7425.00,
      "percentage": 47.14
    },
    {
      "route_id": 11,
      "route_name": "Maputo - Boane",
      "regular_tickets": 120,
      "penalty_tickets": 10,
      "total_tickets": 130,
      "total_amount": 5850.00,
      "percentage": 37.14
    }
  ],
  "salesByVehicle": [
    {
      "vehicle_id": 1,
      "vehicle_name": "Ônibus 101",
      "vehicle_plate": "ABC-1234",
      "regular_tickets": 180,
      "penalty_tickets": 12,
      "total_tickets": 192,
      "total_amount": 8640.00,
      "percentage": 54.86
    },
    {
      "vehicle_id": 2,
      "vehicle_name": "Ônibus 102",
      "vehicle_plate": "XYZ-5678",
      "regular_tickets": 140,
      "penalty_tickets": 18,
      "total_tickets": 158,
      "total_amount": 7110.00,
      "percentage": 45.14
    }
  ],
  "salesByHour": [
    {
      "hour": 8,
      "regular_tickets": 45,
      "penalty_tickets": 3,
      "total_tickets": 48,
      "total_amount": 2160.00
    },
    {
      "hour": 9,
      "regular_tickets": 67,
      "penalty_tickets": 5,
      "total_tickets": 72,
      "total_amount": 3240.00
    },
    {
      "hour": 10,
      "regular_tickets": 89,
      "penalty_tickets": 8,
      "total_tickets": 97,
      "total_amount": 4365.00
    }
  ],
  "recentSales": [
    {
      "id": 523,
      "type": "regular",
      "route_name": "Centro - Matola",
      "ticket_type_name": "Adulto",
      "quantity": 2,
      "price": 50.00,
      "total": 100.00,
      "sold_at": "2026-02-05T11:45:30.000Z",
      "customer_number": "845123456",
      "vehicle_plate": "ABC-1234",
      "driver_name": "Carlos Tembe"
    },
    {
      "id": 522,
      "type": "penalty",
      "route_name": "Maputo - Boane",
      "ticket_type_name": "Estudante",
      "quantity": 1,
      "price": 45.00,
      "total": 45.00,
      "sold_at": "2026-02-05T11:42:15.000Z",
      "customer_number": null,
      "vehicle_plate": "XYZ-5678",
      "driver_name": "Maria João"
    }
  ],
  "createdBy": {
    "id": 5,
    "name": "João Silva"
  },
  "ulosedBy": null,
  "cpdatedBy": null,
  "createdAt": "2026-02-05T08:00:00.000Z",
  "updatedAt": "2026-02-05T08:00:00.000Z"
}
```

### Respostas de Erro

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Session not found"
}
```

---

## Sugestões de Uso no Frontend

### 1. Dashboard de Sessão

Use os `indicators` para exibir cards com métricas principais:

```typescript
// Exemplo com React
function SessionDashboard({ session }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard 
        title="Total de Vendas"
        value={`${session.total_sales.toFixed(2)} MT`}
        subtitle={`${session.total_tickets_sold} bilhetes`}
      />
      <MetricCard 
        title="Bilhetes Normais"
        value={session.indicators.total_regular_tickets}
        subtitle={`${session.indicators.total_regular_sales.toFixed(2)} MT`}
      />
      <MetricCard 
        title="Bilhetes Multa"
        value={session.indicators.total_penalty_tickets}
        subtitle={`${session.indicators.total_penalty_sales.toFixed(2)} MT`}
      />
      <MetricCard 
        title="Preço Médio"
        value={`${session.indicators.average_ticket_price.toFixed(2)} MT`}
        subtitle={`${session.indicators.total_transactions} transações`}
      />
    </div>
  );
}
```

### 2. Gráfico de Vendas por Tipo de Bilhete

Use `salesByTicketType` para criar gráficos de pizza ou barras:

```typescript
// Exemplo com Chart.js ou Recharts
const pieChartData = session.salesByTicketType.map(item => ({
  name: item.ticket_type_name,
  value: item.total_amount,
  percentage: item.percentage.toFixed(2)
}));
```

### 3. Gráfico de Vendas por Rota

Use `salesByRoute` para visualizar desempenho por rota:

```typescript
const routeChartData = session.salesByRoute.map(item => ({
  name: item.route_name,
  regular: item.regular_tickets,
  multa: item.penalty_tickets,
  total: item.total_amount
}));
```

### 4. Gráfico de Vendas por Veículo

Use `salesByVehicle` para visualizar desempenho por veículo:

```typescript
const vehicleChartData = session.salesByVehicle.map(item => ({
  name: `${item.vehicle_plate} - ${item.vehicle_name}`,
  regular: item.regular_tickets,
  multa: item.penalty_tickets,
  total: item.total_amount
}));
```

### 5. Gráfico de Vendas por Hora

Use `salesByHour` para criar um gráfico de linha temporal:

```typescript
const hourlyChartData = session.salesByHour.map(item => ({
  hora: `${item.hour}:00`,
  bilhetes: item.total_tickets,
  valor: item.total_amount
}));
```

### 6. Tabela de Histórico de Vendas

Use `recentSales` para exibir as últimas transações:

```typescript
function RecentSalesTable({ sales }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Hora</th>
          <th>Tipo</th>
          <th>Rota</th>
          <th>Bilhete</th>
          <th>Qtd</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {sales.map(sale => (
          <tr key={sale.id}>
            <td>{new Date(sale.sold_at).toLocaleTimeString()}</td>
            <td>
              <Badge color={sale.type === 'regular' ? 'green' : 'orange'}>
                {sale.type === 'regular' ? 'Normal' : 'Multa'}
              </Badge>
            </td>
            <td>{sale.route_name}</td>
            <td>{sale.ticket_type_name}</td>
            <td>{sale.quantity}</td>
            <td>{sale.total.toFixed(2)} MT</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### 7. Informações da Sessão

```typescript
function SessionHeader({ session }) {
  const duration = session.closed_at 
    ? new Date(session.closed_at).getTime() - new Date(session.opened_at).getTime()
    : Date.now() - new Date(session.opened_at).getTime();
    
  return (
    <div>
      <h1>Sessão #{session.id}</h1>
      <p>Operador: {session.operator.name}</p>
      <p>Turno: {session.shift?.name || 'Sem turno'}</p>
      <p>Aberta em: {new Date(session.opened_at).toLocaleString()}</p>
      {session.closed_at && (
        <p>Fechada em: {new Date(session.closed_at).toLocaleString()}</p>
      )}
      <StatusBadge status={session.status} />
    </div>
  );
}
```

---

## Notas Importantes

1. **Performance**: Este endpoint carrega TODOS os detalhes da sessão, incluindo todas as vendas relacionadas. Para sessões com muitas vendas, a resposta pode ser grande. Use com moderação e considere cache no frontend.

2. **Datas**: Todas as datas vêm no formato ISO 8601 (UTC). Converta para o fuso horário local no frontend usando `new Date()`.

3. **Valores Decimais**: Todos os valores monetários vêm como números. Formate com 2 casas decimais para exibição.

4. **Ordenação**:
   - `salesByTicketType`: Ordenado por valor total (decrescente)
   - `salesByRoute`: Ordenado por valor total (decrescente)
   - `salesByHour`: Ordenado por hora (crescente)
   - `recentSales`: Ordenado por data de venda (mais recente primeiro)

5. **Campos Opcionais**:
   - `shift`: Pode ser `null` se a sessão não tiver turno associado
   - `closed_at`: `null` para sessões abertas
   - `actual_amount_delivered`: `null` se a sessão ainda não foi fechada ou se o valor não foi informado
   - `notes`: `null` se não houver observações
   - `customer_number`, `vehicle_plate`, `driver_name`: `null` se não informados
   - `closedBy`: `null` se a sessão ainda não foi fechada

6. **Atualização em Tempo Real**: Para sessões abertas, considere fazer polling a cada 30-60 segundos para atualizar os dados, ou implementar WebSocket para updates em tempo real.

---

## Endpoint: POST /sessions/:id/close

### Descrição
Este endpoint fecha uma sessão de caixa, registrando o valor real entregue no momento do fecho e quem fechou a sessão.

### URL
```
POST /sessions/:id/close
```

### Parâmetros de URL
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| id | number | Sim | ID da sessão a ser fechada |

### Headers
```
Authorization: Bearer {token}
```

### Body (JSON)
```typescript
{
  notes?: string;                    // Observações sobre o fechamento (opcional)
  actual_amount_delivered?: number;  // Valor real entregue no fecho (opcional)
}
```

### Exemplo de Requisição
```json
{
  "notes": "Sessão fechada normalmente. Todas as vendas conferidas.",
  "actual_amount_delivered": 15750.00
}
```

### Resposta de Sucesso (200 OK)
Retorna a sessão fechada (entidade Session básica):
```json
{
  "id": 1,
  "operator_id": 5,
  "shift_id": 1,
  "status": "CLOSED",
  "opened_at": "2026-02-05T08:00:00.000Z",
  "closed_at": "2026-02-05T16:30:00.000Z",
  "closed_by_id": 5,
  "total_sales": 14400.00,
  "total_penalty_sales": 1350.00,
  "total_amount": 15750.00,
  "total_tickets_sold": 350,
  "actual_amount_delivered": 15750.00,
  "notes": "Sessão fechada normalmente. Todas as vendas conferidas.",
  "createdAt": "2026-02-05T08:00:00.000Z",
  "updatedAt": "2026-02-05T16:30:00.000Z"
}
```

### Respostas de Erro

#### 400 Bad Request - Sessão já fechada
```json
{
  "statusCode": 400,
  "message": "Session is already closed"
}
```

#### 403 Forbidden - Sem permissão
```json
{
  "statusCode": 403,
  "message": "Only the operator or admin can close this session"
}
```

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Session not found"
}
```

### Regras de Negócio
1. **Permissões**: Apenas o operador da sessão ou um ADMIN pode fechar a sessão
2. **Status**: A sessão deve estar com status OPEN
3. **Valores Calculados**: 
   - `total_sales`: Calculado automaticamente somando todas as vendas normais (ticket_sales)
   - `total_penalty_sales`: Calculado automaticamente somando todas as vendas de multas (penalty_ticket_sales)
   - `total_amount`: Soma total (total_sales + total_penalty_sales)
   - `total_tickets_sold`: Calculado automaticamente somando quantidade de bilhetes (normais + multas)
4. **Auditoria**: O campo `closedBy` registra automaticamente quem fechou a sessão
5. **Valor Entregue**: O campo `actual_amount_delivered` permite registrar o valor real em dinheiro que foi entregue, possibilitando conferência de caixa

### Exemplo de Uso no Frontend

```typescript
async function closeSession(sessionId: number, data: { notes?: string, actual_amount_delivered?: number }) {
  try {
    const response = await fetch(`/api/sessions/${sessionId}/close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Erro ao fechar sessão');
    }
    
    const closedSession = await response.json();
    
    // Calcular diferença se houver valor entregue
    if (closedSession.actual_amount_delivered !== null) {
      const difference = closedSession.actual_amount_delivered - closedSession.total_amount;
      console.log(`Diferença: ${difference.toFixed(2)} MT`);
    }
    
    return closedSession;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}
```

### Fluxo de Fechamento Recomendado

1. **Exibir Resumo**: Mostrar ao usuário os totais calculados antes do fechamento
2. **Solicitar Valor Real**: Pedir ao operador que digite o valor real em dinheiro
3. **Calcular Diferença**: Mostrar a diferença entre valor esperado e real
4. **Confirmar Fechamento**: Solicitar confirmação do operador
5. **Adicionar Observações**: Permitir adicionar notas sobre discrepâncias
6. **Executar Fechamento**: Chamar o endpoint com os dados

```typescript
// Exemplo de componente Reactamount);
  const [notes, setNotes] = useState('');
  
  const difference = actualAmount - session.total_amount
  
  const difference = actualAmount - session.total_sales;
  
  const handleClose = asyVendas normais: ${session.total_sales.toFixed(2)} MT\nVendas multas: ${session.total_penalty_sales.toFixed(2)} MT\nTotal esperado: ${session.total_amount
    const confirmed = window.confirm(
      `Fechar sessão?\n\nTotal esperado: ${session.total_sales.toFixed(2)} MT\nValor entregue: ${actualAmount.toFixed(2)} MT\nDiferença: ${difference.toFixed(2)} MT`
    );
    
    if (!confirmed) return;
    
    try {
      await closeSession(session.id, {
        actual_amount_delivered: actualAmount,
        notes: notes || undefined
      });
      onSuccess();
    } catch (error) {
      alert('Erro ao fechar sessão');
    }
  };
  
  return (
    <div className="modal">
      <h2>FVendas normais: {session.total_sales.toFixed(2)} MT</p>
        <p>Vendas de multas: {session.total_penalty_sales.toFixed(2)} MT</p>
        <p><strong>Total geral: {session.total_amount.toFixed(2)} MT</strong>
      <div>
        <p>Total de vendas: {session.total_sales.toFixed(2)} MT</p>
        <p>Bilhetes vendidos: {session.total_tickets_sold}</p>
      </div>
      
      <div>
        <label>Valor real entregue (MT):</label>
        <input 
          type="number" 
          step="0.01"
          value={actualAmount}
          onChange={(e) => setActualAmount(parseFloat(e.target.value) || 0)}
        />
      </div>
      
      {difference !== 0 && (
        <div className={difference > 0 ? 'text-green' : 'text-red'}>
          Diferença: {difference.toFixed(2)} MT 
          {difference > 0 ? ' (Sobra)' : ' (Falta)'}
        </div>
      )}
      
      <div>
        <label>Observações:</label>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Adicione observações sobre o fechamento..."
        />
      </div>
      
      <button onClick={handleClose}>Confirmar Fechamento</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
}
```

---