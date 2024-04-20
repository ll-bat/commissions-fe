import {
  type Order,
  type OrderProduct,
  type OrderWithCommissionSum,
} from "@/app/views/orders-table/types";
import {type ProductCommissionsType} from "@/app/views/products-table/types";

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
