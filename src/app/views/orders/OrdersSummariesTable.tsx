import React, { useEffect, useState } from "react";
import {
  Card,
  IndexTable,
  useBreakpoints,
  useIndexResourceState,
} from "@shopify/polaris";
import OrdersSummariesTableFilters from "@/app/views/orders/OrdersSummariesTableFilters";
import {
  OrdersSummaryByDay,
  type OrderWithCommissionSum,
} from "@/app/views/orders/types";
import { returnSame } from "@/app/utils";
import { type UnknownObject } from "@/app/types/generalTypes";
import { type NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { type IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import OrdersSummariesTableRow from "@/app/views/orders/OrdersSummariesTableRow";
import OrdersService from "@/app/views/orders/OrdersService";
import { useProductCommissions } from "@/app/hooks/useProductCommissions";
import {
  calculateOrdersCommissions,
  getOrdersSummariesByDay,
} from "@/app/views/orders/utils";

const TABLE_HEADINGS: NonEmptyArray<IndexTableHeading> = [
  { title: "Day" },
  { title: "Orders count" },
  { title: "Sum commissions" },
];

export default function OrdersSummariesTable() {
  const [fetchingOrders, setFetchingOrders] = useState<boolean>(false);
  const [ordersWithCommissions, setOrdersWithCommissions] = useState<
    OrderWithCommissionSum[]
  >([]);
  const [ordersSummariesByDay, setOrdersSummariesByDay] = useState<
    OrdersSummaryByDay[]
  >([]);
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(returnSame<UnknownObject[]>(ordersWithCommissions));
  const { productCommissions } = useProductCommissions();

  useEffect(() => {
    async function fetchData() {
      setFetchingOrders(true);
      const { ok, result: orders } = await OrdersService.getOrders();
      setFetchingOrders(false);
      if (ok) {
        const ordersWithSumCommissions = calculateOrdersCommissions(
          orders!,
          productCommissions,
        );
        setOrdersWithCommissions(ordersWithSumCommissions);
      } else {
        // Handle error
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOrdersWithCommissions(
      (prev: OrderWithCommissionSum[]): OrderWithCommissionSum[] =>
        calculateOrdersCommissions(prev, productCommissions),
    );
  }, [setOrdersWithCommissions, productCommissions]);

  useEffect(() => {
    const ordersSummariesByDay = getOrdersSummariesByDay(ordersWithCommissions);
    setOrdersSummariesByDay(ordersSummariesByDay);
  }, [ordersWithCommissions]);

  return (
    <Card padding="0">
      <OrdersSummariesTableFilters />

      <IndexTable
        selectable={false}
        condensed={useBreakpoints().smDown}
        itemCount={ordersWithCommissions.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={TABLE_HEADINGS}
        loading={fetchingOrders}
      >
        {ordersWithCommissions.map((order, index) => (
          <OrdersSummariesTableRow
            key={order.id}
            order={order}
            index={index}
            isSelected={selectedResources.includes(order.id)}
          />
        ))}
      </IndexTable>
    </Card>
  );
}
