/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import BannerSlideshow from "@/components/BannerSlideshow";
import * as Icons from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function SafeIcon(iconName?: string) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const LucideIcon =
		(iconName && (Icons as any)[iconName]) || Icons.Lightbulb;
	return <LucideIcon className="w-6 h-6 text-primary mr-3" />;
}

export default function Page() {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	const fetchProfile = async () => {
		try {
			const res = await fetch("/api/company-profile");
			if (res.ok) {
				const json = await res.json();
				if (json.success && json.data) {
					setData(json.data);
				}
			}
		} catch (error) {
			console.error("Error fetching company profile:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProfile();

		const handleRefresh = () => {
			fetchProfile();
		};

		window.addEventListener("refreshHeaderData", handleRefresh);
		return () =>
			window.removeEventListener("refreshHeaderData", handleRefresh);
	}, []);

	// Fallback sang hard data nếu chưa có dữ liệu DB
	const COMPANY_INFO = data?.companyInfo ?? {};
	const COMPANY_INTRODUCTION = data?.companyIntroduction ?? {};
	const CORE_VALUE_HEADER = data?.coreValueHeader ?? {};
	const CORE_VALUES = data?.coreValues ?? [];
	const LEADERSHIP_MESSAGE = data?.leadershipMessage ?? {};
	const CONTACT_CTA = data?.contactCTA ?? {};

	// Các điều kiện hiển thị
	const showIntro = !!(
		COMPANY_INTRODUCTION?.title ||
		COMPANY_INTRODUCTION?.description ||
		COMPANY_INTRODUCTION?.network ||
		(COMPANY_INTRODUCTION?.partners &&
			COMPANY_INTRODUCTION.partners.length > 0) ||
		COMPANY_INTRODUCTION?.additionalInfo
	);

	const showCoreValues = !!(
		CORE_VALUE_HEADER?.title ||
		CORE_VALUE_HEADER?.description ||
		(Array.isArray(CORE_VALUES) && CORE_VALUES.length > 0)
	);

	const showLeadership = !!(
		LEADERSHIP_MESSAGE?.title ||
		LEADERSHIP_MESSAGE?.message ||
		LEADERSHIP_MESSAGE?.representative ||
		LEADERSHIP_MESSAGE?.role
	);

	const showContactCTA = !!(
		CONTACT_CTA?.title ||
		CONTACT_CTA?.description ||
		COMPANY_INFO?.email ||
		COMPANY_INFO?.phone ||
		COMPANY_INFO?.address
	);

	if (loading) {
		return (
			<>
				{/* Full-width Banner Slideshow */}
				<BannerSlideshow />

				<div className="container mx-auto px-4 py-8">
					{/* Loading skeleton */}
					<div className="mb-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8">
						<div className="max-w-5xl mx-auto">
							<Skeleton className="h-12 w-96 mx-auto mb-8" />
							<div className="space-y-6">
								<Skeleton className="h-6 w-full" />
								<Skeleton className="h-6 w-5/6" />
								<Skeleton className="h-6 w-4/5" />
							</div>
						</div>
					</div>

					{/* Core values loading */}
					<div className="mb-16">
						<div className="text-center mb-12">
							<Skeleton className="h-10 w-48 mx-auto mb-4" />
							<Skeleton className="h-6 w-64 mx-auto" />
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{[1, 2, 3, 4].map((i) => (
								<Card key={i} className="h-full">
									<CardHeader>
										<Skeleton className="h-8 w-full" />
									</CardHeader>
									<CardContent>
										<Skeleton className="h-20 w-full" />
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			{/* Full-width Banner Slideshow */}
			<BannerSlideshow />

			<div className="container mx-auto px-4 py-8">
				{/* Company Introduction Section */}
				{showIntro ? (
					<section className="mb-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8">
						<div className="max-w-5xl mx-auto">
							{COMPANY_INTRODUCTION?.title ? (
								<h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
									{COMPANY_INTRODUCTION.title}
								</h1>
							) : null}

							<div className="space-y-6">
								{COMPANY_INTRODUCTION?.description ? (
									<p className="text-lg leading-relaxed text-gray-700">
										{COMPANY_INTRODUCTION.description}
									</p>
								) : null}

								{COMPANY_INTRODUCTION?.network ? (
									<p className="text-lg leading-relaxed text-gray-700">
										{COMPANY_INTRODUCTION.network}
									</p>
								) : null}

								{(COMPANY_INTRODUCTION?.partners?.length ?? 0) >
									0 ||
								COMPANY_INTRODUCTION?.additionalInfo ? (
									<div>
										{COMPANY_INTRODUCTION?.partnersTitle ? (
											<h3 className="text-xl font-semibold mb-4 text-blue-900">
												{
													COMPANY_INTRODUCTION.partnersTitle
												}
											</h3>
										) : null}

										<ul className="space-y-3">
											{(
												COMPANY_INTRODUCTION?.partners ||
												[]
											).map(
												(
													partner: any,
													index: number
												) => {
													if (
														!partner?.name &&
														!partner?.products
													)
														return null;
													return (
														<li
															key={index}
															className="flex"
														>
															<span className="text-blue-600 mr-2">
																•
															</span>
															<div>
																{partner?.name ? (
																	<span className="font-semibold text-gray-800">
																		{
																			partner.name
																		}
																		:
																	</span>
																) : null}{" "}
																{partner?.products ? (
																	<span className="text-gray-700">
																		{
																			partner.products
																		}
																	</span>
																) : null}
															</div>
														</li>
													);
												}
											)}

											{COMPANY_INTRODUCTION?.additionalInfo ? (
												<li className="flex">
													<span className="text-blue-600 mr-2">
														•
													</span>
													<span className="text-gray-700">
														{
															COMPANY_INTRODUCTION.additionalInfo
														}
													</span>
												</li>
											) : null}
										</ul>
									</div>
								) : null}
							</div>
						</div>
					</section>
				) : null}

				{/* Core Values */}
				{showCoreValues ? (
					<section className="mb-16">
						<div className="text-center mb-12">
							{CORE_VALUE_HEADER?.title ? (
								<h2 className="text-3xl font-bold mb-4">
									{CORE_VALUE_HEADER.title}
								</h2>
							) : null}
							{CORE_VALUE_HEADER?.description ? (
								<p className="text-lg text-muted-foreground">
									{CORE_VALUE_HEADER.description}
								</p>
							) : null}
						</div>

						{(CORE_VALUES?.length ?? 0) > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								{CORE_VALUES.map(
									(value: any, index: number) => {
										const IconMaybe = (value as any)?.icon;
										return (
											<Card
												key={index}
												className="h-full"
											>
												<CardHeader>
													<CardTitle className="flex items-center">
														{/* Nếu icon là component -> render; nếu là string/khác -> fallback */}
														{SafeIcon(IconMaybe)}
														{value?.title}
													</CardTitle>
												</CardHeader>
												{(value?.description ?? "") !==
												"" ? (
													<CardContent>
														<CardDescription className="text-base">
															{value.description}
														</CardDescription>
													</CardContent>
												) : null}
											</Card>
										);
									}
								)}
							</div>
						) : null}
					</section>
				) : null}

				{/* Leadership Message */}
				{showLeadership ? (
					<section className="mb-16">
						<Card className="bg-gradient-to-r from-primary/5 to-primary/10">
							<CardContent className="pt-8">
								<div className="text-center">
									{LEADERSHIP_MESSAGE?.title ? (
										<h2 className="text-2xl font-bold mb-6">
											{LEADERSHIP_MESSAGE.title}
										</h2>
									) : null}

									{LEADERSHIP_MESSAGE?.message ? (
										<blockquote className="text-lg text-muted-foreground italic max-w-4xl mx-auto leading-relaxed">
											{LEADERSHIP_MESSAGE.message}
										</blockquote>
									) : null}

									{LEADERSHIP_MESSAGE?.representative ||
									LEADERSHIP_MESSAGE?.role ? (
										<div className="mt-6">
											{LEADERSHIP_MESSAGE?.representative ? (
												<div className="font-semibold text-lg">
													{
														LEADERSHIP_MESSAGE.representative
													}
												</div>
											) : null}
											{LEADERSHIP_MESSAGE?.role ? (
												<div className="text-muted-foreground">
													{LEADERSHIP_MESSAGE.role}
												</div>
											) : null}
										</div>
									) : null}
								</div>
							</CardContent>
						</Card>
					</section>
				) : null}

				{/* Contact CTA */}
				{showContactCTA ? (
					<section className="text-center">
						<Card>
							<CardContent className="pt-8">
								{CONTACT_CTA?.title ? (
									<h3 className="text-2xl font-bold mb-4">
										{CONTACT_CTA.title}
									</h3>
								) : null}

								{CONTACT_CTA?.description ? (
									<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
										{CONTACT_CTA.description}
									</p>
								) : null}

								<div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center">
									{COMPANY_INFO?.email ? (
										<Card className="p-4 text-center min-w-[220px] sm:min-w-[260px] break-words">
											<div className="text-sm text-muted-foreground mb-1">
												Email
											</div>
											<div className="font-semibold break-all">
												<a
													href={`mailto:${COMPANY_INFO.email}`}
													className="hover:underline"
												>
													{COMPANY_INFO.email}
												</a>
											</div>
										</Card>
									) : null}

									{COMPANY_INFO?.phone ? (
										<Card className="p-4 text-center min-w-[220px] sm:min-w-[260px] break-words">
											<div className="text-sm text-muted-foreground mb-1">
												Điện thoại
											</div>
											<div className="font-semibold">
												<a
													href={`tel:${COMPANY_INFO.phone}`}
													className="hover:underline"
												>
													{COMPANY_INFO.phone}
												</a>
											</div>
										</Card>
									) : null}

									{COMPANY_INFO?.address ? (
										<Card className="p-4 text-center min-w-[220px] sm:min-w-[260px] break-words">
											<div className="text-sm text-muted-foreground mb-1">
												Địa chỉ
											</div>
											<div className="font-semibold whitespace-pre-line">
												{COMPANY_INFO.address}
											</div>
										</Card>
									) : null}
								</div>
							</CardContent>
						</Card>
					</section>
				) : null}
			</div>
		</>
	);
}
