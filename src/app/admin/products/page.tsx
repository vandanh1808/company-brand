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
import {
	Plus,
	Edit2,
	Trash2,
	Eye,
	Search,
	ArrowLeft,
	Save,
	X,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";

interface Product {
	_id: string;
	name: string;
	description?: string;
	images?: string[];
	brandId: {
		_id: string;
		name: string;
		companyId: {
			_id: string;
			name: string;
		};
	};
	createdAt?: string;
	quantity?: number;
	price?: number;
}

interface Company {
	_id: string;
	name: string;
}

interface Brand {
	_id: string;
	name: string;
	companyId: Company;
}

/* ---------- CreateProductDialog (tái dùng logic từ trang NewProductPage) --------- */
function CreateProductDialog({
	open,
	onOpenChange,
	brands,
	companies,
	onCreated,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	brands: Brand[];
	companies: Company[];
	onCreated: (p: Product) => void;
}) {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		images: [] as string[],
		brandId: "",
		companyId: "",
		quantity: 0,
		price: 0,
	});
	const [newImageUrl, setNewImageUrl] = useState("");
	const [loading, setLoading] = useState(false);

	// reset form mỗi lần mở
	useEffect(() => {
		if (open) {
			setFormData({
				name: "",
				description: "",
				images: [],
				brandId: "",
				companyId: "",
				quantity: 0,
				price: 0,
			});
			setNewImageUrl("");
			setLoading(false);
		}
	}, [open]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleAddImage = () => {
		if (!newImageUrl) return;
		setFormData((prev) => ({
			...prev,
			images: [...prev.images, newImageUrl],
		}));
		setNewImageUrl("");
	};

	const handleRemoveImage = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.companyId) {
			toast.error("Please select a company");
			return;
		}

		if (!formData.brandId) {
			toast.error("Please select a brand");
			return;
		}
		setLoading(true);
		try {
			const res = await fetch("/api/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					price: Number(formData.price ?? 0),
					quantity: Number(formData.quantity ?? 0),
				}),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err?.error || "Failed to create product");
			}
			const created = await res.json();
			// API của bạn trả { success, data } — lấy ra product vừa tạo
			const product: Product = created?.data || created;
			toast.success("Product created successfully");
			onCreated(product);
			onOpenChange(false);
		} catch (err: any) {
			toast.error(err.message || "Error creating product");
		} finally {
			setLoading(false);
		}
	};

	const filteredBrands = formData.companyId
		? brands.filter((b) => b.companyId._id === formData.companyId)
		: [];

	const selectedCompanyName =
		companies.find((c) => c._id === formData.companyId)?.name || "";

	const selectedBrandName =
		filteredBrands.find((b) => b._id === formData.brandId)?.name || "";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Add New Product</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="name">Product Name *</Label>
						<Input
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							placeholder="Enter product name"
						/>
					</div>

					{/* Company -> Brand */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:[&>div]:min-w-0">
						<div className="space-y-2 min-w-0">
							<Label htmlFor="companyId">Company *</Label>
							<Select
								value={formData.companyId}
								onValueChange={
									(value) =>
										setFormData((prev) => ({
											...prev,
											companyId: value,
											brandId: "",
										})) // reset brand khi đổi company
								}
							>
								<SelectTrigger
									className="w-full min-w-0 truncate overflow-hidden whitespace-nowrap text-ellipsis pr-8"
									title={selectedCompanyName}
								>
									<SelectValue placeholder="Select a company" />
								</SelectTrigger>
								<SelectContent>
									{companies.map((c) => (
										<SelectItem key={c._id} value={c._id}>
											{c.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2 min-w-0">
							<Label htmlFor="brandId">Brand *</Label>
							<Select
								value={formData.brandId}
								onValueChange={(value) =>
									setFormData((prev) => ({
										...prev,
										brandId: value,
									}))
								}
								disabled={!formData.companyId} // ✅ disable khi chưa chọn công ty
							>
								<SelectTrigger
									className="w-full min-w-0 truncate overflow-hidden whitespace-nowrap text-ellipsis pr-8"
									title={selectedBrandName}
								>
									<SelectValue
										placeholder={
											formData.companyId
												? "Select a brand"
												: "Select company first"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{filteredBrands.map((b) => (
										<SelectItem key={b._id} value={b._id}>
											{b.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							placeholder="Brief description of the product"
							rows={4}
						/>
					</div>

					{/* Quantity & Price */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="quantity">Quantity</Label>
							<Input
								id="quantity"
								type="number"
								min={0}
								value={formData.quantity}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										quantity: Number(e.target.value),
									}))
								}
								placeholder="0"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="price">Price (VND)</Label>
							<Input
								id="price"
								type="number"
								min={0}
								step="1000"
								value={formData.price}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										price: Number(e.target.value),
									}))
								}
								placeholder="0"
							/>
						</div>
					</div>

					<div className="space-y-4">
						<Label>Product Images</Label>
						<div className="flex space-x-2">
							<Input
								type="url"
								placeholder="https://example.com/image.jpg"
								value={newImageUrl}
								onChange={(e) => setNewImageUrl(e.target.value)}
							/>
							<Button type="button" onClick={handleAddImage}>
								<Plus className="w-4 h-4" />
							</Button>
						</div>

						{formData.images.length > 0 && (
							<div className="space-y-2">
								{formData.images.map((imageUrl, index) => (
									<div
										key={index}
										className="flex items-center space-x-2 p-2 border rounded"
									>
										<img
											src={imageUrl}
											alt={`Product image ${index + 1}`}
											className="w-12 h-12 object-cover rounded"
											onError={(e) => {
												const target =
													e.target as HTMLImageElement;
												target.src =
													"/placeholder-image.jpg";
											}}
										/>
										<div className="flex-1 text-sm text-muted-foreground truncate">
											{imageUrl}
										</div>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() =>
												handleRemoveImage(index)
											}
											className="text-red-600 hover:text-red-700"
										>
											<X className="w-4 h-4" />
										</Button>
									</div>
								))}
							</div>
						)}

						{formData.images.length > 0 && (
							<div className="space-y-2">
								<Label>Images Preview</Label>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									{formData.images.map((imageUrl, i) => (
										<div
											key={i}
											className="aspect-square border border-gray-200 rounded flex items-center justify-center bg-gray-50 overflow-hidden"
										>
											<img
												src={imageUrl}
												alt={`Preview ${i + 1}`}
												className="max-w-full max-h-full object-contain"
												onError={(e) => {
													const target =
														e.target as HTMLImageElement;
													target.style.display =
														"none";
												}}
											/>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					<DialogFooter className="gap-2">
						<Button type="submit" disabled={loading}>
							<Save className="w-4 h-4 mr-2" />
							{loading ? "Creating..." : "Create Product"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

/* --------------------------------- Page --------------------------------- */
export default function AdminProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [brands, setBrands] = useState<Brand[]>([]);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [openCreate, setOpenCreate] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("adminToken");
		if (!token) {
			router.push("/admin/login");
			return;
		}
		fetchData();
	}, [router]);

	useEffect(() => {
		const filtered = products.filter(
			(p) =>
				p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(p.description &&
					p.description
						.toLowerCase()
						.includes(searchTerm.toLowerCase())) ||
				p.brandId.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				p.brandId.companyId.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
		);
		setFilteredProducts(filtered);
	}, [searchTerm, products]);

	const fetchData = async () => {
		try {
			const [productsResponse, brandsResponse, companiesResponse] =
				await Promise.all([
					fetch("/api/products"),
					fetch("/api/brands"),
					fetch("/api/companies"),
				]);
			const [productsData, brandsData, companiesData] = await Promise.all(
				[
					productsResponse.json(),
					brandsResponse.json(),
					companiesResponse.json(),
				]
			);
			if (productsData.success) setProducts(productsData.data);
			if (brandsData.success) setBrands(brandsData.data);
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
		if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
		try {
			const response = await fetch(`/api/products/${id}`, {
				method: "DELETE",
			});
			if (response.ok) {
				setProducts((prev) => prev.filter((p) => p._id !== id));
				toast.success("Product deleted successfully");
			} else {
				toast.error("Failed to delete product");
			}
		} catch (error) {
			console.error("Error deleting product:", error);
			toast.error("Error deleting product");
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-xl">Loading products...</div>
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
						<h1 className="text-3xl font-bold">Manage Products</h1>
						<p className="text-muted-foreground">
							Add, edit, or delete products in the system
						</p>
					</div>
				</div>

				{/* NÚT MỞ DIALOG THAY VÌ NAVIGATE */}
				<Button onClick={() => setOpenCreate(true)}>
					<Plus className="w-4 h-4 mr-2" />
					Add Product
				</Button>
			</div>

			{/* Search */}
			<div className="mb-6">
				<div className="relative">
					<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search products..."
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
							Total Products
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{products.length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Brands
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{brands.length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Filtered Results
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{filteredProducts.length}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Products Table */}
			<Card>
				<CardHeader>
					<CardTitle>Products List</CardTitle>
				</CardHeader>
				<CardContent>
					{filteredProducts.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground">
								{searchTerm
									? "No products match your search."
									: "No products found."}
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Product</TableHead>
									<TableHead>Brand</TableHead>
									<TableHead>Company</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Created</TableHead>
									<TableHead className="text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredProducts.map((product) => (
									<TableRow key={product._id}>
										<TableCell>
											<div className="flex items-center space-x-3">
												{product.images &&
													product.images.length >
														0 && (
														<div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
															<img
																src={
																	product
																		.images[0]
																}
																alt={
																	product.name
																}
																className="max-w-full max-h-full object-contain"
															/>
														</div>
													)}
												<div className="font-medium">
													{product.name}
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="outline">
												{product.brandId.name}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge variant="secondary">
												{product.brandId.companyId.name}
											</Badge>
										</TableCell>
										<TableCell>
											{product.description ? (
												<div className="text-sm text-muted-foreground">
													{product.description
														.length > 50
														? `${product.description.substring(
																0,
																50
														  )}...`
														: product.description}
												</div>
											) : (
												<span className="text-muted-foreground">
													—
												</span>
											)}
										</TableCell>
										<TableCell>
											{product.createdAt
												? new Date(
														product.createdAt
												  ).toLocaleDateString()
												: "N/A"}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end space-x-2">
												<Link
													href={`/products/${product._id}`}
												>
													<Button
														variant="ghost"
														size="sm"
													>
														<Eye className="w-4 h-4" />
													</Button>
												</Link>
												<Link
													href={`/admin/products/${product._id}/edit`}
												>
													<Button
														variant="ghost"
														size="sm"
													>
														<Edit2 className="w-4 h-4" />
													</Button>
												</Link>
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														handleDelete(
															product._id,
															product.name
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

			{/* Dialog tạo sản phẩm */}
			<CreateProductDialog
				open={openCreate}
				onOpenChange={setOpenCreate}
				brands={brands}
				companies={companies}
				onCreated={(p) => {
					// cập nhật list ngay lập tức
					setProducts((prev) => [p, ...prev]);
					// đồng bộ filter
					setFilteredProducts((prev) => [p, ...prev]);
				}}
			/>
		</div>
	);
}
