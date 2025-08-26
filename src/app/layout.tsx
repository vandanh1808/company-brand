import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToasterPortal } from "@/components/ToasterPortal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdminProvider } from "@/contexts/AdminContext";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Nền Tảng Doanh Nghiệp",
	description:
		"Khám phá các công ty, thương hiệu và sản phẩm trong hệ sinh thái của chúng tôi",
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
				<AdminProvider>
					<Header />
					<main className="flex-grow">{children}</main>
					{/* <Footer /> */}
				</AdminProvider>
				<ToasterPortal />
			</body>
		</html>
	);
}
