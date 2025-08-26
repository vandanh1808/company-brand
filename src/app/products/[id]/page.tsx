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
import { ArrowLeft, Package } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function ProductPage() {
	const params = useParams();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedImage, setSelectedImage] = useState(0);

	const fetchProduct = useCallback(async () => {
		try {
			const response = await fetch(`/api/products/${params.id}`);
			const data = await response.json();

			if (data.success) {
				setProduct(data.data);
			}
		} catch (error) {
			console.error("Error fetching product:", error);
		} finally {
			setLoading(false);
		}
	}, [params.id]);

	useEffect(() => {
		if (params.id) {
			fetchProduct();
		}
	}, [params.id, fetchProduct]);

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				{/* Back button skeleton */}
				<div className="mb-6">
					<Skeleton className="h-6 w-40" />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Images skeleton */}
					<div className="space-y-4">
						<Skeleton className="h-96 w-full rounded-lg" />
						<div className="grid grid-cols-4 gap-2">
							{[1, 2, 3, 4].map((i) => (
								<Skeleton
									key={i}
									className="h-20 w-full rounded"
								/>
							))}
						</div>
					</div>

					{/* Product details skeleton */}
					<div className="space-y-6">
						<div>
							<Skeleton className="h-10 w-3/4 mb-2" />
							<Skeleton className="h-6 w-1/2" />
						</div>

						<div className="flex gap-4">
							<Skeleton className="h-8 w-24" />
							<Skeleton className="h-8 w-32" />
						</div>

						<div>
							<Skeleton className="h-6 w-32 mb-2" />
							<Skeleton className="h-20 w-full" />
						</div>

						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-40" />
							</CardHeader>
							<CardContent className="space-y-2">
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-5 w-3/4" />
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">Product not found</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<Link
					href={`/brands/${product.brandId._id}`}
					className="inline-flex items-center text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to {product.brandId.name}
				</Link>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Product Images */}
				<div className="space-y-4">
					{!product.images.length && (
						<div className="relative h-96 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg">
							<Package className="w-16 h-16 text-gray-400" />
						</div>
					)}
					{product.images.length > 0 && (
						<>
							<div className="relative h-96 w-full">
								<Image
									src={product.images[selectedImage]}
									alt={product.name}
									fill
									className="object-cover rounded-lg"
								/>
							</div>

							{product.images.length > 1 && (
								<div className="grid grid-cols-4 gap-2">
									{product.images.map((image, index) => (
										<button
											key={index}
											onClick={() =>
												setSelectedImage(index)
											}
											className={`relative h-20 w-full border-2 rounded ${
												selectedImage === index
													? "border-primary"
													: "border-muted"
											}`}
										>
											<Image
												src={image}
												alt={`${product.name} ${
													index + 1
												}`}
												fill
												className="object-cover rounded"
											/>
										</button>
									))}
								</div>
							)}
						</>
					)}
				</div>

				{/* Product Details */}
				<div className="space-y-6">
					<div>
						<h1 className="text-4xl font-bold mb-2">
							{product.name}
						</h1>
						<p className="text-lg text-muted-foreground">
							by{" "}
							<Link
								href={`/brands/${product.brandId._id}`}
								className="text-primary hover:underline"
							>
								{product.brandId.name}
							</Link>
							{" • "}
							<Link
								href={`/companies/${product.brandId.companyId._id}`}
								className="text-primary hover:underline"
							>
								{product.brandId.companyId.name}
							</Link>
						</p>
					</div>

					<div>
						<Badge variant="outline" className="text-lg px-4 py-2">
							Giá: Thỏa thuận
						</Badge>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Product Description</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription className="text-base whitespace-pre-wrap">
								{product.description}
							</CardDescription>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Contact Information</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								Liên hệ với{" "}
								<Link
									href={`/companies/${product.brandId.companyId._id}`}
									className="text-primary hover:underline font-semibold"
								>
									{product.brandId.companyId.name}
								</Link>{" "}
								để biết thêm thông tin về sản phẩm và thỏa thuận
								giá cả.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
