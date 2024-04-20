export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  commissionPercent: number | null;
}