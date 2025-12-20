import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Providers from "./providers";
import Snowfall from "@/components/Snowfall";

export const metadata: Metadata = {
  title: {
    default: "Alliance Organization - Minecraft Community Since 2020",
    template: "%s | Alliance Organization",
  },
  description:
    "Alliance Organization là cộng đồng Minecraft với 10 thành viên gắn kết, 5 năm hoạt động (2020-2025), và nhiều events đáng nhớ. Nơi kết nối qua màn hình, gắn kết qua Minecraft.",
  keywords: [
    "Alliance Organization",
    "Minecraft",
    "Gaming Community",
    "Vietnam Gaming",
    "Minecraft Server",
    "aemine.vn",
    "Gaming Events",
    "Online Community",
  ],
  authors: [{ name: "Alliance Organization" }],
  creator: "Alliance Organization",
  publisher: "Alliance Organization",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://alliance-organization.vercel.app",
    siteName: "Alliance Organization",
    title: "Alliance Organization - Minecraft Community Since 2020",
    description:
      "Cộng đồng Minecraft 5 năm với 10 thành viên gắn kết. Tham gia và khám phá những câu chuyện, sự kiện đáng nhớ của chúng tôi!",
    images: [
      {
        url: "/logo/OIP.jpg",
        width: 1200,
        height: 630,
        alt: "Alliance Organization Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alliance Organization - Minecraft Community",
    description: "Cộng đồng Minecraft 5 năm - 10 thành viên gắn kết",
    images: ["/logo/OIP.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover", // For iPhone X+ notch support
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Alliance Canvas",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900 antialiased`}
        suppressHydrationWarning={true}
      >
        <Snowfall count={60} minSize={2} maxSize={6} minSpeed={1.5} maxSpeed={2} />
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
