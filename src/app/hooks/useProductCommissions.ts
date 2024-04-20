import { useContext } from "react";
import { ProductCommissionsContext } from "@/app/context/ProductCommissionsContext";

export const useProductCommissions = () => useContext(ProductCommissionsContext);
