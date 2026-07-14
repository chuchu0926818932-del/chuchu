import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SNL 短影音企劃工作台",
  description: "從 80 條靈感題庫建立拍攝企劃，並整理成可交給 Codex 的製作指令。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
