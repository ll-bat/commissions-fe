import { type Result } from "@/app/types/requestTypes";
import { DateRange, type Order, StaffMember } from "@/app/views/orders/types";

const STATIC_STAFF_MEMBERS: StaffMember[] = [
  {
    id: "#st-1",
    fullName: "John Doe",
  },
  {
    id: "#st-21",
    fullName: "GG LL",
  },
];

const STATIC_ORDERS_DATA: Order[] = [
  {
    id: "#1",
    products: [
      {
        id: "#1",
        price: 100,
      },
    ],
    staffMember: STATIC_STAFF_MEMBERS[0],
    date: new Date(2022, 1, 15),
  },
  {
    id: "#2",
    products: [
      {
        id: "#2",
        price: 200,
      },
    ],
    staffMember: STATIC_STAFF_MEMBERS[1],
    date: new Date(2022, 1, 13),
  },
  {
    id: "#3",
    products: [
      {
        id: "#3",
        price: 300,
      },
    ],
    staffMember: STATIC_STAFF_MEMBERS[0],
    date: new Date(2022, 1, 13),
  },
  {
    id: "#4",
    products: [
      {
        id: "#1",
        price: 400,
      },
    ],
    staffMember: STATIC_STAFF_MEMBERS[1],
    date: new Date(2022, 1, 15),
  },
  {
    id: "#5",
    products: [
      {
        id: "#2",
        price: 500,
      },
    ],
    staffMember: STATIC_STAFF_MEMBERS[0],
    date: new Date(2022, 1, 16),
  },
];

const ordersService = {
  async getOrders(
    dateRange: DateRange,
    staffMemberId: string,
  ): Promise<Result<Order[]>> {
    return Promise.resolve({
      ok: true,
      result: STATIC_ORDERS_DATA,
      errors: null,
    });
  },
  async getStaffMembers(): Promise<Result<StaffMember[]>> {
    return Promise.resolve({
      ok: true,
      result: STATIC_STAFF_MEMBERS,
      errors: null,
    });
  },
};

export default ordersService;
