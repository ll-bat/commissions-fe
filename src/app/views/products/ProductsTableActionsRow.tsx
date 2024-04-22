import React, { useCallback, useEffect, useState } from "react";
import { Button, TextField } from "@shopify/polaris";
import { type UnknownFunction } from "@/app/types/generalTypes";
import { normalizePercent } from "@/app/views/products/utils";
import EnterKeyListenerDiv from "@/app/components/EnterKeyListenerDiv";

const ProductsTableFooter: React.FC<{
  actionsHidden: boolean;
  onPercentApplyClick: (percent: number | null) => unknown;
  onRemoveFromPlanClick: UnknownFunction;
}> = ({ actionsHidden, onPercentApplyClick, onRemoveFromPlanClick }) => {
  const [percent, setPercent] = useState<number | null>(null);
  const handlePercentChange = useCallback((value: string) => {
    setPercent(normalizePercent(value));
  }, []);

  useEffect(() => {
    if (actionsHidden) {
      // TODO - maybe it's better to convert `visibility` to re-rendering ?
      setPercent(null);
    }
  }, [actionsHidden]);

  const handleApplyClick = () => {
    onPercentApplyClick(percent);
  };

  return (
    <div style={{ padding: ".5rem 3rem", borderTop: "1px solid lightgrey" }}>
      <div style={{ display: "flex", visibility: actionsHidden ? 'hidden' : 'visible' }}>
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
          <Button onClick={handleApplyClick}>Apple to selected products</Button>
        </div>
        <div style={{ marginLeft: ".5rem", marginTop: ".15rem" }}>
          <Button onClick={onRemoveFromPlanClick}>Remove from plan</Button>
        </div>
        <div style={{ marginLeft: ".5rem", marginTop: ".15rem" }}>
          <Button>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsTableFooter;
