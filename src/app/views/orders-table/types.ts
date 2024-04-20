export interface OrderProduct {
  id: string;
  price: number;
}

export interface Order {
  id: string;
  products: OrderProduct[];
  staffMemberId: string;
  day: Date;
}

export interface OrderWithCommissionSum extends Order {
  sumCommission: number;
}
