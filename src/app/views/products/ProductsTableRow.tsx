import React, { useCallback, useEffect, useState } from "react";
import { type Product } from "@/app/views/products/types";
import { normalizePercent } from "@/app/utils";
import { Combobox, Image, IndexTable, TextField } from "@shopify/polaris";

const ProductsTableRow: React.FC<{
  product: Product;
  index: number;
  isSelected: boolean;
}> = ({ product, index, isSelected }) => {
  const [percent, setPercent] = useState("");
  const handleTextFieldChange = useCallback((value: string) => {
    setPercent(normalizePercent(value));
  }, []);

  useEffect(() => {
    setPercent(String(product.commissionPercent));
  }, [product.commissionPercent]);

  const { id, name, category, price, commissionPercent } = product;
  return (
    <IndexTable.Row id={id} selected={isSelected} position={index}>
      <IndexTable.Cell>
        <div style={{ display: "flex" }}>
          <Image alt="man" source="images/man.png" width="40" />
          <p
            style={{
              marginLeft: ".5rem",
              marginTop: ".75rem",
              fontSize: ".8rem",
              fontWeight: "normal",
            }}
          >
            {name}
          </p>
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>{category}</IndexTable.Cell>
      <IndexTable.Cell>${price}</IndexTable.Cell>
      <IndexTable.Cell>
        <div onClick={(e) => e.stopPropagation()}>
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
          ></Combobox>
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  );
};

export default ProductsTableRow;
