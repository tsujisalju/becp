"use client";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/components/ui/breadcrumb-label-context.tsx
// Description      : Context that lets any page override the leaf breadcrumb label shown
//                    in DashboardHeader. Pages write their friendly name via setLeafLabel;
//                    the header reads it and falls back to the path-derived label when null.
// First Written on : Sunday, 20-Apr-2026
// Last Modified on : Sunday, 20-Apr-2026

import { createContext, useContext, useState } from "react";

interface BreadcrumbLabelContextValue {
  leafLabel: string | null;
  setLeafLabel: (label: string | null) => void;
}

export const BreadcrumbLabelContext = createContext<BreadcrumbLabelContextValue>({
  leafLabel: null,
  setLeafLabel: () => {},
});

export function BreadcrumbLabelProvider({ children }: { children: React.ReactNode }) {
  const [leafLabel, setLeafLabel] = useState<string | null>(null);
  return (
    <BreadcrumbLabelContext.Provider value={{ leafLabel, setLeafLabel }}>
      {children}
    </BreadcrumbLabelContext.Provider>
  );
}

export function useBreadcrumbLabel() {
  return useContext(BreadcrumbLabelContext);
}
