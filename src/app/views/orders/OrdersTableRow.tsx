import React from "react";
import { type OrderWithCommissionSum } from "@/app/views/orders/types";
import { Image, IndexTable } from "@shopify/polaris";

const OrdersTableRow: React.FC<{
  order: OrderWithCommissionSum;
  index: number;
  isSelected: boolean;
}> = ({ order, index, isSelected }) => {
  const { id, day, sumCommission } = order;
  const quantity = 0;
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
            {day.toDateString()}
          </p>
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>{quantity}</IndexTable.Cell>
      <IndexTable.Cell>${sumCommission}</IndexTable.Cell>
    </IndexTable.Row>
  );
};

export default OrdersTableRow;
