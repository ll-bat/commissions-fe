import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  IndexTable,
  useBreakpoints,
  useIndexResourceState,
} from "@shopify/polaris";
import OrdersTableFilters from "@/app/views/orders-table/OrdersTableFilters";
import {
  type Order,
  OrdersSummaryByDay,
  type OrderWithCommissionSum,
} from "@/app/views/orders-table/types";
import { returnSame } from "@/app/utils";
import { type UnknownObject } from "@/app/types/generalTypes";
import { type NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { type IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { type Result } from "@/app/types/requestTypes";
import OrdersTableRow from "@/app/views/orders-table/OrdersTableRow";
import OrdersService from "@/app/views/orders-table/OrdersService";
import { useProductCommissions } from "@/app/hooks/useProductCommissions";
import {
  calculateOrdersCommissions,
  getOrdersSummariesByDay,
} from "@/app/views/orders-table/utils";

const TABLE_HEADINGS: NonEmptyArray<IndexTableHeading> = [
  { title: "Day" },
  { title: "Orders count" },
  { title: "Sum commissions" },
];

export default function OrdersTable() {
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
      <OrdersTableFilters />

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
          <OrdersTableRow
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
