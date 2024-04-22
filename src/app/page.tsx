"use client";

import { Button, Page } from "@shopify/polaris";
import ProductsTable from "@/app/views/products/ProductsTable";
import DateRangePicker from "@/app/views/orders/DateRangePicker";
import StaffMembersAutocomplete from "@/app/views/orders/StaffMembersAutocomplete";
import { useState } from "react";
import OrdersSummariesTable from "@/app/views/orders/OrdersSummariesTable";

export default function Home() {
  // TODO - maybe to  use `Grid` ?
  const [uniqueKey, setUniqueKey] = useState<number>(1);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [staffMemberId, setStaffMemberId] = useState<string | null>(null);
  const [showOrdersTable, setShowOrdersTable] = useState<boolean>(false);

  const handleSelectDateRange = (startDate: Date, endDate: Date) => {
    setDateRange({
      startDate,
      endDate,
    });
  };

  const handleSelectStaffMember = (staffMemberId: string) => {
    setStaffMemberId(staffMemberId);
  };

  const handleSimulateClick = () => {
    setShowOrdersTable(true);
    setUniqueKey((prev) => prev + 1);
  };

  return (
    <Page fullWidth>
      <div
        style={{
          marginTop: "5rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <ProductsTable />
        </div>
      </div>

      <div
        style={{
          marginTop: "5rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <DateRangePicker year={2024} month={3} onSelect={handleSelectDateRange} />
        </div>

        <div
          style={{ width: "100%", maxWidth: "400px", padding: "0 0 0 2rem" }}
        >
          <StaffMembersAutocomplete onSelect={handleSelectStaffMember} />
        </div>
      </div>

      <div
        style={{
          marginTop: "5rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="primary"
          size="large"
          disabled={
            staffMemberId === null ||
            dateRange.startDate === null ||
            dateRange.endDate === null
          }
          onClick={handleSimulateClick}
        >
          Simulate
        </Button>
      </div>

      <div
        style={{
          marginTop: "4rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: "800px" }}>
          {showOrdersTable && (
            <OrdersSummariesTable
              key={`orders-summary-table-key-${uniqueKey}`}
              dateRange={{
                startDate: dateRange.startDate!,
                endDate: dateRange.endDate!,
              }}
              staffMemberId={staffMemberId!}
            />
          )}
        </div>
      </div>
    </Page>
  );
}
