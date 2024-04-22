import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  IndexFilters,
  useSetIndexFiltersMode,
  type IndexFiltersProps,
  Select,
} from "@shopify/polaris";
import { type ProductCategory } from "@/app/views/products/types";
import useDelayedExecution from "@/app/hooks/useDelayedExecution";

const SORT_OPTIONS: IndexFiltersProps["sortOptions"] = [
  { label: "Product", value: "product asc", directionLabel: "Ascending" },
];

const CATEGORY_FILTER_KEY = "category";

const ProductsTableFilters: React.FC<{
  categories: Array<ProductCategory>;
  onCategoryChange: (categoryId: string) => void;
  onQueryChange: (query: string) => void;
  onFilterClear: () => void;
}> = ({ categories, onCategoryChange, onQueryChange, onFilterClear }) => {
  const [selected, setSelected] = useState<number>(0);
  const [queryValue, setQueryValue] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >();
  const [sortSelected, setSortSelected] = useState<Array<string>>([
    SORT_OPTIONS[0].value,
  ]);
  const { mode, setMode } = useSetIndexFiltersMode();

  useEffect(() => {
    onCategoryChange(selectedCategoryId!);
  }, [onCategoryChange, selectedCategoryId]);

  const handleQueryChange = useCallback(
    () => onQueryChange(queryValue),
    [onQueryChange, queryValue],
  );

  useDelayedExecution<string>(queryValue, handleQueryChange, 700);

  const handleCategoriesChange = useCallback(
    (selected: string) => setSelectedCategoryId(selected),
    [],
  );

  const handleCategoriesRemove = useCallback(
    () => setSelectedCategoryId(undefined),
    [],
  );

  const handleFiltersQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    [],
  );

  const appliedFilters: IndexFiltersProps["appliedFilters"] = [];
  if (selectedCategoryId !== undefined) {
    const key = CATEGORY_FILTER_KEY;
    const categoryObject = categories.find(
      (category) => category.id === selectedCategoryId,
    );
    appliedFilters.push({
      key,
      label: `Category: ${categoryObject?.name}`,
      onRemove: handleCategoriesRemove,
    });
  }

  const filterCategories = useMemo(() => {
    return categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  }, [categories]);

  const filters = [
    {
      key: CATEGORY_FILTER_KEY,
      label: "Category",
      filter: (
        <Select
          label="Category"
          options={filterCategories}
          onChange={handleCategoriesChange}
          value={selectedCategoryId}
        />
      ),
      shortcut: true,
    },
  ];

  return (
    <IndexFilters
      sortOptions={SORT_OPTIONS}
      sortSelected={sortSelected}
      queryValue={queryValue}
      queryPlaceholder="Searching in all"
      onQueryChange={handleFiltersQueryChange}
      onQueryClear={() => setQueryValue("")}
      onSort={setSortSelected}
      tabs={[]}
      selected={selected}
      onSelect={setSelected}
      filters={filters}
      appliedFilters={appliedFilters}
      onClearAll={onFilterClear}
      mode={mode}
      setMode={setMode}
    />
  );
};

export default ProductsTableFilters;
