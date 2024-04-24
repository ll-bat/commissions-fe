import { type Result } from "@/app/types/requestTypes";
import { type Product, type ProductCategory } from "@/app/views/products/types";
import axiosClient from "@/app/axios";

const productsService = {
  async getProducts(): Promise<Result<Product[]>> {
    return await axiosClient.get("/products");
  },

  async getCategories(): Promise<Result<ProductCategory[]>> {
    return await axiosClient.get("/categories");
  },

  async updateProductsCommissionPercent(
    productIds: Array<string | number>,
    commissionPercent: number | null,
  ): Promise<Result<null>> {
    return await axiosClient.put("/products/commission-percent", {
      productIds,
      commissionPercent,
    });
  },
};

export default productsService;
