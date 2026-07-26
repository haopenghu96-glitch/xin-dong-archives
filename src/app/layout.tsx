import type { Metadata, Viewport } from "next";
import "./globals.css";
import { assetPath } from "@/lib/asset-path";

export const metadata: Metadata = {
  title: "Lumi",
  description: "一份会追着拒绝按钮跑、又认真等你批准的可爱约会邀请。",
  applicationName: "Lumi",
  keywords: ["约会邀请", "心动档案", "微信分享"],
  openGraph: {
    title: "Lumi",
    description: "点开这份小秘密，批准一场蓄谋已久的见面。",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary",
    title: "Lumi",
    description: "点开这份小秘密，批准一场蓄谋已久的见面。",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f8cfdb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body style={{ "--paper-noise-image": `url(${assetPath("/textures/paper-noise.svg")})` } as React.CSSProperties}>{children}</body>
    </html>
  );
}
