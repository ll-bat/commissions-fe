"use client";
// TODO - do we need `use client` here?

import React from "react";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import { ProductCommissionsProvider } from "@/app/context/ProductCommissionsContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider i18n={translations}>
      <ProductCommissionsProvider>{children}</ProductCommissionsProvider>
    </AppProvider>
  );
}
