import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Hakki — 白い器",
  description:
    "白い器のように、あなたの色に染まる。株式会社Hakkiは、デザインとマーケティングで、クライアントと共に新しい色を生み出します。",
  openGraph: {
    title: "Hakki — 白い器",
    description:
      "白い器のように、あなたの色に染まる。デザインとマーケティングで、クライアントと共に新しい色を生み出します。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
