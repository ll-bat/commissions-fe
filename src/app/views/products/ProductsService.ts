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
};

export default productsService;
