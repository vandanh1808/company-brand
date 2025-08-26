"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Package, DollarSign, ShoppingCart } from "lucide-react";

interface Product {
	_id: string;
	name: string;
	description: string;
	price: number;
	quantity: number;
	images: string[];
	brandId: {
		_id: string;
		name: string;
		companyId: {
			_id: string;
			name: string;
		};
	};
}

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			const response = await fetch("/api/products");
			const data = await response.json();
			if (data.success) {
				setProducts(data.data);
			}
		} catch (error) {
			console.error("Error fetching products:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-center items-center min-h-[400px]">
					<div className="text-xl">Đang tải sản phẩm...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-4xl font-bold mb-2">Tất cả sản phẩm</h1>
				<p className="text-lg text-muted-foreground">
					Khám phá toàn bộ danh mục sản phẩm từ các thương hiệu hàng
					đầu
				</p>
			</div>

			{products.length === 0 ? (
				<Card>
					<CardContent className="py-8">
						<p className="text-center text-muted-foreground">
							Hiện tại chưa có sản phẩm nào.
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{products.map((product) => (
						<Link
							key={product._id}
							href={`/products/${product._id}`}
						>
							<Card className="h-full cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
								{product.images && product.images.length > 0 ? (
									<div className="relative h-56 w-full overflow-hidden bg-gray-100">
										<Image
											src={product.images[0]}
											alt={product.name}
											fill
											className="object-cover group-hover:scale-110 transition-transform duration-500"
											onError={(e) => {
												const target =
													e.target as HTMLImageElement;
												target.src =
													"/placeholder-image.svg";
											}}
										/>
										{product.quantity > 0 &&
											product.quantity <= 10 && (
												<Badge className="absolute top-2 right-2 bg-orange-500 text-white">
													Còn {product.quantity} sản
													phẩm
												</Badge>
											)}
										{product.quantity === 0 && (
											<Badge className="absolute top-2 right-2 bg-red-500 text-white">
												Hết hàng
											</Badge>
										)}
									</div>
								) : (
									<div className="relative h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
										<Package className="w-16 h-16 text-gray-400" />
									</div>
								)}
								<CardHeader className="pb-3">
									<CardTitle className="text-lg font-semibold line-clamp-2 min-h-[3rem]">
										{product.name}
									</CardTitle>
									<div className="text-sm text-muted-foreground">
										<Link
											href={`/brands/${product.brandId._id}`}
											className="text-primary hover:underline transition-colors"
											onClick={(e) => e.stopPropagation()}
										>
											{product.brandId.name}
										</Link>
										{" • "}
										<Link
											href={`/companies/${product.brandId.companyId._id}`}
											className="text-primary hover:underline transition-colors"
											onClick={(e) => e.stopPropagation()}
										>
											{product.brandId.companyId.name}
										</Link>
									</div>
								</CardHeader>
								<CardContent className="space-y-3">
									{product.description && (
										<CardDescription className="text-sm line-clamp-2 min-h-[2.5rem]">
											{product.description}
										</CardDescription>
									)}

									<div className="space-y-2 pt-2 border-t">
										{/* Price Display */}
										<div className="flex items-center justify-between">
											<span className="text-sm text-muted-foreground flex items-center">
												<DollarSign className="w-4 h-4 mr-1" />
												Giá:
											</span>
											{product.price &&
											product.price > 0 ? (
												<span className="text-lg font-bold text-green-600">
													{new Intl.NumberFormat(
														"vi-VN",
														{
															style: "currency",
															currency: "VND",
														}
													).format(product.price)}
												</span>
											) : (
												<Badge
													variant="secondary"
													className="text-sm font-semibold"
												>
													Giá thỏa thuận
												</Badge>
											)}
										</div>

										{/* Quantity Display */}
										<div className="flex items-center justify-between">
											<span className="text-sm text-muted-foreground flex items-center">
												<ShoppingCart className="w-4 h-4 mr-1" />
												Kho:
											</span>
											<span
												className={`text-sm font-semibold ${
													product.quantity > 20
														? "text-green-600"
														: product.quantity > 0
														? "text-orange-600"
														: "text-red-600"
												}`}
											>
												{product.quantity > 0
													? product.quantity > 100
														? "Còn nhiều"
														: `Còn ${product.quantity} sp`
													: "Hết hàng"}
											</span>
										</div>
									</div>

									{/* Action Button */}
									<div className="pt-2">
										<div className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center rounded-lg text-sm font-medium group-hover:from-blue-600 group-hover:to-blue-700 transition-all">
											Xem chi tiết
										</div>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
