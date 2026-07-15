import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SNL 短影音企劃工作台",
  description: "從 80 條題庫直接取得完整拍攝腳本，完成後自動歸檔並排除重複選題。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
