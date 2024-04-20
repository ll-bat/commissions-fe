import { type Result } from "@/app/types/requestTypes";
import { type Order } from "@/app/types/orderTypes";

const STATIC_ORDERS_DATA: Order[] = [
  {
    id: "#1",
    productIds: ["#1"],
    staffMemberId: "#1",
    quantity: 1,
    day: new Date(2022, 1, 15),
  },
  {
    id: "#2",
    productIds: ["#2"],
    staffMemberId: "#1",
    quantity: 1,
    day: new Date(2022, 1, 13),
  },
  {
    id: "#3",
    productIds: ["#3"],
    staffMemberId: "#1",
    quantity: 1,
    day: new Date(2022, 1, 13),
  },
  {
    id: "#4",
    productIds: ["#2"],
    staffMemberId: "#2",
    quantity: 2,
    day: new Date(2022, 1, 15),
  },
  {
    id: "#5",
    productIds: ["#1"],
    staffMemberId: "#2",
    quantity: 3,
    day: new Date(2022, 1, 16),
  },
];

const OrderService = {
  async getOrders(): Promise<Result<Order[]>> {
    return Promise.resolve({
      ok: true,
      result: STATIC_ORDERS_DATA,
      errors: null,
    });
  },
};

export default OrderService;
