// =============================
// app/admin/company-profile/page.tsx (Admin UI)
// =============================
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import IconPicker from "@/components/IconPicker";

const schema = z.object({
	name: z.string().min(1, "Bắt buộc"),
	logo: z.string().default(""),
	updatedBy: z.string().optional(),
	companyInfo: z.object({
		email: z.string().email().optional().or(z.literal("")),
		phone: z.string().optional().or(z.literal("")),
		address: z.string().optional().or(z.literal("")),
		website: z.string().url().optional().or(z.literal("")),
	}),
	companyIntroduction: z.object({
		title: z.string().default("Giới thiệu"),
		description: z.string().default(""),
		network: z.string().default(""),
		partnersTitle: z.string().default("Đối tác"),
		additionalInfo: z.string().default(""),
		partners: z
			.array(
				z.object({ name: z.string(), products: z.string().optional() })
			)
			.default([]),
	}),
	coreValueHeader: z.object({
		title: z.string().default("Giá trị cốt lõi"),
		description: z.string().default(""),
	}),
	coreValues: z
		.array(
			z.object({
				title: z.string(),
				description: z.string().default(""),
				icon: z.string().default("Lightbulb"),
			})
		)
		.default([]),
	leadershipMessage: z.object({
		title: z.string().default("Thông điệp lãnh đạo"),
		message: z.string().default(""),
		representative: z.string().default(""),
		role: z.string().default(""),
	}),
	contactCTA: z.object({
		title: z.string().default("Liên hệ"),
		description: z.string().default(""),
	}),
});

export default function AdminCompanyProfilePage() {
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = useForm({ resolver: zodResolver(schema) });

	const {
		fields: partnerFields,
		append: appendPartner,
		remove: removePartner,
	} = useFieldArray({ control, name: "companyIntroduction.partners" });

	const {
		fields: valueFields,
		append: appendValue,
		remove: removeValue,
	} = useFieldArray({ control, name: "coreValues" });
	console.log("valueFields: ", valueFields);
	useEffect(() => {
		(async () => {
			try {
				const res = await fetch("/api/company-profile");
				const data = await res.json();
				if (data?.data) reset(data.data);
			} catch (e) {
				/* noop */
			}
		})();
	}, [reset]);

	async function onSubmit(values: any) {
		try {
			const res = await fetch("/api/company-profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});
			const data = await res.json();
			if (!res.ok || !data?.success)
				throw new Error(data?.error || "Lỗi");
			toast.success("Đã lưu hồ sơ công ty");
			window.dispatchEvent(new CustomEvent("refreshHeaderData"));
		} catch (e: any) {
			toast.error(e?.message || "Lưu thất bại");
		}
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">
						Quản lý Thông tin Công ty
					</h1>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
					</Button>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Thông tin cơ bản</CardTitle>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 gap-4">
						<div>
							<Label>Tên công ty *</Label>
							<Input
								{...register("name")}
								placeholder="Vĩnh Tường Hưng"
							/>
						</div>
						<div>
							<Label>Logo URL</Label>
							<Input
								{...register("logo")}
								placeholder="https://...png"
							/>
						</div>
						<div>
							<Label>Email</Label>
							<Input
								{...register("companyInfo.email")}
								placeholder="contact@..."
							/>
						</div>
						<div>
							<Label>Điện thoại</Label>
							<Input
								{...register("companyInfo.phone")}
								placeholder="(+84) ..."
							/>
						</div>
						<div className="md:col-span-2">
							<Label>Địa chỉ</Label>
							<Input {...register("companyInfo.address")} />
						</div>
						<div className="md:col-span-2">
							<Label>Website</Label>
							<Input
								{...register("companyInfo.website")}
								placeholder="https://..."
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Giới thiệu</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<Label>Tiêu đề</Label>
								<Input
									{...register("companyIntroduction.title")}
								/>
							</div>
							<div>
								<Label>Tiêu đề đối tác</Label>
								<Input
									{...register(
										"companyIntroduction.partnersTitle"
									)}
								/>
							</div>
						</div>
						<div>
							<Label>Mô tả</Label>
							<Textarea
								rows={4}
								{...register("companyIntroduction.description")}
							/>
						</div>
						<div>
							<Label>Mạng lưới</Label>
							<Textarea
								rows={3}
								{...register("companyIntroduction.network")}
							/>
						</div>
						<div>
							<Label>Thông tin bổ sung</Label>
							<Textarea
								rows={3}
								{...register(
									"companyIntroduction.additionalInfo"
								)}
							/>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label className="font-semibold">Đối tác</Label>
								<Button
									type="button"
									variant="secondary"
									onClick={() =>
										appendPartner({
											name: "",
											products: "",
										})
									}
								>
									Thêm đối tác
								</Button>
							</div>
							<div className="space-y-3">
								{partnerFields.map((f, i) => (
									<div
										key={f.id}
										className="grid md:grid-cols-3 gap-3 items-end"
									>
										<div className="md:col-span-1">
											<Label>Tên</Label>
											<Input
												{...register(
													`companyIntroduction.partners.${i}.name` as const
												)}
											/>
										</div>
										<div className="md:col-span-2">
											<Label>Sản phẩm/Dịch vụ</Label>
											<Input
												{...register(
													`companyIntroduction.partners.${i}.products` as const
												)}
											/>
										</div>
										<div className="md:col-span-3 flex justify-end">
											<Button
												type="button"
												variant="ghost"
												onClick={() => removePartner(i)}
											>
												Xóa
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Giá trị cốt lõi</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<Label>Tiêu đề</Label>
								<Input {...register("coreValueHeader.title")} />
							</div>
							<div>
								<Label>Mô tả</Label>
								<Input
									{...register("coreValueHeader.description")}
								/>
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label className="font-semibold">
									Danh sách giá trị
								</Label>
								<Button
									type="button"
									variant="secondary"
									onClick={() =>
										appendValue({
											title: "",
											description: "",
											icon: "Lightbulb",
										})
									}
								>
									Thêm giá trị
								</Button>
							</div>

							{valueFields.map((f, i) => (
								<div
									key={f.id}
									className="grid md:grid-cols-3 gap-3"
								>
									<div>
										<Label>Tiêu đề</Label>
										<Input
											{...register(
												`coreValues.${i}.title` as const
											)}
										/>
									</div>
									<div>
										<Label>Mô tả</Label>
										<Input
											{...register(
												`coreValues.${i}.description` as const
											)}
										/>
									</div>
									<div>
										<Label>Icon (lucide)</Label>
										<Controller
											name={
												`coreValues.${i}.icon` as const
											}
											control={control}
											defaultValue="Lightbulb"
											render={({ field }) => (
												<IconPicker
													value={field.value}
													onChange={field.onChange}
													placeholder="Target | Heart | Shield…"
												/>
											)}
										/>
									</div>
									<div className="md:col-span-3 flex justify-end">
										<Button
											type="button"
											variant="ghost"
											onClick={() => removeValue(i)}
										>
											Xóa
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Thông điệp lãnh đạo & Liên hệ</CardTitle>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 gap-4">
						<div className="md:col-span-2">
							<Label>Tiêu đề</Label>
							<Input {...register("leadershipMessage.title")} />
						</div>
						<div className="md:col-span-2">
							<Label>Thông điệp</Label>
							<Textarea
								rows={4}
								{...register("leadershipMessage.message")}
							/>
						</div>
						<div>
							<Label>Người đại diện</Label>
							<Input
								{...register(
									"leadershipMessage.representative"
								)}
							/>
						</div>
						<div>
							<Label>Chức vụ</Label>
							<Input {...register("leadershipMessage.role")} />
						</div>
						<div>
							<Label>CTA Tiêu đề</Label>
							<Input {...register("contactCTA.title")} />
						</div>
						<div>
							<Label>CTA Mô tả</Label>
							<Input {...register("contactCTA.description")} />
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
					</Button>
				</div>
			</form>
		</div>
	);
}
