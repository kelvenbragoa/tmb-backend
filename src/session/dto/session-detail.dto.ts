export class SessionDetailDto {
  id: number;
  status: string;
  opened_at: Date;
  closed_at: Date | null;
  total_sales: number;
  total_penalty_sales: number;
  total_amount: number;
  total_tickets_sold: number;
  actual_amount_delivered: number | null;
  notes: string | null;

  // Operador
  operator: {
    id: number;
    name: string;
    email: string;
  };

  // Turno
  shift: {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
  } | null;

  // Indicadores gerais
  indicators: {
    total_regular_tickets: number;
    total_penalty_tickets: number;
    total_regular_sales: number;
    total_penalty_sales: number;
    average_ticket_price: number;
    total_transactions: number;
  };

  // Vendas por tipo de bilhete
  salesByTicketType: Array<{
    ticket_type_id: number;
    ticket_type_name: string;
    quantity: number;
    total_amount: number;
    percentage: number;
  }>;

  // Vendas por rota
  salesByRoute: Array<{
    route_id: number;
    route_name: string;
    regular_tickets: number;
    penalty_tickets: number;
    total_tickets: number;
    total_amount: number;
    percentage: number;
  }>;

  // Vendas por route_ticket (combinação rota + tipo de bilhete)
  salesByRouteTicket: Array<{
    route_ticket_id: number;
    route_name: string;
    ticket_type_name: string;
    price: number;
    penalty_price: number;
    regular_tickets: number;
    penalty_tickets: number;
    total_tickets: number;
    total_amount: number;
    percentage: number;
  }>;

  // Vendas por veículo
  salesByVehicle: Array<{
    vehicle_id: number;
    vehicle_name: string;
    vehicle_plate: string;
    regular_tickets: number;
    penalty_tickets: number;
    total_tickets: number;
    total_amount: number;
    percentage: number;
  }>;

  // Vendas por hora
  salesByHour: Array<{
    hour: number;
    regular_tickets: number;
    penalty_tickets: number;
    total_tickets: number;
    total_amount: number;
  }>;

  // Histórico de vendas (últimas vendas)
  recentSales: Array<{
    id: number;
    type: 'regular' | 'penalty';
    route_name: string;
    ticket_type_name: string;
    quantity: number;
    price: number;
    total: number;
    sold_at: Date;
    customer_number: string | null;
    vehicle_plate: string | null;
    driver_name: string | null;
  }>;

  // Logs de bilhetes (últimos logs)
  recentLogs: Array<{
    id: number;
    route_name: string;
    ticket_type_name: string;
    quantity: number;
    price: number;
    total: number;
    sold_at: Date;
    ticket_sold_at: Date | null;
    customer_number: string | null;
    vehicle_plate: string | null;
    driver_name: string | null;
    reference: string | null;
    notes: string | null;
  }>;

  // Auditoria
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
  
  createdAt: Date;
  updatedAt: Date;
}
