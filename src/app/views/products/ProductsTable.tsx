"use client";

import {
  IndexTable,
  Card,
  useIndexResourceState,
  useBreakpoints,
} from "@shopify/polaris";
import React, { useState, useCallback, useEffect } from "react";
import { type IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { type NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { type Product } from "@/app/views/products/types";
import { type Result } from "@/app/types/requestTypes";
import { type UnknownObject } from "@/app/types/generalTypes";
import ProductsTableRow from "@/app/views/products/ProductsTableRow";
import { returnSame } from "@/app/utils";
import ProductsService from "@/app/views/products/ProductsService";
import ProductsTableFilters from "@/app/views/products/ProductsTableFilters";
import { useProductCommissions } from "@/app/hooks/useProductCommissions";
import type { BulkActionsProps } from "@shopify/polaris/build/ts/src/components/BulkActions";
import ProductsTableFooter from "@/app/views/products/ProductsTableActionsRow";

const TABLE_HEADINGS: NonEmptyArray<IndexTableHeading> = [
  { title: "Name" },
  { title: "Category" },
  { title: "Price" },
  { title: "Commission Percent" },
];

export default function ProductsTable() {
  const [fetchingProducts, setFetchingProducts] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
    clearSelection,
  } = useIndexResourceState(returnSame<UnknownObject[]>(products));
  const { updateProductCommissions } = useProductCommissions();

  const getProducts = useCallback(async () => {
    setFetchingProducts(true);
    const { ok, result }: Result<Product[]> =
      await ProductsService.getProducts();
    if (ok) {
      const products: Product[] = result!;
      setProducts(products);
    } else {
      // TODO - show error
    }
    setFetchingProducts(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const productCommissions = products.reduce(
      (acc, product) => ({
        ...acc,
        [product.id]: product.commissionPercent,
      }),
      {},
    );
    updateProductCommissions(productCommissions);
  }, [products, updateProductCommissions]);

  const handleProductsCommissionPercentChange = (
    percent: number | null,
    productIds: Array<string>,
    applyToAllProducts: boolean = false,
  ) => {
    setProducts((prev: Product[]): Product[] =>
      prev.map((product): Product => {
        let newCommissionPercent = product.commissionPercent;
        if (applyToAllProducts || productIds.includes(product.id)) {
          newCommissionPercent = percent;
        }
        return {
          ...product,
          commissionPercent: newCommissionPercent,
        };
      }),
    );
    clearSelection();
  };

  const handleRemoveFromPlan = () => {
    handleProductsCommissionPercentChange(null, selectedResources);
    clearSelection();
  };

  return (
    <Card padding="0">
      <ProductsTableFilters />
      <IndexTable
        condensed={useBreakpoints().smDown}
        itemCount={products.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={TABLE_HEADINGS}
        loading={fetchingProducts}
      >
        {products.map((product, index) => (
          <ProductsTableRow
            key={product.id}
            product={product}
            index={index}
            isSelected={selectedResources.includes(product.id)}
            onPercentChange={(percent) =>
              handleProductsCommissionPercentChange(percent, [product.id])
            }
          />
        ))}
      </IndexTable>
      <ProductsTableFooter
        hidden={selectedResources.length === 0}
        onApplyClick={(percent) =>
          handleProductsCommissionPercentChange(
            percent,
            selectedResources,
            allResourcesSelected,
          )
        }
        onRemoveFromPlanClick={handleRemoveFromPlan}
      />
    </Card>
  );
}
