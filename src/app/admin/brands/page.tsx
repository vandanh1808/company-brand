"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Eye, Search, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";

interface Brand {
	_id: string;
	name: string;
	description?: string;
	logo?: string;
	companyId: {
		_id: string;
		name: string;
	};
	createdAt?: string;
}

interface Company {
	_id: string;
	name: string;
}

export default function AdminBrandsPage() {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	// ---- Dialog state & form (giống logic trang create) ----
	const [isUpsertOpen, setIsUpsertOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [editing, setEditing] = useState<Brand | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		logo: "",
		companyId: "",
	});

	useEffect(() => {
		const token = localStorage.getItem("adminToken");
		if (!token) {
			router.push("/admin/login");
			return;
		}
		fetchData();
	}, [router]);

	useEffect(() => {
		const filtered = brands.filter(
			(brand) =>
				brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(brand.description &&
					brand.description
						.toLowerCase()
						.includes(searchTerm.toLowerCase())) ||
				brand.companyId.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
		);
		setFilteredBrands(filtered);
	}, [searchTerm, brands]);

	const fetchData = async () => {
		try {
			const [brandsResponse, companiesResponse] = await Promise.all([
				fetch("/api/brands"),
				fetch("/api/companies"),
			]);

			const [brandsData, companiesData] = await Promise.all([
				brandsResponse.json(),
				companiesResponse.json(),
			]);

			if (brandsData.success) {
				setBrands(brandsData.data);
			}
			if (companiesData.success) {
				setCompanies(companiesData.data);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			toast.error("Failed to fetch data");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string, name: string) => {
		// First, check if brand has products
		try {
			const productsResponse = await fetch("/api/products");
			const productsData = await productsResponse.json();
			console.log(productsData);
			const brandProducts =
				productsData.data?.filter(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(product: any) =>
						product.brandId?._id === id || product.brandId === id
				) || [];

			let warningMessage = `Bạn có chắc chắn muốn xóa thương hiệu "${name}"?`;

			if (brandProducts.length > 0) {
				warningMessage = `⚠️ CẢNH BÁO: Xóa thương hiệu "${name}" sẽ đồng thời xóa:\n\n`;
				warningMessage += `• ${brandProducts.length} sản phẩm\n\n`;
				warningMessage += `Hành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?`;
			}

			if (!confirm(warningMessage)) {
				return;
			}

			const response = await fetch(`/api/brands/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setBrands(brands.filter((brand) => brand._id !== id));
				toast.success(
					"Đã xóa thương hiệu và tất cả sản phẩm liên quan"
				);
				// Refresh header data
				window.dispatchEvent(new CustomEvent("refreshHeaderData"));
			} else {
				toast.error("Không thể xóa thương hiệu");
			}
		} catch (error) {
			console.error("Error deleting brand:", error);
			toast.error("Lỗi khi xóa thương hiệu");
		}
	};

	// ---------- Dialog helpers ----------
	const openCreate = () => {
		setEditing(null);
		setFormData({
			name: "",
			description: "",
			logo: "",
			companyId: companies[0]?._id || "",
		});
		setIsUpsertOpen(true);
	};

	const openEdit = (brand: Brand) => {
		setEditing(brand);
		setFormData({
			name: brand.name || "",
			description: brand.description || "",
			logo: brand.logo || "",
			companyId: brand.companyId?._id || companies[0]?._id || "",
		});
		setIsUpsertOpen(true);
	};

	const handleSave = async () => {
		if (!formData.name.trim()) {
			toast.error("Brand name is required");
			return;
		}
		if (!formData.companyId) {
			toast.error("Please select a company");
			return;
		}

		try {
			setSaving(true);

			if (editing) {
				// UPDATE
				const res = await fetch(`/api/brands/${editing._id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok || !data?.success)
					throw new Error(data?.error || "Update failed");

				// Nếu API trả bản ghi populate, dùng luôn; nếu không thì tự hợp nhất
				const companyName =
					companies.find((c) => c._id === formData.companyId)?.name ||
					editing.companyId.name;

				const updated: Brand = data.data ?? {
					...editing,
					name: formData.name,
					description: formData.description,
					logo: formData.logo,
					companyId: { _id: formData.companyId, name: companyName },
				};

				setBrands((prev) =>
					prev.map((b) => (b._id === editing._id ? updated : b))
				);
				toast.success("Brand updated successfully");
				// Refresh header data
				window.dispatchEvent(new CustomEvent("refreshHeaderData"));
			} else {
				// CREATE
				const res = await fetch(`/api/brands`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok || !data?.success)
					throw new Error(data?.error || "Create failed");

				const companyName =
					companies.find((c) => c._id === formData.companyId)?.name ||
					"";

				const created: Brand =
					data.data ??
					({
						_id: crypto.randomUUID(),
						name: formData.name,
						description: formData.description,
						logo: formData.logo,
						companyId: {
							_id: formData.companyId,
							name: companyName,
						},
					} as Brand);

				setBrands((prev) => [created, ...prev]);
				toast.success("Brand created successfully");
				// Refresh header data
				window.dispatchEvent(new CustomEvent("refreshHeaderData"));
			}

			setIsUpsertOpen(false);
		} catch (e: unknown) {
			toast.error(
				(e instanceof Error ? e.message : String(e)) ||
					(editing ? "Failed to update" : "Failed to create")
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-xl">Loading brands...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center space-x-4">
					<Link href="/admin">
						<Button variant="ghost" size="sm">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Dashboard
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold">Manage Brands</h1>
					</div>
				</div>
				<Button onClick={openCreate}>
					<Plus className="w-4 h-4 mr-2" />
					Add Brand
				</Button>
			</div>

			{/* Search */}
			<div className="mb-6">
				<div className="relative">
					<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search brands..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Brands
						</CardTitle>
					</CardHeader>
					<CardContent>
						{loading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold">
								{brands.length}
							</div>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Companies
						</CardTitle>
					</CardHeader>
					<CardContent>
						{loading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold">
								{companies.length}
							</div>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Filtered Results
						</CardTitle>
					</CardHeader>
					<CardContent>
						{loading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold">
								{filteredBrands.length}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Brands Table */}
			<Card>
				<CardHeader>
					<CardTitle>Brands List</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="space-y-4">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="flex items-center justify-between py-3"
								>
									<div className="space-y-2">
										<Skeleton className="h-5 w-48" />
										<Skeleton className="h-4 w-32" />
									</div>
									<div className="flex gap-2">
										<Skeleton className="h-8 w-8" />
										<Skeleton className="h-8 w-8" />
										<Skeleton className="h-8 w-8" />
									</div>
								</div>
							))}
						</div>
					) : filteredBrands.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground">
								{searchTerm
									? "No brands match your search."
									: "No brands found."}
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Brand</TableHead>
									<TableHead>Company</TableHead>
									<TableHead className="text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredBrands.map((brand) => (
									<TableRow key={brand._id}>
										<TableCell>
											<div className="flex items-center space-x-3">
												<div className="font-medium">
													{brand.name}
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="outline">
												{brand.companyId.name}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end space-x-2">
												<Link
													href={`/brands/${brand._id}`}
												>
													<Button
														variant="ghost"
														size="sm"
													>
														<Eye className="w-4 h-4" />
													</Button>
												</Link>
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														openEdit(brand)
													}
												>
													<Edit2 className="w-4 h-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														handleDelete(
															brand._id,
															brand.name
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
			{/* CREATE/EDIT Dialog (dùng đúng logic trang create) */}
			<Dialog
				open={isUpsertOpen}
				onOpenChange={(o) => !saving && setIsUpsertOpen(o)}
			>
				<DialogContent
					className="max-w-2xl"
					onPointerDownOutside={(e) => {
						if (saving) e.preventDefault();
					}}
				>
					<DialogHeader>
						<DialogTitle>
							{editing ? "Edit Brand" : "Add New Brand"}
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="name">Brand Name *</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData((p) => ({
										...p,
										name: e.target.value,
									}))
								}
								required
								placeholder="Enter brand name"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleSave();
									}
								}}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="companyId">Company *</Label>
							<Select
								value={formData.companyId}
								onValueChange={(value) =>
									setFormData((p) => ({
										...p,
										companyId: value,
									}))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a company" />
								</SelectTrigger>
								<SelectContent>
									{companies.map((company) => (
										<SelectItem
											key={company._id}
											value={company._id}
										>
											{company.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Brief description of the brand"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                type="url"
                value={formData.logo}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, logo: e.target.value }))
                }
                placeholder="https://brand.com/logo.png"
              />
            </div> */}

						{/* Preview */}
						{formData.logo && (
							<div className="space-y-2">
								<Label>Logo Preview</Label>
								<div className="w-32 h-32 border border-gray-200 rounded flex items-center justify-center bg-gray-50">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={formData.logo}
										alt="Logo preview"
										className="max-w-full max-h-full object-contain"
										onError={(e) => {
											const target =
												e.target as HTMLImageElement;
											target.style.display = "none";
										}}
									/>
								</div>
							</div>
						)}
					</div>

					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							onClick={() => setIsUpsertOpen(false)}
							disabled={saving}
						>
							Cancel
						</Button>
						<Button onClick={handleSave} disabled={saving}>
							{saving
								? "Saving..."
								: editing
								? "Save Changes"
								: "Create Brand"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
