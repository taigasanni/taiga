"use client";

import { ColorProvider } from "@/lib/ColorContext";
import Header from "./Header";
import Footer from "./Footer";
import DyeOverlay from "./DyeOverlay";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ColorProvider>
      <DyeOverlay />
      <Header />
      <main className="content-wrapper">{children}</main>
      <Footer />
    </ColorProvider>
  );
}
