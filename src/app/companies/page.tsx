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

interface Company {
	_id: string;
	name: string;
	description?: string;
	address?: string;
	phone?: string;
	email?: string;
	website?: string;
	logo?: string;
	visitors?: number;
	createdAt?: string;
}

// Hard-coded company info for frontend display
const companyInfo: Record<
	string,
	{
		tagline: string;
		services: string[];
		founded: string;
		description: string;
		employees: string;
	}
> = {
	default: {
		tagline: "Leading enterprise solutions provider",
		services: ["Technology", "Consulting", "Innovation"],
		founded: "2020",
		description: "",
		employees: "500+",
	},
};

export default function CompaniesPage() {
	const [companies, setCompanies] = useState<Company[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCompanies();
	}, []);

	const fetchCompanies = async () => {
		try {
			const response = await fetch("/api/companies");
			const data = await response.json();
			if (data.success) {
				setCompanies(data.data);
			}
		} catch (error) {
			console.error("Error fetching companies:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-center items-center min-h-[400px]">
					<div className="text-xl">Loading companies...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-4xl font-bold mb-2">Our Companies</h1>
				<p className="text-lg text-muted-foreground">
					Explore our portfolio of leading enterprises
				</p>
			</div>

			{companies.length === 0 ? (
				<Card>
					<CardContent className="py-8">
						<p className="text-center text-muted-foreground">
							No companies available at the moment.
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{companies.map((company) => (
						<Link
							key={company._id}
							href={`/companies/${company._id}`}
						>
							<Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
								<CardHeader>
									{company.logo && (
										<div className="w-full h-32 mb-4 bg-gray-100 rounded flex items-center justify-center">
											<img
												src={company.logo}
												alt={company.name}
												className="max-h-full max-w-full object-contain"
											/>
										</div>
									)}
									<CardTitle>{company.name}</CardTitle>
									<CardDescription>
										{companyInfo.default.tagline}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-2 text-sm">
										<div>
											<span className="font-semibold">
												Founded:
											</span>{" "}
											{companyInfo.default.founded}
										</div>
										<div>
											<span className="font-semibold">
												Employees:
											</span>{" "}
											{companyInfo.default.employees}
										</div>
										<div>
											<span className="font-semibold">
												Services:
											</span>{" "}
											{companyInfo.default.services.join(
												", "
											)}
										</div>
										{company.visitors && (
											<div className="pt-2 border-t">
												<span className="font-semibold">
													Visitors:
												</span>{" "}
												<span className="text-primary">
													{company.visitors.toLocaleString()}
												</span>
											</div>
										)}
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
