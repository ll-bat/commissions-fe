import { type Result } from "@/app/types/requestTypes";
import { type DateRange, type Order, type StaffMember } from "@/app/views/orders/types";
import axiosClient from "@/app/axios";

const ordersService = {
  async getOrders(
    dateRange: DateRange,
    staffMemberId: string,
  ): Promise<Result<Order[]>> {
    return await axiosClient.get<Order[]>("/orders", {
      params: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        staffMemberId,
      },
    });
  },
  async getStaffMembers(): Promise<Result<StaffMember[]>> {
    return await axiosClient.get<StaffMember[]>("/staff-members");
  },
};

export default ordersService;
