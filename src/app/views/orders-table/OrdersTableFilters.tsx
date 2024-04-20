import React, { useState } from "react";
import {
  IndexFilters,
  type IndexFiltersProps,
  useSetIndexFiltersMode,
} from "@shopify/polaris";

const SORT_OPTIONS: IndexFiltersProps["sortOptions"] = [];

const OrdersTableFilters: React.FC = () => {
  const [selected, setSelected] = useState<number>(0);
  const [sortSelected, setSortSelected] = useState<Array<string>>([
    "order asc",
  ]);
  const [queryValue, setQueryValue] = useState<string>("");
  const { mode, setMode } = useSetIndexFiltersMode();

  return (
    <IndexFilters
      sortOptions={SORT_OPTIONS}
      sortSelected={sortSelected}
      queryValue={queryValue}
      queryPlaceholder="Searching in all"
      onQueryChange={(value: string) => setQueryValue(value)}
      onQueryClear={() => setQueryValue("")}
      onSort={setSortSelected}
      cancelAction={{
        onAction: () => null,
        disabled: false,
        loading: false,
      }}
      tabs={[]}
      selected={selected}
      onSelect={setSelected}
      canCreateNewView
      filters={[]}
      appliedFilters={[]}
      onClearAll={() => null}
      mode={mode}
      setMode={setMode}
    />
  );
};

export default OrdersTableFilters;
