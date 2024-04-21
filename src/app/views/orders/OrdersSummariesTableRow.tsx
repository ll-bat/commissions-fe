import { type FC } from "react";
import { type OrdersSummaryByDay } from "@/app/views/orders/types";
import { Image, IndexTable } from "@shopify/polaris";

const OrdersSummariesTableRow: FC<{
  ordersSummary: OrdersSummaryByDay;
  index: number;
}> = ({ ordersSummary, index }) => {
  const { date, ordersCount, totalSumCommission } = ordersSummary;
  return (
    <IndexTable.Row
      id={`${ordersSummary.date.toLocaleDateString()}-${index}`}
      position={index}
    >
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
            {date.toDateString()}
          </p>
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>{ordersCount}</IndexTable.Cell>
      <IndexTable.Cell>${totalSumCommission}</IndexTable.Cell>
    </IndexTable.Row>
  );
};

export default OrdersSummariesTableRow;
