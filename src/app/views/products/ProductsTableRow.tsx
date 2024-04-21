import React, { useCallback, useEffect, useState } from "react";
import { type Product } from "@/app/views/products/types";
import { Image, IndexTable, TextField } from "@shopify/polaris";
import { normalizePercent } from "@/app/views/products/utils";

const ProductsTableRow: React.FC<{
  product: Product;
  index: number;
  isSelected: boolean;
}> = ({ product, index, isSelected }) => {
  const [percent, setPercent] = useState<number | null>(null);
  const handlePercentChange = useCallback((value: string) => {
    setPercent(normalizePercent(value));
  }, []);

  useEffect(() => {
    setPercent(product.commissionPercent);
  }, [product.commissionPercent]);

  const { id, name, category, price } = product;
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
          <TextField
            label={null}
            type="number"
            value={String(percent)}
            onChange={handlePercentChange}
            suffix="%"
            autoComplete="off"
            min={0}
          />
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  );
};

export default ProductsTableRow;
