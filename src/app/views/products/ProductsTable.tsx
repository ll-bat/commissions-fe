"use client";

import {
  Card,
  IndexTable,
  useBreakpoints,
  useIndexResourceState,
  IndexTableSelectionType,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import ProductsTableFooter from "@/app/views/products/ProductsTableFooter";
import { type Range } from "@shopify/polaris/build/ts/src/utilities/index-provider/types";

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

const PRODUCTS_PER_PAGE = 10;

export default function ProductsTable() {
  const [fetchingProducts, setFetchingProducts] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filter, setFilter] = useState<ProductFilter>({
    categoryId: null,
    productName: null,
  });
  const [page, setPage] = useState<number>(1);
  const [pagesCount, setPagesCount] = useState<number>(0);
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
      setPagesCount(Math.ceil(products.length / PRODUCTS_PER_PAGE));
    } else {
      // TODO - show error
    }
    setFetchingProducts(false);
  }, [PRODUCTS_PER_PAGE]);

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
        (product) =>
          String(product.category.id) === categoryId || categoryId == null,
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

  useEffect(() => {
    setPage(1);
    setPagesCount(Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  }, [filteredProducts]);

  const currentPageItems = useMemo(() => {
    return filteredProducts.slice(
      (page - 1) * PRODUCTS_PER_PAGE,
      page * PRODUCTS_PER_PAGE,
    );
  }, [filteredProducts, page]);

  const handleSelectProducts = (
    selectionType: IndexTableSelectionType,
    toggleType: boolean,
    selection?: string | Range,
    position?: number,
  ) => {
    if (
      selectionType === IndexTableSelectionType.Page ||
      selectionType === IndexTableSelectionType.All
    ) {
      /**
       * When we have applied the filter to the table, after clicking on the select all checkbox
       * all products are selected (also those that are not visible).
       * We need to select only the products that are visible on the current page when clicking on the select all checkbox.
       */
      for (const item of filteredProducts) {
        handleSelectionChange(
          IndexTableSelectionType.Single,
          toggleType,
          String(item.id),
          position,
        );
      }
    } else {
      handleSelectionChange(selectionType, toggleType, selection, position);
    }
  };

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
        onSelectionChange={handleSelectProducts}
        headings={TABLE_HEADINGS}
        loading={fetchingProducts}
      >
        {currentPageItems.map((product, index) => (
          <ProductsTableRow
            key={String(product.id)}
            product={product}
            index={index}
            isSelected={
              selectedResources.find(
                (itemId) => String(itemId) === String(product.id),
              ) !== undefined
            }
            onPercentChange={(percent) =>
              handleProductsCommissionPercentChange(percent, [
                String(product.id),
              ])
            }
          />
        ))}
      </IndexTable>
      <ProductsTableFooter
        paginationHidden={selectedResources.length !== 0 || pagesCount < 2}
        actionsHidden={selectedResources.length === 0}
        onPercentApplyClick={(percent) =>
          handleProductsCommissionPercentChange(
            percent,
            selectedResources,
            allResourcesSelected,
          )
        }
        onRemoveFromPlanClick={handleRemoveFromPlan}
        pagination={{
          page,
          pagesCount: pagesCount,
          hasPrevious: page > 1,
          hasNext: page < pagesCount,
          onPrevious: () => page > 1 && setPage(page - 1),
          onNext: () => page < pagesCount && setPage(page + 1),
        }}
      />
    </Card>
  );
}
