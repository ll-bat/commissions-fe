import { type Result } from "@/app/types/requestTypes";
import { type Product, type ProductCategory } from "@/app/views/products/types";

const STATIC_CATEGORIES: ProductCategory[] = [
  {
    id: "#1",
    name: "Category 1",
  },
  {
    id: "#2",
    name: "Category 2",
  },
  {
    id: "#3",
    name: "Category 3",
  },
];

const STATIC_PRODUCTS_DATA: Product[] = [
  {
    id: "#1",
    name: "Product 1",
    category: STATIC_CATEGORIES[0],
    price: 100,
    commissionPercent: null,
  },
  {
    id: "#2",
    name: "Product 2",
    category: STATIC_CATEGORIES[1],
    price: 200,
    commissionPercent: null,
  },
  {
    id: "#3",
    name: "Product 3",
    category: STATIC_CATEGORIES[2],
    price: 300,
    commissionPercent: null,
  },
];

const productsService = {
  async getProducts(): Promise<Result<Product[]>> {
    return Promise.resolve({
      ok: true,
      result: STATIC_PRODUCTS_DATA,
      errors: null,
    });
  },

  async getCategories(): Promise<Result<ProductCategory[]>> {
    return Promise.resolve({
      ok: true,
      result: STATIC_CATEGORIES,
      errors: null,
    });
  },
};

export default productsService;
