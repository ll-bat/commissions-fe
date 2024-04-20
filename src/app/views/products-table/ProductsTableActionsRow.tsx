import React, { useCallback, useEffect, useState } from "react";
import { type UnknownFunction } from "@/app/types/generalTypes";
import { normalizePercent } from "@/app/utils";
import { Button, Combobox, IndexTable, TextField } from "@shopify/polaris";

const ProductsTableActionsRow: React.FC<{
  hidden: boolean;
  onApplyClick: (percent: number) => unknown;
  onRemoveFromPlanClick: UnknownFunction;
}> = ({ hidden, onApplyClick, onRemoveFromPlanClick }) => {
  const [percent, setPercent] = useState("");
  const handleTextFieldChange = useCallback((value: string) => {
    setPercent(normalizePercent(value));
  }, []);

  useEffect(() => {
    if (hidden) {
      // TODO - maybe it's better to convert `visibility` to re-rendering ?
      setPercent("");
    }
  }, [hidden]);

  const handleApplyClick = () => {
    if (percent !== "") {
      onApplyClick(Number(percent));
    }
  };

  // TODO textField on enter to apply to selected products below
  return (
    <IndexTable.Row id="1" position={0} rowType="subheader">
      <IndexTable.Cell colSpan={4}>
        <div
          style={{ display: "flex", visibility: hidden ? "hidden" : "visible" }}
        >
          <Combobox
            activator={
              <TextField
                label={null}
                type="number"
                value={percent}
                onChange={handleTextFieldChange}
                suffix="%"
                autoComplete="off"
                min={0}
              />
            }
          />
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
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  );
};

export default ProductsTableActionsRow;