export interface Order {
  id: string;
  productIds: string[];
  staffMemberId: string;
  quantity: number;
  day: Date;
}

export interface OrderWithCommissionSum extends Order {
  sumCommission: number;
}
