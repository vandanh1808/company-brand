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

export default function AdminCompaniesPage() {
	const [companies, setCompanies] = useState<Company[]>([]);
	const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const [isUpsertOpen, setIsUpsertOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [editing, setEditing] = useState<Company | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		address: "",
		phone: "",
		email: "",
		website: "",
		logo: "",
	});

	useEffect(() => {
		const token = localStorage.getItem("adminToken");
		if (!token) {
			router.push("/admin/login");
			return;
		}
		fetchCompanies();
	}, [router]);

	useEffect(() => {
		const filtered = companies.filter(
			(company) =>
				company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(company.description &&
					company.description
						.toLowerCase()
						.includes(searchTerm.toLowerCase()))
		);
		setFilteredCompanies(filtered);
	}, [searchTerm, companies]);

	const fetchCompanies = async () => {
		try {
			const response = await fetch("/api/companies");
			const data = await response.json();
			if (data.success) {
				setCompanies(data.data);
			}
		} catch (error) {
			console.error("Error fetching companies:", error);
			toast.error("Failed to fetch companies");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string, name: string) => {
		// First, check if company has brands
		try {
			const brandsResponse = await fetch("/api/brands");
			const brandsData = await brandsResponse.json();
			const companyBrands =
				brandsData.data?.filter(
					(brand: any) =>
						brand.companyId?._id === id || brand.companyId === id
				) || [];

			let warningMessage = `Bạn có chắc chắn muốn xóa công ty "${name}"?`;

			if (companyBrands.length > 0) {
				warningMessage = `⚠️ CẢNH BÁO: Xóa công ty "${name}" sẽ đồng thời xóa:\n\n`;
				warningMessage += `• ${companyBrands.length} thương hiệu\n`;
				warningMessage += `• Tất cả sản phẩm liên quan\n\n`;
				warningMessage += `Hành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?`;
			}

			if (!confirm(warningMessage)) {
				return;
			}

			const response = await fetch(`/api/companies/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setCompanies(companies.filter((company) => company._id !== id));
				toast.success("Đã xóa công ty và tất cả dữ liệu liên quan");
				// Refresh header data
				window.dispatchEvent(new CustomEvent("refreshHeaderData"));
			} else {
				toast.error("Không thể xóa công ty");
			}
		} catch (error) {
			console.error("Error deleting company:", error);
			toast.error("Lỗi khi xóa công ty");
		}
	};

	const openCreate = () => {
		setEditing(null);
		setFormData({
			name: "",
			description: "",
			address: "",
			phone: "",
			email: "",
			website: "",
			logo: "",
		});
		setIsUpsertOpen(true);
	};

	const openEdit = (company: Company) => {
		setEditing(company);
		setFormData({
			name: company.name || "",
			description: company.description || "",
			address: company.address || "",
			phone: company.phone || "",
			email: company.email || "",
			website: company.website || "",
			logo: company.logo || "",
		});
		setIsUpsertOpen(true);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		if (!formData.name.trim()) {
			toast.error("Company name is required");
			return;
		}
		try {
			setSaving(true);
			if (editing) {
				// UPDATE
				const res = await fetch(`/api/companies/${editing._id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok || !data?.success)
					throw new Error(data?.error || "Update failed");

				const updated = data.data ?? { ...editing, ...formData };
				setCompanies((prev) =>
					prev.map((c) => (c._id === editing._id ? updated : c))
				);
				toast.success("Company updated successfully");
				// Refresh header data
				window.dispatchEvent(new CustomEvent("refreshHeaderData"));
			} else {
				// CREATE
				const res = await fetch(`/api/companies`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ ...formData, visitors: 0 }),
				});
				const data = await res.json();
				if (!res.ok || !data?.success)
					throw new Error(data?.error || "Create failed");

				const created = data.data ?? {
					...formData,
					_id: crypto.randomUUID(),
					visitors: 0,
				};
				setCompanies((prev) => [created, ...prev]);
				toast.success("Company created successfully");
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
					<div className="text-xl">Loading companies...</div>
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
								Back to Dashboard
							</Button>
						</Link>
						<div>
							<h1 className="text-3xl font-bold">
								Manage Companies
							</h1>
							{/* <p className="text-muted-foreground">
              Add, edit, or delete companies in the system
            </p> */}
						</div>
					</div>
					{/* <Link href="/admin/companies/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </Button>
        </Link> */}
					<Button onClick={openCreate}>
						<Plus className="w-4 h-4 mr-2" />
						Add Company
					</Button>
				</div>

				{/* Search */}
				<div className="mb-6">
					<div className="relative">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search companies..."
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
								Total Visitors
							</CardTitle>
						</CardHeader>
						<CardContent>
							{loading ? (
								<Skeleton className="h-8 w-20" />
							) : (
								<div className="text-2xl font-bold">
									{companies.reduce(
										(sum, company) =>
											sum + (company.visitors || 0),
										0
									)}
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
									{filteredCompanies.length}
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Companies Table */}
				<Card>
					<CardHeader>
						<CardTitle>Companies List</CardTitle>
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
											<Skeleton className="h-4 w-64" />
										</div>
										<div className="flex gap-2">
											<Skeleton className="h-8 w-8" />
											<Skeleton className="h-8 w-8" />
											<Skeleton className="h-8 w-8" />
										</div>
									</div>
								))}
							</div>
						) : filteredCompanies.length === 0 ? (
							<div className="text-center py-8">
								<p className="text-muted-foreground">
									{searchTerm
										? "No companies match your search."
										: "No companies found."}
								</p>
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Company</TableHead>
										{/* <TableHead>Contact</TableHead> */}
										<TableHead>Visitors</TableHead>
										{/* <TableHead>Created</TableHead> */}
										<TableHead className="text-right">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredCompanies.map((company) => (
										<TableRow key={company._id}>
											<TableCell>
												<div>
													<div className="font-medium">
														{company.name}
													</div>
													{company.description && (
														<div className="text-sm text-muted-foreground">
															{company.description
																.length > 50
																? `${company.description.substring(
																		0,
																		50
																  )}...`
																: company.description}
														</div>
													)}
												</div>
											</TableCell>
											{/* <TableCell>
                      <div className="space-y-1">
                        {company.email && (
                          <div className="text-sm">{company.email}</div>
                        )}
                        {company.phone && (
                          <div className="text-sm text-muted-foreground">
                            {company.phone}
                          </div>
                        )}
                      </div>
                    </TableCell> */}
											<TableCell>
												<Badge variant="secondary">
													{company.visitors || 0}
												</Badge>
											</TableCell>
											{/* <TableCell>
                        {company.createdAt
                          ? new Date(company.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell> */}
											<TableCell className="text-right">
												<div className="flex items-center justify-end space-x-2">
													<Link
														href={`/companies/${company._id}`}
													>
														<Button
															variant="ghost"
															size="sm"
														>
															<Eye className="w-4 h-4" />
														</Button>
													</Link>
													{/* <Link href={`/admin/companies/${company._id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </Link> */}
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															openEdit(company)
														}
													>
														<Edit2 className="w-4 h-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															handleDelete(
																company._id,
																company.name
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
					className="max-w-2xl"
					onPointerDownOutside={(e) => {
						if (saving) e.preventDefault(); // tránh đóng khi đang lưu
					}}
				>
					<DialogHeader>
						<DialogTitle>
							{editing ? "Edit Company" : "Add New Company"}
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="name">Company Name *</Label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required
								placeholder="Enter company name"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleSave();
									}
								}}
							/>
						</div>

						{/* <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the company"
              />
            </div> */}

						{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+84 (0)28 1234 5678"
                />
              </div>
            </div> */}

						{/* <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Company address"
              />
            </div> */}

						{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  name="logo"
                  type="url"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://company.com/logo.png"
                />
              </div>
            </div> */}

						{formData.logo && (
							<></>
							// <div className="space-y-2">
							//   <Label>Logo Preview</Label>
							//   <div className="w-32 h-32 border border-gray-200 rounded flex items-center justify-center bg-gray-50">
							//     {/* eslint-disable-next-line @next/next/no-img-element */}
							//     <img
							//       src={formData.logo}
							//       alt="Logo preview"
							//       className="max-w-full max-h-full object-contain"
							//       onError={(e) => {
							//         const target = e.target as HTMLImageElement;
							//         target.style.display = "none";
							//       }}
							//     />
							//   </div>
							// </div>
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
								: "Create Company"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
