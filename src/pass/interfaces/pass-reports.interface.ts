export interface RevenueByMonthItem {
  year: number;
  month: string;
  totalAmount: number;
  paymentCount: number;
}

export interface RevenueByCategoryItem {
  categoryId: number;
  categoryName: string;
  totalAmount: number;
  paymentCount: number;
}

export interface RevenueByDestinationItem {
  destinationId: number;
  destinationName: string;
  totalAmount: number;
  paymentCount: number;
}

export interface RevenueByOperatorItem {
  cashierId: number;
  cashierName: string;
  totalAmount: number;
  paymentCount: number;
}

export interface PassStatusCountItem {
  status: string;
  count: number;
}

export interface PassReportsSummary {
  newPasses: number;
  renewals: number;
  activePasses: number;
  expiredPasses: number;
  suspendedPasses: number;
  cancelledPasses: number;
  notRenewedInMonth: number;
}
