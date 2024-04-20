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
import { type Product } from "@/app/types/productTypes";
import { type Result } from "@/app/types/requestTypes";
import { type UnknownObject } from "@/app/types/generalTypes";
import ProductsTableRow from "@/app/views/products-table/ProductsTableRow";
import ProductsTableActionsRow from "@/app/views/products-table/ProductsTableActionsRow";
import { returnSame } from "@/app/utils";
import ProductService from "@/app/services/ProductService";
import ProductsTableFilters from "@/app/views/products-table/ProductsTableFilters";

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

  const getProducts = useCallback(async () => {
    setFetchingProducts(true);
    const { ok, result }: Result<Product[]> =
      await ProductService.getProducts();
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

  const handleApplyCommissionToSelectedProducts = (percent: number | null) => {
    // TODO make sure when `all` is selected the commission is applied to everyone
    setProducts((prev: Product[]): Product[] =>
      prev.map((product: Product): Product => {
        let newCommissionPercent = product.commissionPercent;
        if (allResourcesSelected || selectedResources.includes(product.id)) {
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
    handleApplyCommissionToSelectedProducts(null);
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
          />
        ))}
        <ProductsTableActionsRow
          hidden={selectedResources.length === 0}
          onApplyClick={handleApplyCommissionToSelectedProducts}
          onRemoveFromPlanClick={handleRemoveFromPlan}
        />
      </IndexTable>
    </Card>
  );
}
