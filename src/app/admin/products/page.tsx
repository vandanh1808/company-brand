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
	Upload,
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
import { uploadImage } from "@/lib/upload";
import { NumericFormat } from "react-number-format";

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
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [uploadingImages, setUploadingImages] = useState(false);
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
			setSelectedFiles([]);
			setLoading(false);
			setUploadingImages(false);
		}
	}, [open]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const newFiles = Array.from(files).filter((file) =>
			file.type.startsWith("image/")
		);

		if (newFiles.length === 0) {
			toast.error("Vui lòng chọn file ảnh hợp lệ");
			return;
		}

		setSelectedFiles((prev) => [...prev, ...newFiles]);

		// Upload images immediately
		setUploadingImages(true);
		try {
			const uploadPromises = newFiles.map((file) =>
				uploadImage(file, "products")
			);
			const uploadedUrls = await Promise.all(uploadPromises);

			setFormData((prev) => ({
				...prev,
				images: [...prev.images, ...uploadedUrls],
			}));

			toast.success(`Đã tải lên ${newFiles.length} ảnh thành công`);
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("Không thể tải lên hình ảnh");
			// Remove failed files from selectedFiles
			setSelectedFiles((prev) =>
				prev.filter((f) => !newFiles.includes(f))
			);
		} finally {
			setUploadingImages(false);
		}

		// Reset input
		e.target.value = "";
	};

	const handleRemoveImage = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.companyId) {
			toast.error("Vui lòng chọn công ty");
			return;
		}

		if (!formData.brandId) {
			toast.error("Vui lòng chọn thương hiệu");
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
				throw new Error(err?.error || "Không thể tạo sản phẩm");
			}
			const created = await res.json();
			// API của bạn trả { success, data } — lấy ra product vừa tạo
			const product: Product = created?.data || created;
			toast.success("Tạo sản phẩm thành công");
			onCreated(product);
			onOpenChange(false);
		} catch (err: any) {
			toast.error(err.message || "Lỗi khi tạo sản phẩm");
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
					<DialogTitle>Thêm Sản Phẩm Mới</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="name">Tên Sản Phẩm *</Label>
						<Input
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							placeholder="Nhập tên sản phẩm"
						/>
					</div>

					{/* Company -> Brand */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:[&>div]:min-w-0">
						<div className="space-y-2 min-w-0">
							<Label htmlFor="companyId">Công Ty *</Label>
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
									<SelectValue placeholder="Chọn công ty" />
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
							<Label htmlFor="brandId">Thương Hiệu *</Label>
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
												? "Chọn thương hiệu"
												: "Chọn công ty trước"
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
						<Label htmlFor="description">Mô Tả</Label>
						<Textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							placeholder="Mô tả ngắn gọn về sản phẩm"
							rows={4}
						/>
					</div>

					{/* Quantity & Price */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="quantity">Số Lượng</Label>
							<NumericFormat
								id="quantity"
								value={formData.quantity}
								allowNegative={false}
								thousandSeparator="."
								decimalSeparator=","
								customInput={Input}
								onValueChange={(values) => {
									setFormData((prev) => ({
										...prev,
										quantity: values.floatValue || 0, // số thực để lưu
									}));
								}}
								placeholder="0"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="price">Giá (VND)</Label>
							<NumericFormat
								value={formData.price}
								thousandSeparator="."
								decimalSeparator=","
								allowNegative={false}
								customInput={Input} // dùng style của shadcn
								onValueChange={(values) => {
									setFormData((prev) => ({
										...prev,
										price: values.floatValue || 0,
									}));
								}}
								placeholder="0"
							/>
						</div>
					</div>

					<div className="space-y-4">
						<Label>Hình Ảnh Sản Phẩm</Label>
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<Input
									type="file"
									multiple
									accept="image/*"
									onChange={handleFileSelect}
									disabled={uploadingImages}
									className="flex-1"
								/>
								{uploadingImages && (
									<div className="text-sm text-muted-foreground">
										Đang tải lên...
									</div>
								)}
							</div>
							<p className="text-xs text-muted-foreground">
								Chọn một hoặc nhiều file ảnh (PNG, JPG, v.v.)
							</p>
						</div>

						{formData.images.length > 0 && (
							<div className="space-y-2">
								<Label>
									Ảnh Đã Tải Lên ({formData.images.length})
								</Label>
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
													"/placeholder-image.svg";
											}}
										/>
										<div className="flex-1 text-sm text-muted-foreground truncate">
											{selectedFiles[index]?.name ||
												`Image ${index + 1}`}
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
								<Label>Xem Trước Hình Ảnh</Label>
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
							{loading ? "Đang tạo..." : "Tạo Sản Phẩm"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Hủy
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

/* ---------- UpdateProductDialog --------- */
function UpdateProductDialog({
	open,
	onOpenChange,
	product,
	brands,
	companies,
	onUpdated,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	product: Product | null;
	brands: Brand[];
	companies: Company[];
	onUpdated: (p: Product) => void;
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
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [uploadingImages, setUploadingImages] = useState(false);
	const [loading, setLoading] = useState(false);

	// Load product data when dialog opens
	useEffect(() => {
		if (open && product) {
			setFormData({
				name: product.name || "",
				description: product.description || "",
				images: product.images || [],
				brandId: product.brandId._id || "",
				companyId: product.brandId.companyId._id || "",
				quantity: product.quantity || 0,
				price: product.price || 0,
			});
			setSelectedFiles([]);
		}
	}, [open, product]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const newFiles = Array.from(files).filter((file) =>
			file.type.startsWith("image/")
		);

		if (newFiles.length === 0) {
			toast.error("Vui lòng chọn file ảnh hợp lệ");
			return;
		}

		setSelectedFiles((prev) => [...prev, ...newFiles]);

		// Upload images immediately
		setUploadingImages(true);
		try {
			const uploadPromises = newFiles.map((file) =>
				uploadImage(file, "products")
			);
			const uploadedUrls = await Promise.all(uploadPromises);

			setFormData((prev) => ({
				...prev,
				images: [...prev.images, ...uploadedUrls],
			}));

			toast.success(`Đã tải lên ${newFiles.length} ảnh thành công`);
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("Không thể tải lên hình ảnh");
		} finally {
			setUploadingImages(false);
		}

		// Reset input
		e.target.value = "";
	};

	const handleRemoveImage = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!product) return;

		if (!formData.companyId) {
			toast.error("Vui lòng chọn công ty");
			return;
		}

		if (!formData.brandId) {
			toast.error("Vui lòng chọn thương hiệu");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch(`/api/products/${product._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					price: Number(formData.price ?? 0),
					quantity: Number(formData.quantity ?? 0),
				}),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err?.error || "Không thể cập nhật sản phẩm");
			}
			const updated = await res.json();
			const updatedProduct: Product = updated?.data || updated;
			toast.success("Cập nhật sản phẩm thành công");
			onUpdated(updatedProduct);
			onOpenChange(false);
		} catch (err: any) {
			toast.error(err.message || "Lỗi khi cập nhật sản phẩm");
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

	if (!product) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Cập Nhật Sản Phẩm</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="name">Tên Sản Phẩm *</Label>
						<Input
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							placeholder="Nhập tên sản phẩm"
						/>
					</div>

					{/* Company -> Brand */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:[&>div]:min-w-0">
						<div className="space-y-2 min-w-0">
							<Label htmlFor="companyId">Công Ty *</Label>
							<Select
								value={formData.companyId}
								onValueChange={(value) =>
									setFormData((prev) => ({
										...prev,
										companyId: value,
										brandId: "",
									}))
								}
							>
								<SelectTrigger
									className="w-full min-w-0 truncate overflow-hidden whitespace-nowrap text-ellipsis pr-8"
									title={selectedCompanyName}
								>
									<SelectValue placeholder="Chọn công ty" />
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
							<Label htmlFor="brandId">Thương Hiệu *</Label>
							<Select
								value={formData.brandId}
								onValueChange={(value) =>
									setFormData((prev) => ({
										...prev,
										brandId: value,
									}))
								}
								disabled={!formData.companyId}
							>
								<SelectTrigger
									className="w-full min-w-0 truncate overflow-hidden whitespace-nowrap text-ellipsis pr-8"
									title={selectedBrandName}
								>
									<SelectValue
										placeholder={
											formData.companyId
												? "Chọn thương hiệu"
												: "Chọn công ty trước"
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
						<Label htmlFor="description">Mô Tả</Label>
						<Textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							placeholder="Mô tả ngắn gọn về sản phẩm"
							rows={4}
						/>
					</div>

					{/* Quantity & Price */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="quantity">Số Lượng</Label>
							<NumericFormat
								id="quantity"
								value={formData.quantity}
								allowNegative={false}
								thousandSeparator="."
								decimalSeparator=","
								customInput={Input}
								onValueChange={(values) => {
									setFormData((prev) => ({
										...prev,
										quantity: values.floatValue || 0,
									}));
								}}
								placeholder="0"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="price">Giá (VND)</Label>
							<NumericFormat
								value={formData.price}
								thousandSeparator="."
								decimalSeparator=","
								allowNegative={false}
								customInput={Input} // dùng style của shadcn
								onValueChange={(values) => {
									setFormData((prev) => ({
										...prev,
										price: values.floatValue || 0,
									}));
								}}
								placeholder="0"
							/>
						</div>
					</div>

					<div className="space-y-4">
						<Label>Hình Ảnh Sản Phẩm</Label>
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<Input
									type="file"
									multiple
									accept="image/*"
									onChange={handleFileSelect}
									disabled={uploadingImages}
									className="flex-1"
								/>
								{uploadingImages && (
									<div className="text-sm text-muted-foreground">
										Đang tải lên...
									</div>
								)}
							</div>
							<p className="text-xs text-muted-foreground">
								Thêm ảnh mới hoặc xóa ảnh hiện có
							</p>
						</div>

						{formData.images.length > 0 && (
							<div className="space-y-2">
								<Label>
									Ảnh Hiện Tại ({formData.images.length})
								</Label>
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
													"/placeholder-image.svg";
											}}
										/>
										<div className="flex-1 text-sm text-muted-foreground truncate">
											Image {index + 1}
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
								<Label>Xem Trước Hình Ảnh</Label>
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
							{loading ? "Đang cập nhật..." : "Cập Nhật Sản Phẩm"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Hủy
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
	const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [openCreate, setOpenCreate] = useState(false);
	const [openUpdate, setOpenUpdate] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(
		null
	);
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
		let filtered = products.filter(
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

		// Filter by company if selected
		if (selectedCompanyId) {
			filtered = filtered.filter(
				(p) => p.brandId.companyId._id === selectedCompanyId
			);
		}

		setFilteredProducts(filtered);
	}, [searchTerm, selectedCompanyId, products]);

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
			toast.error("Không thể tải dữ liệu");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string, name: string) => {
		if (!confirm(`Bạn có chắc chắn muốn xóa "${name}"?`)) return;
		try {
			const response = await fetch(`/api/products/${id}`, {
				method: "DELETE",
			});
			if (response.ok) {
				setProducts((prev) => prev.filter((p) => p._id !== id));
				toast.success("Xóa sản phẩm thành công");
			} else {
				toast.error("Không thể xóa sản phẩm");
			}
		} catch (error) {
			console.error("Error deleting product:", error);
			toast.error("Lỗi khi xóa sản phẩm");
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-xl">Đang tải sản phẩm...</div>
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
							Quay lại Bảng điều khiển
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold">Quản Lý Sản Phẩm</h1>
						<p className="text-muted-foreground">
							Thêm, sửa hoặc xóa sản phẩm trong hệ thống
						</p>
					</div>
				</div>

				{/* NÚT MỞ DIALOG THAY VÌ NAVIGATE */}
				<Button onClick={() => setOpenCreate(true)}>
					<Plus className="w-4 h-4 mr-2" />
					Thêm Sản Phẩm
				</Button>
			</div>

			{/* Search and Filters */}
			<div className="mb-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					{/* Search Input */}
					<div className="relative md:col-span-2 min-w-0">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Tìm kiếm sản phẩm..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>

					{/* Company Filter */}
					<div className="relative min-w-0">
						<Select
							value={selectedCompanyId}
							onValueChange={setSelectedCompanyId}
						>
							<SelectTrigger
								className="w-full min-w-0 max-w-full pr-8"
								title={
									companies?.find(
										(c) => c._id === selectedCompanyId
									)?.name || undefined
								}
							>
								{/* Bọc để truncate */}
								<span className="block truncate overflow-hidden whitespace-nowrap text-ellipsis">
									<SelectValue placeholder="Lọc theo công ty" />
								</span>
							</SelectTrigger>
							<SelectContent>
								{companies?.map((company) => (
									<SelectItem
										key={company._id}
										value={company._id}
										className="truncate"
									>
										{company.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Clear Filters Button (giữ chỗ, ẩn khi không có filter) */}
					<div className="flex items-center">
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setSearchTerm("");
								setSelectedCompanyId("");
							}}
							className={`text-xs ${
								!(searchTerm || selectedCompanyId)
									? "invisible"
									: ""
							}`}
						>
							<X className="w-3 h-3 mr-2" />
							Xóa bộ lọc
						</Button>
					</div>
				</div>

				{/* Active Filters Display */}
				{(searchTerm || selectedCompanyId) && (
					<div className="flex flex-wrap gap-2 mt-3">
						{searchTerm && (
							<Badge variant="secondary" className="text-xs">
								Tìm kiếm: &quot;{searchTerm}&quot;
								<button
									onClick={() => setSearchTerm("")}
									className="ml-1 hover:text-red-600"
								>
									<X className="w-3 h-3" />
								</button>
							</Badge>
						)}
						{selectedCompanyId && (
							<Badge variant="secondary" className="text-xs">
								Công ty:{" "}
								{
									companies.find(
										(c) => c._id === selectedCompanyId
									)?.name
								}
								<button
									onClick={() => setSelectedCompanyId("")}
									className="ml-1 hover:text-red-600"
								>
									<X className="w-3 h-3" />
								</button>
							</Badge>
						)}
					</div>
				)}
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tổng Sản Phẩm
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
							Tổng Thương Hiệu
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
							{searchTerm || selectedCompanyId
								? "Kết Quả Lọc"
								: "Hiển Thị"}
						</CardTitle>
						{(searchTerm || selectedCompanyId) && (
							<Badge variant="outline" className="text-xs">
								Đã lọc
							</Badge>
						)}
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{filteredProducts.length}
						</div>
						{(searchTerm || selectedCompanyId) && (
							<p className="text-xs text-muted-foreground">
								trong tổng số {products.length}
							</p>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Products Table */}
			<Card>
				<CardHeader>
					<CardTitle>Danh Sách Sản Phẩm</CardTitle>
				</CardHeader>
				<CardContent>
					{filteredProducts.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground">
								{searchTerm || selectedCompanyId
									? "Không có sản phẩm nào phù hợp với bộ lọc hiện tại."
									: "Không tìm thấy sản phẩm nào."}
							</p>
							{(searchTerm || selectedCompanyId) && (
								<Button
									variant="outline"
									size="sm"
									className="mt-4"
									onClick={() => {
										setSearchTerm("");
										setSelectedCompanyId("");
									}}
								>
									<X className="w-3 h-3 mr-2" />
									Xóa bộ lọc
								</Button>
							)}
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Sản Phẩm</TableHead>
									<TableHead>Thương Hiệu</TableHead>
									<TableHead>Công Ty</TableHead>
									<TableHead>Giá</TableHead>
									<TableHead>Số Lượng</TableHead>
									<TableHead>Mô Tả</TableHead>
									<TableHead>Ngày Tạo</TableHead>
									<TableHead className="text-right">
										Thao Tác
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
											{product.price &&
											product.price > 0 ? (
												<span className="font-semibold text-green-600">
													{new Intl.NumberFormat(
														"vi-VN",
														{
															style: "currency",
															currency: "VND",
														}
													).format(product.price)}
												</span>
											) : (
												<Badge
													variant="outline"
													className="text-xs"
												>
													Giá thỏa thuận
												</Badge>
											)}
										</TableCell>
										<TableCell>
											<span
												className={`font-semibold ${
													product?.quantity > 20
														? "text-green-600"
														: product?.quantity > 0
														? "text-orange-600"
														: "text-red-600"
												}`}
											>
												{product.quantity || 0}
											</span>
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
												<Button
													variant="ghost"
													size="sm"
													onClick={() => {
														setSelectedProduct(
															product
														);
														setOpenUpdate(true);
													}}
												>
													<Edit2 className="w-4 h-4" />
												</Button>
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

			{/* Dialog cập nhật sản phẩm */}
			<UpdateProductDialog
				open={openUpdate}
				onOpenChange={setOpenUpdate}
				product={selectedProduct}
				brands={brands}
				companies={companies}
				onUpdated={(updatedProduct) => {
					// Cập nhật sản phẩm trong danh sách
					setProducts((prev) =>
						prev.map((p) =>
							p._id === updatedProduct._id ? updatedProduct : p
						)
					);
					// Đồng bộ với filtered list
					setFilteredProducts((prev) =>
						prev.map((p) =>
							p._id === updatedProduct._id ? updatedProduct : p
						)
					);
					setSelectedProduct(null);
				}}
			/>
		</div>
	);
}
