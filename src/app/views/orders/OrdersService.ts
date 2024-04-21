import { type Result } from "@/app/types/requestTypes";
import { type Order } from "@/app/views/orders/types";

const STATIC_ORDERS_DATA: Order[] = [
  {
    id: "#1",
    products: [
      {
        id: "#1",
        price: 100,
      },
    ],
    staffMemberId: "#1",
    day: new Date(2022, 1, 15),
  },
  {
    id: "#2",
    products: [
      {
        id: "#2",
        price: 200,
      },
    ],
    staffMemberId: "#1",
    day: new Date(2022, 1, 13),
  },
  {
    id: "#3",
    products: [
      {
        id: "#3",
        price: 300,
      },
    ],
    staffMemberId: "#1",
    day: new Date(2022, 1, 13),
  },
  {
    id: "#4",
    products: [
      {
        id: "#1",
        price: 400,
      },
    ],
    staffMemberId: "#2",
    day: new Date(2022, 1, 15),
  },
  {
    id: "#5",
    products: [
      {
        id: "#2",
        price: 500,
      },
    ],
    staffMemberId: "#2",
    day: new Date(2022, 1, 16),
  },
];

const ordersService = {
  async getOrders(): Promise<Result<Order[]>> {
    return Promise.resolve({
      ok: true,
      result: STATIC_ORDERS_DATA,
      errors: null,
    });
  },
};

export default ordersService;
