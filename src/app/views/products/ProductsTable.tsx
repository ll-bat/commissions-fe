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
import {
  type Product,
  type ProductCategory,
  type SortFunction,
} from "@/app/views/products/types";
import { type Result } from "@/app/types/requestTypes";
import { type UnknownObject } from "@/app/types/generalTypes";
import ProductsTableRow from "@/app/views/products/ProductsTableRow";
import { returnSame } from "@/app/utils";
import ProductsService from "@/app/views/products/ProductsService";
import ProductsTableFilters from "@/app/views/products/ProductsTableFilters";
import { useProductCommissions } from "@/app/hooks/useProductCommissions";
import ProductsTableFooter from "@/app/views/products/ProductsTableActionsRow";

type ProductFilter = {
  categoryId: string | null;
  productName: string | null;
};

const TABLE_HEADINGS: NonEmptyArray<IndexTableHeading> = [
  { title: "Name" },
  { title: "Category" },
  { title: "Price" },
  { title: "Commission Percent" },
];

const SORT_OPTIONS: Record<string, SortFunction<Product>> = {
  Name: (a, b) => a.name.localeCompare(b.name),
  Category: (a, b) => {
    return a.category.name.localeCompare(b.category.name);
  },
  Price: (a, b) => a.price - b.price,
  "Commission Percent": (a, b) => {
    return (a.commissionPercent ?? 0) - (b.commissionPercent ?? 0);
  },
};

export default function ProductsTable() {
  const [fetchingProducts, setFetchingProducts] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filter, setFilter] = useState<ProductFilter>({
    categoryId: null,
    productName: null,
  });
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
      setFilteredProducts(products);
    } else {
      // TODO - show error
    }
    setFetchingProducts(false);
  }, []);

  const getCategories = useCallback(async () => {
    const { ok, result } = await ProductsService.getCategories();
    if (ok) {
      setCategories(result!);
    } else {
      // TODO - show error
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getProducts();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getCategories();
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

  const filterProductsByCategory = useCallback(
    (products: Product[], categoryId: string | null) =>
      products.filter(
        (product) => product.category.id === categoryId || categoryId == null,
      ),
    [],
  );

  const filterProductsByName = useCallback(
    (products: Product[], productName: string | null) =>
      productName
        ? products.filter((product) => product.name.includes(productName))
        : products,
    [],
  );

  useEffect(() => {
    let filteredProducts = filterProductsByCategory(
      products,
      filter.categoryId,
    );
    filteredProducts = filterProductsByName(
      filteredProducts,
      filter.productName,
    );
    setFilteredProducts(filteredProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, filterProductsByCategory, filterProductsByName]);

  const handleProductsCommissionPercentChange = (
    percent: number | null,
    productIds: Array<string>,
    applyToAllProducts = false,
  ) => {
    const toUpdateProductIds = applyToAllProducts
      ? filteredProducts.map((product) => product.id)
      : productIds;
    const toUpdateProductIdsMapper: Record<string, true> = {};
    for (const id of toUpdateProductIds) {
      toUpdateProductIdsMapper[id] = true;
    }

    const updateProductsFn = (prev: Product[]) =>
      prev.map((product): Product => {
        let newCommissionPercent = product.commissionPercent;
        if (toUpdateProductIdsMapper[product.id]) {
          newCommissionPercent = percent;
        }
        return {
          ...product,
          commissionPercent: newCommissionPercent,
        };
      });
    setProducts(updateProductsFn);
    setFilteredProducts(updateProductsFn);
    clearSelection();
  };

  const handleRemoveFromPlan = () => {
    handleProductsCommissionPercentChange(null, selectedResources);
    clearSelection();
  };

  const handleCategoryFilterChange = useCallback(
    (categoryId: string) => {
      setFilter((prev) => ({ ...prev, categoryId }));
    },
    [setFilter],
  );

  const handleFilterProductNameChange = useCallback(
    (productName: string) => {
      setFilter((prev) => ({ ...prev, productName }));
    },
    [setFilter],
  );

  const handleFilterClear = useCallback(() => {
    setFilter((prev) => ({ ...prev, categoryId: null, productName: null }));
  }, []);

  const handleSortChange = useCallback(
    (sortKey: keyof typeof SORT_OPTIONS, isAscending: boolean) => {
      const sortedProducts = [...filteredProducts].sort((a, b) => {
        const sortFn = SORT_OPTIONS[sortKey];
        return isAscending ? sortFn(a, b) : sortFn(b, a);
      });
      setFilteredProducts(sortedProducts);
    },
    [filteredProducts, setFilteredProducts],
  );

  return (
    <Card padding="0">
      <ProductsTableFilters
        categories={categories}
        onCategoryChange={handleCategoryFilterChange}
        onQueryChange={handleFilterProductNameChange}
        onFilterClear={handleFilterClear}
        sortKeyOptions={Object.keys(SORT_OPTIONS)}
        onSortChange={handleSortChange}
      />
      <IndexTable
        condensed={useBreakpoints().smDown}
        itemCount={filteredProducts.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={TABLE_HEADINGS}
        loading={fetchingProducts}
      >
        {filteredProducts.map((product, index) => (
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
        onPercentApplyClick={(percent) =>
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
