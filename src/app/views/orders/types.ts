export interface OrderProduct {
  id: string;
  price: number;
}

export interface Order {
  id: string;
  products: OrderProduct[];
  staffMemberId: string;
  date: Date;
}

export interface OrderWithCommissionSum extends Order {
  sumCommission: number;
}

export interface OrdersSummaryByDay {
  date: Date;
  ordersCount: number;
  totalSumCommission: number;
}

export interface StaffMember {
  id: string;
  fullName: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
