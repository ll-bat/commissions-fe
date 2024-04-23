import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  IndexFilters,
  useSetIndexFiltersMode,
  type IndexFiltersProps,
  Select,
} from "@shopify/polaris";
import { type ProductCategory } from "@/app/views/products/types";
import useDelayedExecution from "@/app/hooks/useDelayedExecution";

const CATEGORY_FILTER_KEY = "category";

const ProductsTableFilters: React.FC<{
  categories: Array<ProductCategory>;
  onCategoryChange: (categoryId: string) => void;
  onQueryChange: (query: string) => void;
  onFilterClear: () => void;
  sortKeyOptions: string[];
  onSortChange: (sortKey: string, isAscending: boolean) => void;
}> = ({
  categories,
  onCategoryChange,
  onQueryChange,
  onFilterClear,
  sortKeyOptions,
  onSortChange,
}) => {
  const [selected, setSelected] = useState<number>(0);
  const [queryValue, setQueryValue] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >();
  const [sortSelected, setSortSelected] = useState<Array<string>>([
    sortKeyOptions.length > 0 ? `${sortKeyOptions[0]} asc` : "Name asc",
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
      (category) => String(category.id) === selectedCategoryId,
    );
    appliedFilters.push({
      key,
      label: `Category: ${categoryObject?.name}`,
      onRemove: handleCategoriesRemove,
    });
  }

  const filterCategories = useMemo(() => {
    return categories.map((category) => ({
      value: String(category.id),
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

  const handleSortChange = useCallback(
    (value: string[]) => {
      const firstSortOption = value[0];
      setSortSelected([firstSortOption]);

      const [...sortKeyProps] = firstSortOption.split(" ");
      const sortDirection = sortKeyProps[sortKeyProps.length - 1];
      sortKeyProps.pop();
      const sortKey = sortKeyProps.join(" ")

      onSortChange(sortKey, sortDirection === "asc");
    },
    [setSortSelected, onSortChange],
  );

  const sortOptions = useMemo((): IndexFiltersProps["sortOptions"] => {
    const options: IndexFiltersProps["sortOptions"] = [];
    for (const option of sortKeyOptions) {
      options.push({
        label: option,
        value: `${option} asc`,
        directionLabel: "Ascending",
      });
      options.push({
        label: option,
        value: `${option} desc`,
        directionLabel: "Descending",
      });
    }
    return options;
  }, [sortKeyOptions]);

  return (
    <IndexFilters
      sortOptions={sortOptions}
      sortSelected={sortSelected}
      queryValue={queryValue}
      queryPlaceholder="Searching in all"
      onQueryChange={handleFiltersQueryChange}
      onQueryClear={() => setQueryValue("")}
      onSort={handleSortChange}
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
