"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Package, DollarSign, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface Brand {
	_id: string;
	name: string;
	description?: string;
	logo?: string;
	companyId: {
		_id: string;
		name: string;
	};
}

interface Product {
	_id: string;
	name: string;
	description: string;
	price: number;
	quantity: number;
	images: string[];
	brandId: string;
}

export default function BrandPage() {
	const params = useParams();
	const [brand, setBrand] = useState<Brand | null>(null);
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchBrandData = useCallback(async () => {
		try {
			const [brandResponse, productsResponse] = await Promise.all([
				fetch(`/api/brands/${params.id}`),
				fetch(`/api/products?brandId=${params.id}`),
			]);

			const brandData = await brandResponse.json();
			const productsData = await productsResponse.json();

			if (brandData.success) {
				setBrand(brandData.data);
			}

			if (productsData.success) {
				setProducts(productsData.data);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	}, [params.id]);

	useEffect(() => {
		if (params.id) {
			fetchBrandData();
		}
	}, [params.id, fetchBrandData]);

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				{/* Back button skeleton */}
				<div className="mb-6">
					<Skeleton className="h-6 w-48" />
				</div>

				{/* Brand header skeleton */}
				<div className="mb-10">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
						<div>
							<Skeleton className="h-10 w-64 mb-2" />
							<Skeleton className="h-6 w-48" />
						</div>
						<Skeleton className="h-10 w-32" />
					</div>
					<Card className="border-none">
						<CardContent className="pt-6">
							<Skeleton className="h-6 w-full mb-2" />
							<Skeleton className="h-6 w-3/4" />
						</CardContent>
					</Card>
				</div>

				{/* Products section skeleton */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-8">
						<Skeleton className="h-8 w-48" />
						<Skeleton className="h-8 w-32" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{[1, 2, 3, 4].map((i) => (
							<Card key={i} className="h-full overflow-hidden">
								<Skeleton className="h-56 w-full rounded-none" />
								<CardHeader className="pb-1">
									<Skeleton className="h-5 w-3/4 mb-1" />
									<Skeleton className="h-5 w-1/2" />
								</CardHeader>
								<CardContent className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-5/6" />
									<div className="pt-2 border-t">
										<Skeleton className="h-6 w-full" />
									</div>
									<Skeleton className="h-10 w-full rounded-lg" />
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (!brand) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">Không tìm thấy thương hiệu</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<Link
					href={`/companies/${brand.companyId._id}`}
					className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Quay lại {brand.companyId.name}
				</Link>
			</div>

			<div className="mb-10">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
					<div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
							{brand.name}
						</h1>
						<p className="text-lg text-muted-foreground mt-2">
							Thuộc{" "}
							<span className="font-semibold">
								{brand.companyId.name}
							</span>
						</p>
					</div>
					<Badge variant="outline" className="text-sm px-4 py-2">
						<Package className="w-4 h-4 mr-2" />
						{products.length} sản phẩm
					</Badge>
				</div>

				{brand.description && (
					<Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-none">
						<CardContent className="pt-6">
							<p className="text-lg text-gray-700 leading-relaxed">
								{brand.description}
							</p>
						</CardContent>
					</Card>
				)}
			</div>

			<div className="mb-8">
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-3xl font-bold">Danh Sách Sản Phẩm</h2>
					<div className="flex gap-2">
						<Badge variant="secondary" className="text-sm">
							Tất cả sản phẩm
						</Badge>
					</div>
				</div>

				{products.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{products.map((product) => (
							<Link
								key={product._id}
								href={`/products/${product._id}`}
							>
								<Card className="h-full cursor-pointer hover:shadow-xl pt-0 gap-2 hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
									{product.images &&
									product.images.length > 0 ? (
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
											<Badge className="absolute top-2 right-2 bg-orange-500 text-white">
												Thoả thuận
											</Badge>
										</div>
									) : (
										<div className="relative h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
											<Package className="w-16 h-16 text-gray-400" />
										</div>
									)}
									<CardHeader className="pb-1">
										<CardTitle className="text-lg font-semibold line-clamp-2">
											{product.name}
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-1">
										{product.description && (
											<CardDescription className="text-sm line-clamp-2">
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
												<Badge
													variant="secondary"
													className="text-sm font-semibold"
												>
													Giá thỏa thuận
												</Badge>
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
				) : (
					<Card className="text-center py-16 bg-gradient-to-r from-gray-50 to-gray-100 border-dashed border-2">
						<CardContent>
							<Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<p className="text-xl text-muted-foreground font-medium">
								Chưa có sản phẩm nào
							</p>
							<p className="text-sm text-muted-foreground mt-2">
								Sản phẩm sẽ được cập nhật sớm
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
