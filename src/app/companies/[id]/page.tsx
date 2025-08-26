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
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Company {
	_id: string;
	name: string;
	description: string;
	logo?: string;
	website?: string;
	visitors: number;
}

interface Brand {
	_id: string;
	name: string;
	description?: string;
	logo?: string;
	companyId: string;
}

export default function CompanyPage() {
	const params = useParams();
	const [company, setCompany] = useState<Company | null>(null);
	const [brands, setBrands] = useState<Brand[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchCompanyData = useCallback(async () => {
		try {
			const [companyResponse, brandsResponse] = await Promise.all([
				fetch(`/api/companies/${params.id}`),
				fetch(`/api/brands?companyId=${params.id}`),
			]);

			const companyData = await companyResponse.json();
			const brandsData = await brandsResponse.json();

			if (companyData.success) {
				setCompany(companyData.data);
			}

			if (brandsData.success) {
				setBrands(brandsData.data);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	}, [params.id]);

	useEffect(() => {
		if (params.id) {
			fetchCompanyData();
		}
	}, [params.id, fetchCompanyData]);

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				{/* Back button skeleton */}
				<div className="mb-6">
					<Skeleton className="h-6 w-32" />
				</div>

				{/* Company header skeleton */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<Skeleton className="h-10 w-64" />
						<Skeleton className="h-8 w-24" />
					</div>
					<Skeleton className="h-6 w-full max-w-2xl mb-2" />
					<Skeleton className="h-6 w-3/4 max-w-xl mb-4" />
					<Skeleton className="h-6 w-32" />
				</div>

				{/* Brands section skeleton */}
				<div className="mb-8">
					<Skeleton className="h-8 w-32 mb-6" />
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[1, 2, 3].map((i) => (
							<Card key={i} className="h-full">
								<CardHeader>
									<Skeleton className="h-6 w-3/4" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-4 w-full mb-2" />
									<Skeleton className="h-4 w-5/6" />
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (!company) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">Company not found</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<Link
					href="/"
					className="inline-flex items-center text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Companies
				</Link>
			</div>

			<div className="mb-8">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-4xl font-bold">{company.name}</h1>
					<Badge variant="outline" className="text-lg px-4 py-2">
						{company.visitors} visitors
					</Badge>
				</div>
				<p className="text-xl text-muted-foreground mb-4">
					{company.description}
				</p>

				{company.website && (
					<div className="mb-6">
						<a
							href={company.website}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline text-lg"
						>
							Visit Website →
						</a>
					</div>
				)}
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-6">Our Brands</h2>

				{brands.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{brands.map((brand) => (
							<Link key={brand._id} href={`/brands/${brand._id}`}>
								<Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
									<CardHeader>
										<CardTitle className="text-xl">
											{brand.name}
										</CardTitle>
									</CardHeader>
									{brand.description && (
										<CardContent>
											<CardDescription className="text-base">
												{brand.description}
											</CardDescription>
										</CardContent>
									)}
								</Card>
							</Link>
						))}
					</div>
				) : (
					<div className="text-center py-12 bg-muted rounded-lg">
						<p className="text-lg text-muted-foreground">
							No brands available yet
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
