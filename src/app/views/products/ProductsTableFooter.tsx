import React, { useCallback, useEffect, useState } from "react";
import { Button, Pagination, TextField } from "@shopify/polaris";
import { type UnknownFunction } from "@/app/types/generalTypes";
import { normalizePercent } from "@/app/views/products/utils";
import EnterKeyListenerDiv from "@/app/components/EnterKeyListenerDiv";

const ProductsTableFooter: React.FC<{
  pagination: {
    page: number;
    pagesCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
    onNext: UnknownFunction;
    onPrevious: UnknownFunction;
  };
  paginationHidden: boolean;
  actionsHidden: boolean;
  onPercentApplyClick: (percent: number | null) => unknown;
  onRemoveFromPlanClick: UnknownFunction;
}> = ({
  pagination,
  paginationHidden,
  actionsHidden,
  onPercentApplyClick,
  onRemoveFromPlanClick,
}) => {
  const [percent, setPercent] = useState<number | null>(null);
  const handlePercentChange = useCallback((value: string) => {
    setPercent(normalizePercent(value));
  }, []);

  useEffect(() => {
    if (actionsHidden) {
      setPercent(null);
    }
  }, [actionsHidden]);

  const handleApplyClick = () => {
    onPercentApplyClick(percent);
  };

  return (
    <div
      style={{
        padding: ".5rem 3rem",
        borderTop: "1px solid lightgrey",
        minHeight: "3rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {!paginationHidden && (
          <Pagination
            label={`${pagination.page} / ${pagination.pagesCount}`}
            hasPrevious={pagination.hasPrevious}
            onPrevious={pagination.onPrevious}
            hasNext={pagination.hasNext}
            onNext={pagination.onNext}
          />
        )}
        {!actionsHidden && (
          <>
            <EnterKeyListenerDiv onEnterClick={handleApplyClick}>
              <TextField
                label={null}
                type="number"
                value={String(percent)}
                onChange={handlePercentChange}
                suffix="%"
                autoComplete="off"
                min={0}
              />
            </EnterKeyListenerDiv>
            <div style={{ marginLeft: ".5rem", marginTop: ".15rem" }}>
              <Button onClick={handleApplyClick}>
                Apple to selected products
              </Button>
            </div>
            <div style={{ marginLeft: ".5rem", marginTop: ".15rem" }}>
              <Button onClick={onRemoveFromPlanClick}>Remove from plan</Button>
            </div>
            <div style={{ marginLeft: ".5rem", marginTop: ".15rem" }}>
              <Button>Cancel</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsTableFooter;
