/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
	Facebook,
	Twitter,
	Linkedin,
	Instagram,
	Mail,
	Phone,
	MapPin,
} from "lucide-react";

export default function Footer() {
	const [companyProfile, setCompanyProfile] = useState<any>(null);

	useEffect(() => {
		const fetchCompanyProfile = async () => {
			try {
				const res = await fetch("/api/company-profile");
				const data = await res.json();
				if (data.success && data.data) {
					setCompanyProfile(data.data);
				}
			} catch (error) {
				console.error("Error fetching company profile:", error);
			}
		};

		fetchCompanyProfile();
	}, []);
	return (
		<footer className="bg-gray-900 text-white">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Company Info */}
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
								<span className="text-white font-bold text-sm">
									{companyProfile?.name?.substring(0, 2) ||
										"EP"}
								</span>
							</div>
							<span className="text-xl font-bold">
								{companyProfile?.name || "Enterprise Platform"}
							</span>
						</div>
						<p className="text-gray-400">
							{companyProfile?.companyIntroduction?.description ||
								"Nền tảng doanh nghiệp hàng đầu, kết nối các công ty, thương hiệu và sản phẩm trong một hệ sinh thái toàn diện."}
						</p>
						<div className="flex space-x-4">
							<Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
							<Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
							<Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
							<Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
						</div>
					</div>

					{/* Quick Links */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">
							Liên kết nhanh
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/companies"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Công ty
								</Link>
							</li>
							<li>
								<Link
									href="/brands"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Thương hiệu
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Sản phẩm
								</Link>
							</li>
							<li>
								<Link
									href="/recruitment"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Tuyển dụng
								</Link>
							</li>
							<li>
								<Link
									href="/news"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Tin tức
								</Link>
							</li>
						</ul>
					</div>

					{/* Services */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Dịch vụ</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/about/strategy"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Chiến lược doanh nghiệp
								</Link>
							</li>
							<li>
								<Link
									href="/sustainability"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Phát triển bền vững
								</Link>
							</li>
							<li>
								<Link
									href="/partnership"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Đối tác chiến lược
								</Link>
							</li>
							<li>
								<Link
									href="/innovation"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Đổi mới sáng tạo
								</Link>
							</li>
							<li>
								<Link
									href="/support"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Hỗ trợ khách hàng
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Liên hệ</h3>
						<div className="space-y-3">
							{companyProfile?.companyInfo?.address && (
								<div className="flex items-start space-x-3">
									<MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
									<span className="text-gray-400">
										{companyProfile.companyInfo.address}
									</span>
								</div>
							)}
							{companyProfile?.companyInfo?.phone && (
								<div className="flex items-center space-x-3">
									<Phone className="w-5 h-5 text-gray-400" />
									<span className="text-gray-400">
										{companyProfile.companyInfo.phone}
									</span>
								</div>
							)}
							{companyProfile?.companyInfo?.email && (
								<div className="flex items-center space-x-3">
									<Mail className="w-5 h-5 text-gray-400" />
									<span className="text-gray-400">
										{companyProfile.companyInfo.email}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-gray-800">
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<div className="text-gray-400 text-sm">
							© 2024{" "}
							{companyProfile?.name || "Enterprise Platform"}. Tất
							cả quyền được bảo lưu.
						</div>
						<div className="flex space-x-6 text-sm">
							<Link
								href="/privacy"
								className="text-gray-400 hover:text-white transition-colors"
							>
								Chính sách bảo mật
							</Link>
							<Link
								href="/terms"
								className="text-gray-400 hover:text-white transition-colors"
							>
								Điều khoản sử dụng
							</Link>
							<Link
								href="/cookies"
								className="text-gray-400 hover:text-white transition-colors"
							>
								Chính sách Cookie
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
