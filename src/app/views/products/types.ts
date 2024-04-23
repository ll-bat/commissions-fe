export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  commissionPercent: number | null;
}

export type ProductCommissionsType = Record<string, number | null>;

export interface ProductCategory {
  id: number;
  name: string;
}

export type SortFunction<T> = (a: T, b: T) => number;
