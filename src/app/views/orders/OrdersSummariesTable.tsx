import { FC, useEffect, useMemo, useState } from "react";
import {
  Card,
  IndexTable,
  useBreakpoints,
  useIndexResourceState,
} from "@shopify/polaris";
import OrdersSummariesTableFilters from "@/app/views/orders/OrdersSummariesTableFilters";
import {
  DateRange,
  type OrdersSummaryByDay,
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

const ITEMS_PER_PAGE = 10;

const OrdersSummariesTable: FC<{
  dateRange: DateRange;
  staffMemberId: string;
}> = ({ dateRange, staffMemberId }) => {
  const [fetchingOrders, setFetchingOrders] = useState<boolean>(false);
  const [ordersWithCommissions, setOrdersWithCommissions] = useState<
    OrderWithCommissionSum[]
  >([]);
  const [ordersSummariesByDay, setOrdersSummariesByDay] = useState<
    OrdersSummaryByDay[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [pagesCount, setPagesCount] = useState<number>(0);
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(returnSame<UnknownObject[]>(ordersWithCommissions));

  const { productCommissions } = useProductCommissions();

  useEffect(() => {
    async function fetchData() {
      setFetchingOrders(true);
      const { ok, result: orders } = await OrdersService.getOrders(
        dateRange,
        staffMemberId,
      );
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
    // TODO - we might improve this ?
    const ordersSummariesByDay = getOrdersSummariesByDay(ordersWithCommissions);
    const sortedOrdersSummariesByDay = ordersSummariesByDay.sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
    setOrdersSummariesByDay(sortedOrdersSummariesByDay);
    setPagesCount(Math.ceil(ordersSummariesByDay.length / ITEMS_PER_PAGE));
  }, [ordersWithCommissions]);

  const currentPageItems = useMemo(() => {
    return ordersSummariesByDay.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE,
    );
  }, [ordersSummariesByDay, page, ITEMS_PER_PAGE]);

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
        pagination={{
          label: `${page} / ${pagesCount}`,
          hasNext: page < pagesCount,
          hasPrevious: page > 1,
          onPrevious: () => page > 1 && setPage(page - 1),
          onNext: () => page < pagesCount && setPage(page + 1),
        }}
      >
        {currentPageItems.map((ordersSummary, index) => (
          <OrdersSummariesTableRow
            key={`${ordersSummary.date.toLocaleDateString()}-${index}`}
            ordersSummary={ordersSummary}
            index={index}
          />
        ))}
      </IndexTable>
    </Card>
  );
};

export default OrdersSummariesTable;
