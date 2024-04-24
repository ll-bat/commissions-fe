"use client";

import { Button, Grid, Page } from "@shopify/polaris";
import ProductsTable from "@/app/views/products/ProductsTable";
import DateRangePicker from "@/app/views/orders/DateRangePicker";
import StaffMembersAutocomplete from "@/app/views/orders/StaffMembersAutocomplete";
import { useCallback, useState } from "react";
import OrdersSummariesTable from "@/app/views/orders/OrdersSummariesTable";

export default function Home() {
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

  const handleSelectStaffMember = useCallback(
    (staffMemberId: string) => {
      setStaffMemberId(staffMemberId);
    },
    [setStaffMemberId],
  );

  const handleSimulateClick = useCallback(() => {
    setShowOrdersTable(true);
    setUniqueKey((prev) => prev + 1);
  }, [setShowOrdersTable, setUniqueKey]);

  return (
    <Page fullWidth>
      <Grid>
        <Grid.Cell
          column={{ xl: "4", lg: "3" }}
          columnSpan={{ xs: 6, lg: 8, xl: 6 }}
        >
          <ProductsTable />
        </Grid.Cell>
      </Grid>

      <Grid>
        <Grid.Cell
          column={{ xl: "4", lg: "3" }}
          columnSpan={{ xs: 6, lg: 8, xl: 6 }}
        >
          <div style={{ display: "flex" }}>
            <div style={{ width: "50%", margin: "2rem 1rem 1rem 0" }}>
              <DateRangePicker
                year={2024}
                month={3}
                onSelect={handleSelectDateRange}
              />
            </div>
            <div style={{ width: "50%", margin: "2rem 0 1rem 1rem" }}>
              <StaffMembersAutocomplete onSelect={handleSelectStaffMember} />
            </div>
          </div>
        </Grid.Cell>
      </Grid>

      <div style={{ marginTop: "1rem" }}>
        <Grid>
          <Grid.Cell
            column={{ xl: "4", lg: "3" }}
            columnSpan={{ xs: 6, lg: 8, xl: 6 }}
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
              fullWidth
            >
              Simulate
            </Button>
          </Grid.Cell>
        </Grid>
      </div>

      <div style={{ margin: '3rem 0' }}>
        <Grid>
          <Grid.Cell
            column={{ xl: "4", lg: "3" }}
            columnSpan={{ xs: 6, lg: 8, xl: 6 }}
          >
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
          </Grid.Cell>
        </Grid>
      </div>
    </Page>
  );
}
