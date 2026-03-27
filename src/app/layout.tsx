import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "白器 — いい商品を、ちゃんと売る。",
  description:
    "株式会社白器は、いい商品を正しく届けるマーケティング会社です。伝え方と届け方を整え、売れるべきものがきちんと売れる状態をつくります。",
  openGraph: {
    title: "白器 — いい商品を、ちゃんと売る。",
    description:
      "伝え方と届け方を整え、売れるべきものがきちんと売れる状態をつくるマーケティング会社です。",
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
