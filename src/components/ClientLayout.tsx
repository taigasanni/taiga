"use client";

import dynamic from "next/dynamic";
import { ColorProvider } from "@/lib/ColorContext";
import Header from "./Header";
import Footer from "./Footer";
import DyeOverlay from "./DyeOverlay";
import type { ReactNode } from "react";

const BowlCanvas = dynamic(() => import("./BowlCanvas"), {
  ssr: false,
});

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ColorProvider>
      <DyeOverlay />
      {/* 3D Bowl — fixed background across all pages */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
          <BowlCanvas />
        </div>
      </div>
      <Header />
      <main className="content-wrapper relative z-10">{children}</main>
      <Footer />
    </ColorProvider>
  );
}
