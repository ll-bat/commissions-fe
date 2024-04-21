"use client";

import { Page } from "@shopify/polaris";
import ProductsTable from "@/app/views/products/ProductsTable";
import OrdersSummariesTable from "@/app/views/orders/OrdersSummariesTable";

export default function Home() {
  // TODO - maybe to  use `Grid` ?
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
          marginTop: "4rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <OrdersSummariesTable />
        </div>
      </div>
    </Page>
  );
}
