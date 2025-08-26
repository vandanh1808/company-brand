"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
	Plus,
	Edit2,
	Trash2,
	Search,
	ArrowLeft,
	Briefcase,
	Calendar,
	MapPin,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";

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
	createdAt?: string;
}

export default function AdminJobOpeningsPage() {
	const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
	const [filteredJobs, setFilteredJobs] = useState<JobOpening[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [statusFilter, setStatusFilter] = useState("all");
	const router = useRouter();

	const [isUpsertOpen, setIsUpsertOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [editing, setEditing] = useState<JobOpening | null>(null);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		requirements: "",
		salaryText: "",
		quantityText: "",
		location: "",
		experience: "",
		deadline: "",
		status: "active" as "active" | "inactive" | "closed",
	});

	useEffect(() => {
		const token = localStorage.getItem("adminToken");
		if (!token) {
			router.push("/admin/login");
			return;
		}
		fetchJobOpenings();
	}, [router]);

	useEffect(() => {
		let filtered = jobOpenings;

		// Filter by search term
		if (searchTerm) {
			filtered = filtered.filter(
				(job) =>
					job.title
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					job.description
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					job.location
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
			);
		}

		// Filter by status
		if (statusFilter !== "all") {
			filtered = filtered.filter((job) => job.status === statusFilter);
		}

		setFilteredJobs(filtered);
	}, [searchTerm, statusFilter, jobOpenings]);

	const fetchJobOpenings = async () => {
		try {
			const response = await fetch("/api/job-openings");
			const data = await response.json();
			if (data.success) {
				setJobOpenings(data.data);
			}
		} catch (error) {
			console.error("Error fetching job openings:", error);
			toast.error("Không thể tải danh sách tuyển dụng");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string, title: string) => {
		if (!confirm(`Bạn có chắc chắn muốn xóa vị trí "${title}"?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/job-openings/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setJobOpenings(jobOpenings.filter((job) => job._id !== id));
				toast.success("Đã xóa tin tuyển dụng thành công");
			} else {
				toast.error("Không thể xóa tin tuyển dụng");
			}
		} catch (error) {
			console.error("Error deleting job opening:", error);
			toast.error("Lỗi khi xóa tin tuyển dụng");
		}
	};

	const openCreate = () => {
		setEditing(null);
		setFormData({
			title: "",
			description: "",
			requirements: "",
			salaryText: "",
			quantityText: "",
			location: "",
			experience: "",
			deadline: "",
			status: "active",
		});
		setIsUpsertOpen(true);
	};

	const openEdit = (job: JobOpening) => {
		setEditing(job);
		setFormData({
			title: job.title || "",
			description: job.description || "",
			requirements: job.requirements || "",
			salaryText: job.salaryText || "",
			quantityText: job.quantityText || "",
			location: job.location || "",
			experience: job.experience || "",
			deadline: job.deadline
				? new Date(job.deadline).toISOString().split("T")[0]
				: "",
			status:
				(job.status as "active" | "inactive" | "closed") || "active",
		});
		setIsUpsertOpen(true);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		if (!formData.title.trim()) {
			toast.error("Tiêu đề công việc là bắt buộc");
			return;
		}
		if (!formData.description.trim()) {
			toast.error("Mô tả công việc là bắt buộc");
			return;
		}
		if (!formData.requirements.trim()) {
			toast.error("Yêu cầu công việc là bắt buộc");
			return;
		}
		if (!formData.deadline) {
			toast.error("Hạn nộp hồ sơ là bắt buộc");
			return;
		}

		try {
			setSaving(true);
			if (editing) {
				// UPDATE
				const res = await fetch(`/api/job-openings/${editing._id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok || !data?.success)
					throw new Error(data?.error || "Cập nhật thất bại");

				const updated = data.data ?? { ...editing, ...formData };
				setJobOpenings((prev) =>
					prev.map((job) => (job._id === editing._id ? updated : job))
				);
				toast.success("Đã cập nhật tin tuyển dụng thành công");
			} else {
				// CREATE
				const res = await fetch(`/api/job-openings`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok || !data?.success)
					throw new Error(data?.error || "Tạo mới thất bại");

				const created = data.data ?? {
					...formData,
					_id: crypto.randomUUID(),
				};
				setJobOpenings((prev) => [created, ...prev]);
				toast.success("Đã tạo tin tuyển dụng thành công");
			}
			setIsUpsertOpen(false);
		} catch (e: unknown) {
			toast.error(
				(e instanceof Error ? e.message : String(e)) ||
					(editing ? "Không thể cập nhật" : "Không thể tạo mới")
			);
		} finally {
			setSaving(false);
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return (
					<Badge className="bg-green-100 text-green-800">
						Đang tuyển
					</Badge>
				);
			case "inactive":
				return <Badge variant="secondary">Tạm dừng</Badge>;
			case "closed":
				return <Badge variant="destructive">Đã đóng</Badge>;
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-xl">
						Đang tải dữ liệu tuyển dụng...
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center space-x-4">
						<Link href="/admin">
							<Button variant="ghost" size="sm">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Về Dashboard
							</Button>
						</Link>
						<div>
							<h1 className="text-3xl font-bold">
								Quản lý Tuyển dụng
							</h1>
							<p className="text-muted-foreground">
								Quản lý thông tin tuyển dụng của công ty
							</p>
						</div>
					</div>
					<Button onClick={openCreate}>
						<Plus className="w-4 h-4 mr-2" />
						Thêm tin tuyển dụng
					</Button>
				</div>

				{/* Filters */}
				<div className="flex gap-4 mb-6">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Tìm kiếm theo tiêu đề, mô tả, địa điểm..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Select
						value={statusFilter}
						onValueChange={setStatusFilter}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Lọc theo trạng thái" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tất cả</SelectItem>
							<SelectItem value="active">Đang tuyển</SelectItem>
							<SelectItem value="inactive">Tạm dừng</SelectItem>
							<SelectItem value="closed">Đã đóng</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Tổng số vị trí
							</CardTitle>
							<Briefcase className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{jobOpenings.length}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Đang tuyển
							</CardTitle>
							<div className="h-2 w-2 bg-green-500 rounded-full" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{
									jobOpenings.filter(
										(job) => job.status === "active"
									).length
								}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Tạm dừng
							</CardTitle>
							<div className="h-2 w-2 bg-gray-500 rounded-full" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{
									jobOpenings.filter(
										(job) => job.status === "inactive"
									).length
								}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Kết quả lọc
							</CardTitle>
							<Search className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{filteredJobs.length}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Job Openings Table */}
				<Card>
					<CardHeader>
						<CardTitle>Danh sách tuyển dụng</CardTitle>
					</CardHeader>
					<CardContent>
						{filteredJobs.length === 0 ? (
							<div className="text-center py-8">
								<p className="text-muted-foreground">
									{searchTerm || statusFilter !== "all"
										? "Không có tin tuyển dụng nào phù hợp."
										: "Chưa có tin tuyển dụng nào."}
								</p>
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Vị trí tuyển dụng</TableHead>
										<TableHead>Thông tin</TableHead>
										<TableHead>Trạng thái</TableHead>
										<TableHead>Hạn nộp</TableHead>
										<TableHead className="text-right">
											Thao tác
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredJobs.map((job) => (
										<TableRow key={job._id}>
											<TableCell>
												<div>
													<div className="font-medium">
														{job.title}
													</div>
													<div className="text-sm text-muted-foreground">
														{job.description
															.length > 60
															? `${job.description.substring(
																	0,
																	60
															  )}...`
															: job.description}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="space-y-1">
													<div className="flex items-center text-sm">
														<MapPin className="w-3 h-3 mr-1" />
														{job.location}
													</div>
													<div className="text-sm text-muted-foreground">
														Lương: {job.salaryText}
													</div>
													<div className="text-sm text-muted-foreground">
														Số lượng:{" "}
														{job.quantityText}
													</div>
												</div>
											</TableCell>
											<TableCell>
												{getStatusBadge(job.status)}
											</TableCell>
											<TableCell>
												<div className="flex items-center text-sm">
													<Calendar className="w-3 h-3 mr-1" />
													{new Date(
														job.deadline
													).toLocaleDateString(
														"vi-VN"
													)}
												</div>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end space-x-2">
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															openEdit(job)
														}
													>
														<Edit2 className="w-4 h-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															handleDelete(
																job._id,
																job.title
															)
														}
														className="text-red-600 hover:text-red-700"
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</div>

			<Dialog
				open={isUpsertOpen}
				onOpenChange={(o) => !saving && setIsUpsertOpen(o)}
			>
				<DialogContent
					className="max-w-3xl max-h-[90vh] overflow-y-auto"
					onPointerDownOutside={(e) => {
						if (saving) e.preventDefault();
					}}
				>
					<DialogHeader>
						<DialogTitle>
							{editing
								? "Chỉnh sửa tin tuyển dụng"
								: "Thêm tin tuyển dụng mới"}
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="title">
									Tiêu đề công việc *
								</Label>
								<Input
									id="title"
									name="title"
									value={formData.title}
									onChange={handleChange}
									required
									placeholder="Ví dụ: Kế toán tổng hợp"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="status">Trạng thái</Label>
								<Select
									value={formData.status}
									onValueChange={(value) =>
										handleSelectChange("status", value)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="active">
											Đang tuyển
										</SelectItem>
										<SelectItem value="inactive">
											Tạm dừng
										</SelectItem>
										<SelectItem value="closed">
											Đã đóng
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">
								Mô tả công việc *
							</Label>
							<Textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								required
								rows={3}
								placeholder="Mô tả ngắn về công việc và trách nhiệm..."
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="requirements">
								Yêu cầu công việc *
							</Label>
							<Textarea
								id="requirements"
								name="requirements"
								value={formData.requirements}
								onChange={handleChange}
								required
								rows={5}
								placeholder="- Tốt nghiệp Đại học chuyên ngành...&#10;- Có kinh nghiệm 2-3 năm...&#10;- Thành thạo phần mềm..."
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="salaryText">Mức lương</Label>
								<Input
									id="salaryText"
									name="salaryText"
									value={formData.salaryText}
									onChange={handleChange}
									placeholder="Ví dụ: Thỏa thuận, 12-15 triệu"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="quantityText">
									Số lượng tuyển
								</Label>
								<Input
									id="quantityText"
									name="quantityText"
									value={formData.quantityText}
									onChange={handleChange}
									placeholder="Ví dụ: 1 người, 2 người"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="location">
									Địa điểm làm việc
								</Label>
								<Input
									id="location"
									name="location"
									value={formData.location}
									onChange={handleChange}
									placeholder="Ví dụ: TP. Hồ Chí Minh"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="experience">
									Kinh nghiệm yêu cầu
								</Label>
								<Input
									id="experience"
									name="experience"
									value={formData.experience}
									onChange={handleChange}
									placeholder="Ví dụ: 2-3 năm"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="deadline">Hạn nộp hồ sơ *</Label>
							<Input
								id="deadline"
								name="deadline"
								type="date"
								value={formData.deadline}
								onChange={handleChange}
								required
								min={new Date().toISOString().split("T")[0]}
							/>
						</div>
					</div>

					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							onClick={() => setIsUpsertOpen(false)}
							disabled={saving}
						>
							Hủy
						</Button>
						<Button onClick={handleSave} disabled={saving}>
							{saving
								? "Đang lưu..."
								: editing
								? "Cập nhật"
								: "Tạo mới"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
