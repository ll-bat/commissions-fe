import { createContext, type ReactNode, useCallback, useState } from "react";
import { type ProductCommissionsType } from "@/app/views/products-table/types";

// TODO - is adding `ProductCommissionsType` to `views/../types` the best place?

type ProductCommissionContextType = {
  productCommissions: ProductCommissionsType;
  updateProductCommissions: (
    productCommissions: ProductCommissionsType,
  ) => void;
};

const productCommissionsContextDefaultValues: ProductCommissionContextType = {
  productCommissions: {},
  updateProductCommissions: () => null,
};

export const ProductCommissionsContext =
  createContext<ProductCommissionContextType>(
    productCommissionsContextDefaultValues,
  );

export function ProductCommissionsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [productCommissions, setProductCommissions] =
    useState<ProductCommissionsType>(
      productCommissionsContextDefaultValues.productCommissions,
    );

  const updateProductCommissions = useCallback(
    (productCommissions: ProductCommissionsType) => {
      setProductCommissions((prev) => ({
        ...prev,
        ...productCommissions,
      }));
    },
    [setProductCommissions],
  );

  const values: ProductCommissionContextType = {
    productCommissions,
    updateProductCommissions,
  };

  return (
    <ProductCommissionsContext.Provider value={values}>
      {children}
    </ProductCommissionsContext.Provider>
  );
}
