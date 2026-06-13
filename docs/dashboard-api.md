# 📊 API de Dashboard - Documentação Completa

## 🔗 Base URL
```
http://localhost:3000/api/v1/dashboard
```

## 🔑 Autenticação
Todos os endpoints requerem autenticação JWT via header:
```
Authorization: Bearer <token>
```

## 📋 Endpoints Disponíveis

### 1. Dashboard Completo
**GET** `/dashboard`

Retorna todos os dados do dashboard em uma única requisição.

**Permissões:** ADMIN, OPERATOR

**Parâmetros de Query:**
- `period` (opcional): Período predefinido
  - Valores: `today`, `yesterday`, `last_7_days`, `last_30_days`, `last_90_days`, `this_month`, `last_month`, `this_year`, `custom`
  - Padrão: `last_30_days`
- `start_date` (opcional): Data de início (formato: YYYY-MM-DD) - obrigatório se period=custom
- `end_date` (opcional): Data de fim (formato: YYYY-MM-DD) - obrigatório se period=custom
- `route_ids` (opcional): IDs das rotas separados por vírgula (ex: `1,2,3`)
- `vehicle_ids` (opcional): IDs dos veículos separados por vírgula (ex: `1,2,3`)
- `operator_ids` (opcional): IDs dos operadores separados por vírgula (ex: `1,2,3`)
- `ticket_type_ids` (opcional): IDs dos tipos de ticket separados por vírgula (ex: `1,2,3`)

**Exemplo de Requisição:**
```bash
curl -X GET "http://localhost:3000/api/v1/dashboard?period=last_7_days&route_ids=1,2" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Resposta:**
```json
{
  "overview": {
    "totalUsers": 25,
    "totalOperators": 20,
    "totalAdmins": 5,
    "activeUsers": 23,
    "totalRoutes": 15,
    "activeRoutes": 12,
    "totalVehicles": 8,
    "activeVehicles": 7,
    "totalTicketTypes": 5,
    "activeTicketTypes": 5,
    "totalSessions": 145,
    "activeSessions": 3,
    "closedSessions": 142,
    "totalSales": 1250,
    "totalTicketsSold": 2300,
    "averageTicketPrice": 8.50,
    "totalRevenue": 19550.00
  },
  "salesChart": [
    {
      "date": "2025-11-25",
      "sales_count": 85,
      "revenue": 425.00,
      "tickets_sold": 120
    }
  ],
  "routePerformance": [
    {
      "route_id": 1,
      "route_name": "Maputo - Matola",
      "total_sales": 450,
      "total_revenue": 2250.00,
      "total_tickets": 600,
      "sessions_count": 25,
      "average_revenue_per_session": 90.00
    }
  ],
  "operatorPerformance": [
    {
      "operator_id": 2,
      "operator_name": "João Operador",
      "total_sales": 320,
      "total_revenue": 1600.00,
      "total_tickets": 450,
      "sessions_count": 18,
      "average_revenue_per_session": 88.89,
      "hours_worked": 144
    }
  ],
  "vehiclePerformance": [
    {
      "vehicle_id": 1,
      "vehicle_name": "Ônibus 001",
      "license_plate": "ABC-1234",
      "total_sales": 280,
      "total_revenue": 1400.00,
      "total_tickets": 380,
      "sessions_count": 15,
      "utilization_rate": 75.5
    }
  ],
  "ticketTypeAnalysis": [
    {
      "ticket_type_id": 1,
      "ticket_type_name": "Adulto",
      "total_sold": 1200,
      "total_revenue": 12000.00,
      "percentage_of_total": 65.2,
      "average_price": 10.00
    }
  ],
  "sessionAnalysis": {
    "average_session_duration": 480,
    "average_sales_per_session": 8.6,
    "peak_hours": [
      {
        "hour": 8,
        "sales_count": 150
      },
      {
        "hour": 17,
        "sales_count": 135
      }
    ],
    "busiest_routes": [
      {
        "route_id": 1,
        "route_name": "Maputo - Matola",
        "sessions_count": 45
      }
    ]
  },
  "revenueAnalysis": {
    "total_revenue": 19550.00,
    "revenue_growth": 15.3,
    "revenue_by_payment_method": [
      {
        "method": "cash",
        "amount": 19550.00,
        "percentage": 100
      }
    ],
    "revenue_by_route": [
      {
        "route_id": 1,
        "route_name": "Maputo - Matola",
        "revenue": 8500.00,
        "percentage": 43.5
      }
    ]
  },
  "filters": {
    "applied_period": "last_7_days",
    "start_date": "2025-11-25",
    "end_date": "2025-12-01",
    "route_ids": [1, 2],
    "vehicle_ids": [],
    "operator_ids": [],
    "ticket_type_ids": []
  }
}
```

---

### 2. Visão Geral (Overview)
**GET** `/dashboard/overview`

Retorna apenas os indicadores principais do dashboard.

**Permissões:** ADMIN, OPERATOR

**Parâmetros:** Mesmos filtros do endpoint principal

**Exemplo:**
```bash
curl -X GET "http://localhost:3000/api/v1/dashboard/overview?period=today" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Gráfico de Vendas
**GET** `/dashboard/sales-chart`

Retorna dados para gráfico de vendas ao longo do tempo.

**Permissões:** ADMIN, OPERATOR

**Exemplo:**
```bash
curl -X GET "http://localhost:3000/api/v1/dashboard/sales-chart?period=last_30_days" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Resposta:**
```json
[
  {
    "date": "2025-11-25",
    "sales_count": 85,
    "revenue": 425.00,
    "tickets_sold": 120
  },
  {
    "date": "2025-11-26",
    "sales_count": 92,
    "revenue": 460.00,
    "tickets_sold": 135
  }
]
```

---

### 4. Performance das Rotas
**GET** `/dashboard/route-performance`

Retorna performance de cada rota ordenada por receita.

**Permissões:** ADMIN, OPERATOR

**Exemplo:**
```bash
curl -X GET "http://localhost:3000/api/v1/dashboard/route-performance?period=this_month" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. Performance dos Operadores
**GET** `/dashboard/operator-performance`

Retorna performance de cada operador. **Apenas para ADMIN**.

**Permissões:** ADMIN

**Exemplo:**
```bash
curl -X GET "http://localhost:3000/api/v1/dashboard/operator-performance?period=last_30_days" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. Performance dos Veículos
**GET** `/dashboard/vehicle-performance`

Retorna performance de cada veículo incluindo taxa de utilização.

**Permissões:** ADMIN, OPERATOR

**Exemplo:**
```bash
curl -X GET "http://localhost:3000/api/v1/dashboard/vehicle-performance?vehicle_ids=1,2,3" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. Análise de Tipos de Ticket
**GET** `/dashboard/ticket-analysis`

Retorna análise detalhada dos tipos de ticket mais vendidos.

**Permissões:** ADMIN, OPERATOR

**Exemplo:**
```bash
curl -X GET "http://localhost:3000/api/v1/dashboard/ticket-analysis?period=this_year" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. Análise de Sessões
**GET** `/dashboard/session-analysis`

Retorna análise sobre duração de sessões, horários de pico e rotas mais movimentadas.

**Permissões:** ADMIN, OPERATOR

**Exemplo:**
```bash
curl -X GET "http://localhost:3000/api/v1/dashboard/session-analysis?period=last_90_days" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. Análise de Receita
**GET** `/dashboard/revenue-analysis`

Retorna análise detalhada de receita com crescimento e distribuição. **Apenas para ADMIN**.

**Permissões:** ADMIN

**Exemplo:**
```bash
curl -X GET "http://localhost:3000/api/v1/dashboard/revenue-analysis?period=custom&start_date=2025-11-01&end_date=2025-11-30" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎨 Sugestões para Frontend

### 1. Cards de Overview
```jsx
// Exibir os principais KPIs em cards
<div className="overview-grid">
  <KPICard title="Total de Vendas" value={overview.totalSales} icon="📊" />
  <KPICard title="Receita Total" value={`$${overview.totalRevenue}`} icon="💰" />
  <KPICard title="Tickets Vendidos" value={overview.totalTicketsSold} icon="🎫" />
  <KPICard title="Sessões Ativas" value={overview.activeSessions} icon="🔄" />
</div>
```

### 2. Gráfico de Vendas
```jsx
// Usar biblioteca como Chart.js, Recharts ou D3
<LineChart data={salesChart}>
  <XAxis dataKey="date" />
  <YAxis />
  <Line dataKey="revenue" stroke="#8884d8" />
  <Line dataKey="sales_count" stroke="#82ca9d" />
</LineChart>
```

### 3. Tabela de Performance
```jsx
// Tabela ordenável para performance de rotas/operadores
<DataTable 
  data={routePerformance}
  columns={[
    { key: 'route_name', label: 'Rota' },
    { key: 'total_revenue', label: 'Receita', format: 'currency' },
    { key: 'sessions_count', label: 'Sessões' }
  ]}
  sortable
/>
```

### 4. Filtros Avançados
```jsx
<FilterPanel>
  <DateRangePicker 
    presets={['today', 'last_7_days', 'last_30_days']}
    onCustomRange={(start, end) => setFilters({...filters, start_date: start, end_date: end})}
  />
  <MultiSelect 
    options={routes}
    value={filters.route_ids}
    onChange={(ids) => setFilters({...filters, route_ids: ids})}
    placeholder="Selecionar Rotas"
  />
  <MultiSelect 
    options={vehicles}
    value={filters.vehicle_ids}
    onChange={(ids) => setFilters({...filters, vehicle_ids: ids})}
    placeholder="Selecionar Veículos"
  />
</FilterPanel>
```

### 5. Gráficos Sugeridos

#### Gráfico de Pizza - Tipos de Ticket
```jsx
<PieChart data={ticketTypeAnalysis.map(item => ({
  name: item.ticket_type_name,
  value: item.percentage_of_total
}))} />
```

#### Gráfico de Barras - Horários de Pico
```jsx
<BarChart data={sessionAnalysis.peak_hours}>
  <XAxis dataKey="hour" />
  <YAxis />
  <Bar dataKey="sales_count" fill="#8884d8" />
</BarChart>
```

#### Mapa de Calor - Performance por Hora/Dia
```jsx
// Usar dados do salesChart agrupados por hora e dia
<HeatMap 
  data={processHeatmapData(salesChart)}
  xAxisLabels={hours}
  yAxisLabels={days}
/>
```

---

## 🚀 Exemplos de Uso

### 1. Dashboard Principal (Administrador)
```bash
# Buscar dados completos dos últimos 30 dias
curl -X GET "http://localhost:3000/api/v1/dashboard?period=last_30_days" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Performance de Rota Específica
```bash
# Analisar apenas a rota Maputo-Matola no último mês
curl -X GET "http://localhost:3000/api/v1/dashboard/route-performance?period=this_month&route_ids=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Relatório Semanal
```bash
# Dados da semana passada para relatório
curl -X GET "http://localhost:3000/api/v1/dashboard?period=custom&start_date=2025-11-25&end_date=2025-12-01" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Monitoramento de Operador
```bash
# Performance de operador específico (admin only)
curl -X GET "http://localhost:3000/api/v1/dashboard/operator-performance?operator_ids=2&period=today" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ⚠️ Notas Importantes

1. **Permissões**: Operadores não têm acesso aos endpoints de performance de operadores e análise de receita
2. **Cache**: Considere implementar cache para queries pesadas em produção
3. **Paginação**: Para datasets grandes, implemente paginação nos resultados
4. **Timezone**: Todas as datas são retornadas em UTC, ajuste no frontend conforme necessário
5. **Performance**: Use os filtros para reduzir o volume de dados processados

---

## 🔧 Códigos de Erro

- `400 Bad Request`: Parâmetros inválidos (ex: start_date sem end_date)
- `401 Unauthorized`: Token inválido ou ausente
- `403 Forbidden`: Usuário sem permissão para acessar o endpoint
- `500 Internal Server Error`: Erro no servidor

---

## 📱 Implementação Mobile

Para aplicações mobile, considere:

1. **Dados Reduzidos**: Use endpoints específicos em vez do dashboard completo
2. **Offline**: Cache dados localmente para visualização offline
3. **Sync**: Sincronize apenas quando conectado
4. **Performance**: Implemente lazy loading para gráficos complexos