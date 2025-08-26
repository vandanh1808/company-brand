"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import {
	Building2,
	Package,
	ShoppingBag,
	Users,
	LogOut,
	Plus,
	TrendingUp,
	Eye,
	Briefcase,
} from "lucide-react";

interface User {
	id: string;
	email: string;
	name: string;
	role: string;
}

interface Company {
	visitors: number;
	[key: string]: unknown;
}

interface DashboardStats {
	companies: number;
	brands: number;
	products: number;
	totalVisitors: number;
}

export default function AdminDashboard() {
	const [user, setUser] = useState<User | null>(null);
	const [stats, setStats] = useState<DashboardStats>({
		companies: 0,
		brands: 0,
		products: 0,
		totalVisitors: 0,
	});
	const [, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("adminToken");
		const userData = localStorage.getItem("adminUser");

		if (!token || !userData) {
			router.push("/admin/login");
			return;
		}

		setUser(JSON.parse(userData));
		fetchStats();
	}, [router]);

	const fetchStats = async () => {
		try {
			const [companiesRes, brandsRes, productsRes] = await Promise.all([
				fetch("/api/companies"),
				fetch("/api/brands"),
				fetch("/api/products"),
			]);

			const [companiesData, brandsData, productsData] = await Promise.all(
				[companiesRes.json(), brandsRes.json(), productsRes.json()]
			);

			const totalVisitors = companiesData.success
				? companiesData.data.reduce(
						(sum: number, company: Company) =>
							sum + company.visitors,
						0
				  )
				: 0;

			setStats({
				companies: companiesData.success
					? companiesData.data.length
					: 0,
				brands: brandsData.success ? brandsData.data.length : 0,
				products: productsData.success ? productsData.data.length : 0,
				totalVisitors,
			});
		} catch (error) {
			console.error("Error fetching stats:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("adminToken");
		localStorage.removeItem("adminUser");
		toast.success("Đăng xuất thành công");
		router.push("/admin/login");
	};

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				Đang tải...
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-4xl font-bold">
						Bảng Điều Khiển Quản Trị
					</h1>
					<p className="text-muted-foreground mt-2">
						Chào mừng trở lại, {user.name}
					</p>
				</div>
				<div className="flex items-center space-x-4">
					<Badge variant="secondary" className="px-3 py-1">
						{user.role}
					</Badge>
					<Button variant="outline" onClick={handleLogout}>
						<LogOut className="w-4 h-4 mr-2" />
						Đăng Xuất
					</Button>
				</div>
			</div>

			{/* Quick Navigation */}
			<div className="mb-8">
				<div className="flex space-x-4">
					<Link href="/admin/companies">
						<Button variant="outline">
							<Building2 className="w-4 h-4 mr-2" />
							Quản Lý Công Ty
						</Button>
					</Link>
					<Link href="/admin/brands">
						<Button variant="outline">
							<Package className="w-4 h-4 mr-2" />
							Quản Lý Thương Hiệu
						</Button>
					</Link>
					<Link href="/admin/products">
						<Button variant="outline">
							<ShoppingBag className="w-4 h-4 mr-2" />
							Quản Lý Sản Phẩm
						</Button>
					</Link>
					<Link href="/admin/job-openings">
						<Button variant="outline">
							<Briefcase className="w-4 h-4 mr-2" />
							Quản Lý Tuyển Dụng
						</Button>
					</Link>
					<Link href="/">
						<Button variant="ghost">Xem Trang Web</Button>
					</Link>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tổng Công Ty
						</CardTitle>
						<Building2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.companies}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tổng Thương Hiệu
						</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.brands}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tổng Sản Phẩm
						</CardTitle>
						<ShoppingBag className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.products}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tổng Lượt Xem
						</CardTitle>
						<Eye className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalVisitors}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<Plus className="w-5 h-5 mr-2" />
							Thao Tác Nhanh
						</CardTitle>
						<CardDescription>
							Các tác vụ quản trị thường dùng
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<Link href="/admin/companies/new">
							<Button
								variant="outline"
								className="w-full justify-start"
							>
								<Building2 className="w-4 h-4 mr-2" />
								Thêm Công Ty Mới
							</Button>
						</Link>
						<Link href="/admin/brands/new">
							<Button
								variant="outline"
								className="w-full justify-start"
							>
								<Package className="w-4 h-4 mr-2" />
								Thêm Thương Hiệu Mới
							</Button>
						</Link>
						<Link href="/admin/products/new">
							<Button
								variant="outline"
								className="w-full justify-start"
							>
								<ShoppingBag className="w-4 h-4 mr-2" />
								Thêm Sản Phẩm Mới
							</Button>
						</Link>
						<Link href="/admin/job-openings">
							<Button
								variant="outline"
								className="w-full justify-start"
							>
								<Briefcase className="w-4 h-4 mr-2" />
								Thêm Tin Tuyển Dụng
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
