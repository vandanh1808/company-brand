import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToasterPortal } from "@/components/ToasterPortal";
import Header from "@/components/Header";
import { AdminProvider } from "@/contexts/AdminContext";
import GlobalProgressBar from "@/components/global-progress-bar";
import { Suspense } from "react";
import ClientSiteCounter from "@/components/ClientVisitSection";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const siteUrl =
	process.env.NEXT_PUBLIC_SITE_URL ??
	(process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: "http://localhost:3000");

export const metadata: Metadata = {
	title: "Nền Tảng Doanh Nghiệp",
	description:
		"Nền tảng doanh nghiệp giúp bạn khám phá hệ sinh thái đối tác: danh mục công ty, thương hiệu và sản phẩm kèm thông tin chi tiết, hình ảnh, liên hệ và tuyển dụng. Cập nhật nhanh, tra cứu dễ dàng.",
	metadataBase: new URL(siteUrl),
	openGraph: {
		type: "website",
		url: siteUrl,
		siteName: "Nền Tảng Doanh Nghiệp",
		title: "Nền Tảng Doanh Nghiệp",
		description:
			"Nền tảng doanh nghiệp giúp bạn khám phá hệ sinh thái đối tác: danh mục công ty, thương hiệu và sản phẩm kèm thông tin chi tiết, hình ảnh, liên hệ và tuyển dụng. Cập nhật nhanh, tra cứu dễ dàng.",
		images: ["/og-default.png"], // 1200x630
	},
	twitter: {
		card: "summary_large_image",
		title: "Nền Tảng Doanh Nghiệp",
		description:
			"Nền tảng doanh nghiệp giúp bạn khám phá hệ sinh thái đối tác: danh mục công ty, thương hiệu và sản phẩm kèm thông tin chi tiết, hình ảnh, liên hệ và tuyển dụng. Cập nhật nhanh, tra cứu dễ dàng.",
		images: ["/og-default.png"],
	},
	alternates: {
		canonical: siteUrl,
	},
	robots: { index: true, follow: true },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="vi">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col overflow-y-scroll`}
				suppressHydrationWarning={true}
			>
				<GlobalProgressBar />
				<AdminProvider>
					<Header />
					<main className="flex-grow">
						<Suspense fallback={null}>{children}</Suspense>
					</main>
					{/* Floating badge (tùy thích) */}
					<ClientSiteCounter variant="floating" />
					{/* <Footer /> */}
				</AdminProvider>
				<ToasterPortal />
			</body>
		</html>
	);
}
