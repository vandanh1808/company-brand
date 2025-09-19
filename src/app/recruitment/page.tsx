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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	ArrowLeft,
	Mail,
	Phone,
	MapPin,
	Users,
	Target,
	Award,
	CalendarDays,
	Briefcase,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageSpinner } from "@/components/ui/spinner";

interface JobOpening {
	_id: string;
	title: string;
	description: string;
	requirements: string;
	salaryText: string;
	quantityText: string;
	location: string;
	experience: string;
	postedAt: string;
	deadline: string;
	status: "active" | "inactive" | "closed";
}

function RecruitmentJobCard({ job }: { job: JobOpening }) {
	// tách yêu cầu theo xuống dòng hoặc theo dấu '-'
	const requirementList = job.requirements
		.split(/\n|-/) // cắt theo xuống dòng hoặc dấu -
		.map((r) => r.trim())
		.filter((r) => r.length > 0);

	return (
		<Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow py-0">
			{/* Header gradient */}
			<div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-4 rounded-t-2xl">
				<h3 className="text-xl md:text-2xl font-semibold text-center">
					{job.title}
				</h3>
			</div>

			<div className="p-6 pt-0 space-y-6">
				{/* description */}
				<p className="text-muted-foreground">{job.description}</p>

				{/* yêu cầu công việc */}
				<div className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-100 relative">
					<div className="absolute left-0 top-0 h-full w-1.5 bg-violet-600 rounded-l-xl" />
					<div className="pl-2 md:pl-3">
						<p className="font-semibold mb-3">Yêu cầu công việc:</p>
						<ul className="space-y-2 text-[15px] text-slate-700">
							{requirementList.map((item, idx) => (
								<li key={idx} className="flex">
									<span className="mr-2">-</span>
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Mức lương + Số lượng */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="rounded-xl border border-slate-200 bg-white p-4">
						<div className="text-[12px] tracking-wide text-slate-500 font-semibold">
							MỨC LƯƠNG
						</div>
						<div className="mt-2 text-emerald-600 font-semibold">
							{job.salaryText}
						</div>
					</div>
					<div className="rounded-xl border border-slate-200 bg-gradient-to-tr from-slate-50 to-white p-4">
						<div className="text-[12px] tracking-wide text-slate-500 font-semibold">
							SỐ LƯỢNG
						</div>
						<div className="mt-2 text-slate-900 font-semibold">
							{job.quantityText}
						</div>
					</div>
				</div>

				{/* thông tin phụ */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm rounded-xl border border-slate-200 bg-white p-4">
					<div className="flex items-center gap-3">
						<MapPin className="w-4 h-4 text-slate-500" />
						<span>{job.location}</span>
					</div>
					<div className="flex items-center gap-3">
						<Briefcase className="w-4 h-4 text-slate-500" />
						<span>{job.experience}</span>
					</div>
					<div className="flex items-center gap-3">
						<CalendarDays className="w-4 h-4 text-slate-500" />
						<span>
							Đăng:{" "}
							{new Date(job.postedAt).toLocaleDateString("vi-VN")}
						</span>
					</div>
					<div className="flex items-center gap-3">
						<CalendarDays className="w-4 h-4 text-slate-500" />
						<span>
							Hạn:{" "}
							{new Date(job.deadline).toLocaleDateString("vi-VN")}
						</span>
					</div>
				</div>
			</div>
		</Card>
	);
}

export default function RecruitmentPage() {
	const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
	const [companyProfile, setCompanyProfile] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchData();

		const handleRefresh = () => {
			fetchData();
		};

		window.addEventListener("refreshHeaderData", handleRefresh);
		return () =>
			window.removeEventListener("refreshHeaderData", handleRefresh);
	}, []);

	const fetchData = async () => {
		try {
			const [jobsRes, profileRes] = await Promise.all([
				fetch("/api/job-openings?status=active"),
				fetch("/api/company-profile"),
			]);

			const jobsData = await jobsRes.json();
			const profileData = await profileRes.json();

			if (jobsData.success) {
				setJobOpenings(jobsData.data);
			}
			if (profileData.success && profileData.data) {
				setCompanyProfile(profileData.data);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<Link
					href="/"
					className="inline-flex items-center text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Quay lại trang chủ
				</Link>
			</div>

			{/* Hero Banner */}
			<div className="relative h-64 md:h-80 mb-12 rounded-lg overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
				<div className="relative z-10 flex items-center justify-center h-full text-white text-center">
					<div>
						<h1 className="text-4xl md:text-6xl font-bold mb-4">
							{companyProfile?.name || "Vĩnh Tường Hưng"}
						</h1>
						<p className="text-xl md:text-2xl">
							Làm việc hăng say, dựng xây tương lai
						</p>
					</div>
				</div>
			</div>

			{/* Company Information */}
			<section className="mb-12">
				<h2 className="text-3xl font-bold mb-8">
					Về {companyProfile?.name || "Vĩnh Tường Hưng"}
				</h2>

				<Card className="mt-8">
					<CardHeader>
						<CardTitle className="flex items-center">
							<MapPin className="w-5 h-5 mr-2" />
							Thông tin liên hệ
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{companyProfile?.companyInfo?.address && (
								<div className="flex items-center">
									<MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
									<span>
										{companyProfile.companyInfo.address}
									</span>
								</div>
							)}
							{companyProfile?.companyInfo?.phone && (
								<div className="flex items-center">
									<Phone className="w-4 h-4 mr-3 text-muted-foreground" />
									<a
										href={`tel:${companyProfile.companyInfo.phone}`}
										className="hover:underline"
									>
										{companyProfile.companyInfo.phone}
									</a>
								</div>
							)}
							{companyProfile?.companyInfo?.email && (
								<div className="flex items-center">
									<Mail className="w-4 h-4 mr-3 text-muted-foreground" />
									<a
										href={`mailto:${companyProfile.companyInfo.email}`}
										className="hover:underline"
									>
										{companyProfile.companyInfo.email}
									</a>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</section>

			{/* Job Openings */}
			<section className="mb-12">
				<h2 className="text-3xl font-bold mb-8">Tin tuyển dụng</h2>

				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{[1, 2].map((i) => (
							<Card
								key={i}
								className="overflow-hidden rounded-2xl"
							>
								<Skeleton className="h-16 rounded-none" />
								<div className="p-6 space-y-6">
									<Skeleton className="h-20" />
									<div className="rounded-xl border p-5">
										<Skeleton className="h-5 w-32 mb-3" />
										<div className="space-y-2">
											<Skeleton className="h-4 w-full" />
											<Skeleton className="h-4 w-5/6" />
											<Skeleton className="h-4 w-4/5" />
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<Skeleton className="h-20 rounded-xl" />
										<Skeleton className="h-20 rounded-xl" />
									</div>
									<Skeleton className="h-24 rounded-xl" />
								</div>
							</Card>
						))}
					</div>
				) : jobOpenings.length === 0 ? (
					<div className="text-center py-8">
						<div className="text-lg text-muted-foreground">
							Hiện tại chưa có tin tuyển dụng nào.
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{jobOpenings.map((job) => (
							<RecruitmentJobCard key={job._id} job={job} />
						))}
					</div>
				)}
			</section>
		</div>
	);
}
