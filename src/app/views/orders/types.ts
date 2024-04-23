export interface OrderProduct {
  id: number;
  price: number;
}

export interface Order {
  id: number;
  products: OrderProduct[];
  staffMember: StaffMember;
  date: string;
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
  id: number;
  fullName: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
