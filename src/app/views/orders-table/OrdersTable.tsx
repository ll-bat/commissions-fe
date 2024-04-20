import {
  Card,
  IndexTable,
  useBreakpoints,
  useIndexResourceState,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import OrdersTableFilters from "@/app/views/orders-table/OrdersTableFilters";
import { type Order, type OrderWithCommissionSum } from "@/app/types/orderTypes";
import { returnSame } from "@/app/utils";
import { type UnknownObject } from "@/app/types/generalTypes";
import { type NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import { type IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { type Result } from "@/app/types/requestTypes";
import OrdersTableRow from "@/app/views/orders-table/OrdersTableRow";
import OrderService from "@/app/services/OrderService";

const TABLE_HEADINGS: NonEmptyArray<IndexTableHeading> = [
  { title: "Day" },
  { title: "Orders count" },
  { title: "Sum commissions" },
];
export default function OrdersTable() {
  const [fetchingOrders, setFetchingOrders] = useState<boolean>(false);
  const [orders, setOrders] = useState<OrderWithCommissionSum[]>([]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(returnSame<UnknownObject[]>(orders));

  const getOrders = useCallback(async () => {
    setFetchingOrders(true);
    const { ok, result }: Result<Order[]> = await OrderService.getOrders();
    if (ok) {
      const items = result!;
      const ordersWithSumCommissions = items.map((order) => ({
        ...order,
        sumCommission: 2.5,
      }));
      setOrders(ordersWithSumCommissions);
    } else {
      // TODO - show error
    }
    setFetchingOrders(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card padding="0">
      <OrdersTableFilters />

      <IndexTable
        selectable={false}
        condensed={useBreakpoints().smDown}
        itemCount={orders.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={TABLE_HEADINGS}
        loading={fetchingOrders}
      >
        {orders.map((order, index) => (
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