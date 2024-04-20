import { type Result } from "@/app/types/requestTypes";
import { type Product } from "@/app/views/products-table/types";

const STATIC_PRODUCTS_DATA: Product[] = [
  {
    id: "#1",
    name: "Product 1",
    category: "Category 1",
    price: 100,
    commissionPercent: 10,
  },
  {
    id: "#2",
    name: "Product 2",
    category: "Category 2",
    price: 200,
    commissionPercent: 20,
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
};

export default productsService;
