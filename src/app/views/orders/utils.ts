import {
  OrdersSummaryByDay,
  type Order,
  type OrderProduct,
  type OrderWithCommissionSum,
} from "@/app/views/orders/types";
import { type ProductCommissionsType } from "@/app/views/products/types";

/**
 * An order can have multiple products. Each product can have a commission percentage.
 * This function calculates the sum of commissions for each order.
 */
export function calculateOrdersCommissions(
  orders: Order[],
  productCommissions: ProductCommissionsType,
): OrderWithCommissionSum[] {
  return orders.map((order: Order) => ({
    ...order,
    sumCommission: order.products.reduce((sum, product: OrderProduct) => {
      if (productCommissions[product.id]) {
        const commissionPercent = productCommissions[product.id]!;
        const commission = (product.price * commissionPercent) / 100;
        const roundedCommission = Math.round(commission * 100) / 100;
        return sum + roundedCommission;
      }
      return sum;
    }, 0),
  }));
}

/**
 * Group orders by day and return list of `OrdersSummaryByDay` objects, each one representing
 * how many orders were made on that day and what was the total sum of commissions of those orders.
 */
export function getOrdersSummariesByDay(
  orders: OrderWithCommissionSum[],
): OrdersSummaryByDay[] {
  type OrdersSummaryByDayMap = Record<string, OrdersSummaryByDay>;

  const ordersSummaryByDayMap: OrdersSummaryByDayMap = orders.reduce(
    (acc: OrdersSummaryByDayMap, order: OrderWithCommissionSum) => {
      const dateKey = order.date.split("T")[0];

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: new Date(order.date),
          ordersCount: 0,
          totalSumCommission: 0,
        };
      }

      acc[dateKey].ordersCount += 1;
      acc[dateKey].totalSumCommission += order.sumCommission;

      return acc;
    },
    {},
  );

  return Object.values(ordersSummaryByDayMap);
}
