import { AuthProvider } from "@/components/auth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartFin Technology - 企业级金融数据分析平台",
  description: "专业的企业级金融数据分析平台，提供实时市场数据、深度技术分析工具和专业投资教育。为个人投资者和机构提供全面的金融服务解决方案。",
  keywords: "金融数据,市场分析,投资教育,技术分析,股票分析,企业金融,TradingView,实时数据",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
