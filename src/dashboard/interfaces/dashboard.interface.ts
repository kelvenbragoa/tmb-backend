export interface DashboardOverview {
  totalUsers: number;
  totalOperators: number;
  totalAdmins: number;
  activeUsers: number;
  totalRoutes: number;
  activeRoutes: number;
  totalVehicles: number;
  activeVehicles: number;
  totalTicketTypes: number;
  activeTicketTypes: number;
  totalSessions: number;
  activeSessions: number;
  closedSessions: number;
  totalSales: number;
  totalTicketsSold: number;
  averageTicketPrice: number;
  totalRevenue: number;
}

export interface SalesChart {
  date: string;
  sales_count: number;
  revenue: number;
  tickets_sold: number;
}

export interface RoutePerformance {
  route_id: number;
  route_name: string;
  total_sales: number;
  total_revenue: number;
  total_tickets: number;
  sessions_count: number;
  average_revenue_per_session: number;
}

export interface OperatorPerformance {
  operator_id: number;
  operator_name: string;
  total_sales: number;
  total_revenue: number;
  total_tickets: number;
  sessions_count: number;
  average_revenue_per_session: number;
  hours_worked: number;
}

export interface VehiclePerformance {
  vehicle_id: number;
  vehicle_name: string;
  license_plate: string;
  total_sales: number;
  total_revenue: number;
  total_tickets: number;
  sessions_count: number;
  utilization_rate: number;
}

export interface TicketTypeAnalysis {
  ticket_type_id: number;
  ticket_type_name: string;
  total_sold: number;
  total_revenue: number;
  percentage_of_total: number;
  average_price: number;
}

export interface SessionAnalysis {
  average_session_duration: number;
  average_sales_per_session: number;
  peak_hours: Array<{
    hour: number;
    sales_count: number;
  }>;
  busiest_routes: Array<{
    route_id: number;
    route_name: string;
    sessions_count: number;
  }>;
}

export interface RevenueAnalysis {
  total_revenue: number;
  revenue_growth: number;
  revenue_by_payment_method: Array<{
    method: string;
    amount: number;
    percentage: number;
  }>;
  revenue_by_route: Array<{
    route_id: number;
    route_name: string;
    revenue: number;
    percentage: number;
  }>;
}

export interface DashboardData {
  overview: DashboardOverview;
  salesChart: SalesChart[];
  routePerformance: RoutePerformance[];
  operatorPerformance: OperatorPerformance[];
  vehiclePerformance: VehiclePerformance[];
  ticketTypeAnalysis: TicketTypeAnalysis[];
  sessionAnalysis: SessionAnalysis;
  revenueAnalysis: RevenueAnalysis;
  filters: {
    applied_period: string;
    start_date: string;
    end_date: string;
    route_ids: number[];
    vehicle_ids: number[];
    operator_ids: number[];
    ticket_type_ids: number[];
  };
}