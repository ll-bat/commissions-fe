export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  commissionPercent: number | null;
}

export type ProductCommissionsType = Record<string, number | null>;

export interface ProductCategory {
  id: string;
  name: string;
}

export type SortFunction<T> = (a: T, b: T) => number;
