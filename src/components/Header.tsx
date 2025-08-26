"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import {
	ChevronDown,
	Menu,
	X,
	ChevronRight,
	Settings,
	LogOut,
	Package,
	Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
import { usePathname, useRouter } from "next/navigation";

interface Company {
	_id: string;
	name: string;
	description?: string;
	brands?: Brand[];
}

interface Brand {
	_id: string;
	name: string;
	description?: string;
	companyId: {
		_id: string;
	};
}

export default function Header() {
	const router = useRouter();
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
	const [activeCompany, setActiveCompany] = useState<string | null>(null);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [brands, setBrands] = useState<Brand[]>([]);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const companyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const { isLoggedIn, user, logout } = useAdmin();
	console.log("activeDropdown:", activeDropdown);

	// Load companies and brands
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [companiesRes, brandsRes] = await Promise.all([
					fetch("/api/companies"),
					fetch("/api/brands"),
				]);

				const companiesData = await companiesRes.json();
				const brandsData = await brandsRes.json();

				if (companiesData.success) {
					setCompanies(companiesData.data);
				}
				if (brandsData.success) {
					setBrands(brandsData.data);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (!window.matchMedia("(min-width: 1024px)").matches) return;

			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setActiveDropdown(null);
				setActiveCompany(null);
			}
		}
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	const handleCompanyHover = (companyId: string) => {
		if (companyTimeoutRef.current) {
			clearTimeout(companyTimeoutRef.current);
		}
		setActiveCompany(companyId);
	};

	const handleCompanyLeave = () => {
		companyTimeoutRef.current = setTimeout(() => {
			setActiveCompany(null);
		}, 200);
	};

	const handleMouseEnter = (dropdown: string) => {
		if (companyTimeoutRef.current) {
			clearTimeout(companyTimeoutRef.current);
		}
		setActiveDropdown(dropdown);
	};

	const handleMouseLeave = () => {
		companyTimeoutRef.current = setTimeout(() => {
			setActiveDropdown(null);
			setActiveCompany(null);
		}, 200);
	};

	const getCompanyBrands = (companyId: string) => {
		return brands.filter((brand) => brand.companyId?.["_id"] === companyId);
	};

	// companyId của brand đang xem (nếu URL là /brands/:id)
	const currentBrandCompanyId = useMemo(() => {
		if (!pathname?.startsWith("/brands/")) return null;
		const brandIdInPath = pathname.split("/")[2];
		const b = brands.find((b) => b._id === brandIdInPath);
		return b?.companyId?._id ?? null;
	}, [pathname, brands]);

	const isBrandsArea = pathname?.startsWith("/brands");
	const isCompaniesArea = pathname?.startsWith("/companies");

	const isActivePath = (href: string) => {
		// bỏ qua "#" và xử lý cả trang con
		if (!href || href === "#") return false;
		return pathname === href || pathname?.startsWith(href + "/");
	};

	// class underline effect
	const navLinkClass = (href: string) => {
		const isActive = isActivePath(href);
		return `relative whitespace-nowrap text-gray-700 hover:text-gray-900 transition-colors py-2 font-normal text-sm
    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]
    after:bg-green-700 after:transition-all after:duration-300
    ${
		isActive
			? "after:w-full text-green-700"
			: "after:w-0 hover:after:w-full"
	}`;
	};

	return (
		<header
			className="bg-white shadow-sm sticky top-0 z-50"
			style={{
				fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
			}}
		>
			{/* Main Navigation */}
			<div className="container mx-auto px-6">
				<div className="flex justify-between items-center py-4">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-3">
						<div className="w-10 h-10 bg-gradient-to-br from-green-700 to-green-900 rounded flex items-center justify-center">
							<span className="text-white font-bold text-base">
								EP
							</span>
						</div>
						<div>
							<div className="text-xl font-bold text-gray-900">
								Enterprise
							</div>
							<div className="text-xs text-gray-600 font-normal -mt-0.5">
								PLATFORM
							</div>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<nav
						className="hidden lg:flex items-center space-x-10"
						ref={dropdownRef}
					>
						{/* Thông tin công ty */}
						<Link href="/" className={navLinkClass("/")}>
							Thông tin công ty
						</Link>

						{/* Công ty phân phối */}
						<div
							className="relative"
							onMouseEnter={() => handleMouseEnter("companies")}
							onMouseLeave={handleMouseLeave}
						>
							<button
								className={`${navLinkClass(
									"/brands"
								)} inline-flex items-center gap-1 flex-nowrap whitespace-nowrap
                ${
					activeDropdown === "companies"
						? "after:w-full text-green-700"
						: ""
				}
                `}
							>
								<span>Công ty phân phối</span>
								<ChevronDown className="w-3 h-3" />
							</button>

							{/* Companies Dropdown */}
							{activeDropdown === "companies" && (
								<div
									className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg py-4 z-50"
									style={{
										fontFamily:
											'Arial, "Helvetica Neue", Helvetica, sans-serif',
									}}
								>
									{companies.map((company) => {
										const isCompanyActive =
											pathname?.startsWith(
												`/companies/${company._id}`
											) ||
											company._id ===
												currentBrandCompanyId;

										return (
											<div
												key={company._id}
												className="relative"
												onMouseEnter={() =>
													handleCompanyHover(
														company._id
													)
												}
												onMouseLeave={
													handleCompanyLeave
												}
											>
												<div
													className={`px-6 py-3 transition-colors cursor-pointer flex items-center justify-between min-w-0
                    ${isCompanyActive ? "bg-green-50" : "hover:bg-gray-50"}`}
												>
													<div className="min-w-0">
														<Link
															href={`/companies/${company._id}`}
															className="font-normal text-gray-800 hover:text-gray-900 text-sm"
														>
															{company.name}
														</Link>
													</div>
													<ChevronRight className="w-3 h-3 text-gray-400" />
												</div>

												{/* Company Brands Submenu */}
												{activeCompany ===
													company._id && (
													<div
														className="absolute left-full top-0 -ml-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-[60]"
														onMouseEnter={() => {
															if (
																companyTimeoutRef.current
															)
																clearTimeout(
																	companyTimeoutRef.current
																);
														}}
														onMouseLeave={
															handleCompanyLeave
														}
														onMouseDown={(e) =>
															e.stopPropagation()
														}
													>
														{/* cầu nối */}
														<div className="absolute -left-2 top-0 h-full w-2 bg-transparent pointer-events-auto" />
														{getCompanyBrands(
															company._id
														).length > 0 ? (
															<div className="grid grid-cols-1 gap-2 px-2 items-stretch">
																{getCompanyBrands(
																	company._id
																).map(
																	(brand) => {
																		const isBrandActive =
																			pathname ===
																			`/brands/${brand._id}`;

																		return (
																			<Link
																				key={
																					brand._id
																				}
																				href={`/brands/${brand._id}`}
																				className={`block w-full h-full min-w-0 rounded px-3 py-2 text-sm font-normal whitespace-nowrap
        ${
			isBrandActive
				? "bg-green-50 text-green-700"
				: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
		}`}
																			>
																				{
																					brand.name
																				}
																			</Link>
																		);
																	}
																)}
															</div>
														) : (
															<div className="px-4 py-3 text-gray-500 text-center text-sm font-normal">
																Không có dữ liệu
															</div>
														)}
													</div>
												)}
											</div>
										);
									})}

									{companies.length === 0 && (
										<div className="px-6 py-3 text-gray-500 text-center text-sm font-normal">
											Chưa có công ty nào
										</div>
									)}
								</div>
							)}
						</div>

						{/* Tuyển dụng */}
						<Link
							href="/recruitment"
							className={navLinkClass("/recruitment")}
						>
							Tuyển dụng
						</Link>
					</nav>

					{/* Desktop Action Buttons */}
					<div className="hidden lg:flex items-center space-x-3">
						{isLoggedIn ? (
							<>
								{/* Admin Menu Dropdown */}
								<div
									className="relative"
									onMouseEnter={() =>
										handleMouseEnter("admin")
									}
									onMouseLeave={handleMouseLeave}
								>
									<button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors py-2 px-3 rounded-lg border border-gray-300 hover:bg-gray-50 font-normal text-sm">
										<Settings className="w-4 h-4" />
										<span>Admin</span>
										<ChevronDown className="w-3 h-3" />
									</button>

									{/* Admin Dropdown */}
									{activeDropdown === "admin" && (
										<div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
											{/* User Info */}
											<div className="px-4 py-3 border-b border-gray-100">
												<div className="text-sm font-medium text-gray-900">
													{user?.name || user?.email}
												</div>
												<div className="text-xs text-gray-600">
													Administrator
												</div>
											</div>

											{/* Admin Links */}
											<div className="py-1">
												<Link
													href="/admin"
													className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
												>
													<Settings className="w-4 h-4 mr-3" />
													Dashboard
												</Link>
												<Link
													href="/admin/companies"
													className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
												>
													<Building className="w-4 h-4 mr-3" />
													Quản lý công ty
												</Link>
												<Link
													href="/admin/brands"
													className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
												>
													<Package className="w-4 h-4 mr-3" />
													Quản lý thương hiệu
												</Link>
												<Link
													href="/admin/products"
													className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
												>
													<Package className="w-4 h-4 mr-3" />
													Quản lý sản phẩm
												</Link>
											</div>

											{/* Logout */}
											<div className="border-t border-gray-100">
												<button
													onClick={() => {
														logout();
														router.push(
															"/admin/login"
														);
													}}
													className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-sm"
												>
													<LogOut className="w-4 h-4 mr-3" />
													Đăng xuất
												</button>
											</div>
										</div>
									)}
								</div>
							</>
						) : (
							<Link href="/admin/login">
								<Button
									variant="outline"
									size="sm"
									className="border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-normal px-4 py-2 text-sm transition-colors"
								>
									Login
								</Button>
							</Link>
						)}
						<Link href="/recruitment">
							<Button
								size="sm"
								className="bg-green-700 hover:bg-green-800 text-white font-normal px-4 py-2 text-sm transition-colors"
							>
								Tuyển dụng
							</Button>
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="lg:hidden p-2 rounded hover:bg-gray-50 transition-colors"
					>
						{isMenuOpen ? (
							<X className="w-5 h-5 text-gray-700" />
						) : (
							<Menu className="w-5 h-5 text-gray-700" />
						)}
					</button>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isMenuOpen && (
				<div className="lg:hidden bg-white border-t border-gray-200 shadow-sm">
					<div className="container mx-auto px-6 py-4">
						<nav className="space-y-4">
							{/* Thông tin công ty */}
							<Link
								href="/"
								onClick={() => setIsMenuOpen(false)}
								className={navLinkClass("/")}
							>
								Thông tin công ty
							</Link>

							{/* Công ty phân phối */}
							<div>
								<button
									onClick={(e) => {
										e.stopPropagation();
										setActiveDropdown(
											activeDropdown === "companies"
												? null
												: "companies"
										);
									}}
									className={`
      inline-flex items-center justify-between gap-2 w-full text-left
      text-gray-700 hover:text-gray-900 transition-colors py-2 font-normal text-sm
      whitespace-nowrap
      relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]
      after:bg-green-700 after:transition-all after:duration-300
      ${
			isBrandsArea || isCompaniesArea
				? "after:w-full text-green-700"
				: "after:w-0 hover:after:w-full"
		}
    `}
								>
									<span>Công ty phân phối</span>
									<ChevronDown className="w-4 h-4 shrink-0" />
								</button>
								{(activeDropdown === "companies" ||
									isBrandsArea ||
									isCompaniesArea) && (
									<div className="pl-4 space-y-2 mt-2 bg-gray-50 rounded p-3">
										{companies.map((company) => {
											const isCompanyActive =
												(isCompaniesArea &&
													pathname?.startsWith(
														`/companies/${company._id}`
													)) ||
												currentBrandCompanyId ===
													company._id;

											return (
												<div key={company._id}>
													<button
														onClick={() =>
															setActiveCompany(
																activeCompany ===
																	company._id
																	? null
																	: company._id
															)
														}
														className={`
              flex items-center justify-between w-full transition-colors py-1 font-normal text-sm
              ${
					isCompanyActive
						? "text-green-700"
						: "text-gray-700 hover:text-gray-900"
				}
            `}
													>
														<span className="truncate">
															{company.name}
														</span>
														<ChevronRight
															className={`w-3 h-3 ${
																isCompanyActive
																	? "text-green-600"
																	: ""
															}`}
														/>
													</button>

													{(activeCompany ===
														company._id ||
														isCompanyActive) && (
														<div className="pl-3 space-y-1 mt-1">
															<Link
																href={`/companies/${company._id}`}
																onClick={() =>
																	setIsMenuOpen(
																		false
																	)
																}
																className={`
                  block text-xs transition-colors py-1 font-normal truncate
                  ${
						isCompanyActive
							? "text-green-700"
							: "text-gray-600 hover:text-gray-800"
					}
                `}
															>
																Thông tin công
																ty
															</Link>

															<Link
																href="/recruitment"
																onClick={() =>
																	setIsMenuOpen(
																		false
																	)
																}
																className="block text-xs text-gray-600 hover:text-gray-800 transition-colors py-1 font-normal"
															>
																Tuyển dụng
															</Link>

															{getCompanyBrands(
																company._id
															).map((brand) => {
																const isBrandActive =
																	pathname ===
																	`/brands/${brand._id}`;
																return (
																	<Link
																		key={
																			brand._id
																		}
																		href={`/brands/${brand._id}`}
																		onClick={() =>
																			setIsMenuOpen(
																				false
																			)
																		}
																		className={`
                      block text-xs transition-colors py-1 font-normal truncate
                      ${
							isBrandActive
								? "text-green-700"
								: "text-gray-600 hover:text-gray-800"
						}
                    `}
																		title={
																			brand.name
																		}
																	>
																		•{" "}
																		{
																			brand.name
																		}
																	</Link>
																);
															})}
														</div>
													)}
												</div>
											);
										})}
									</div>
								)}
							</div>

							{/* Tuyển dụng */}
							<Link
								href="/recruitment"
								onClick={() => setIsMenuOpen(false)}
								className={navLinkClass("/recruitment")}
							>
								Tuyển dụng
							</Link>

							{/* Mobile Action Buttons */}
							<div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
								{isLoggedIn ? (
									<>
										{/* Admin User Info */}
										<div className="px-2 py-2 bg-gray-50 rounded">
											<div className="text-sm font-medium text-gray-900">
												{user?.name || user?.email}
											</div>
											<div className="text-xs text-gray-600">
												Administrator
											</div>
										</div>

										{/* Admin Links */}
										<Link
											href="/admin"
											onClick={() => setIsMenuOpen(false)}
										>
											<Button
												variant="ghost"
												size="sm"
												className="w-full justify-start font-normal text-sm"
											>
												<Settings className="w-4 h-4 mr-2" />
												Dashboard
											</Button>
										</Link>
										<Link
											href="/admin/companies"
											onClick={() => setIsMenuOpen(false)}
										>
											<Button
												variant="ghost"
												size="sm"
												className="w-full justify-start font-normal text-sm"
											>
												<Building className="w-4 h-4 mr-2" />
												Quản lý công ty
											</Button>
										</Link>
										<Link
											href="/admin/brands"
											onClick={() => setIsMenuOpen(false)}
										>
											<Button
												variant="ghost"
												size="sm"
												className="w-full justify-start font-normal text-sm"
											>
												<Package className="w-4 h-4 mr-2" />
												Quản lý thương hiệu
											</Button>
										</Link>
										<Link
											href="/admin/products"
											onClick={() => setIsMenuOpen(false)}
										>
											<Button
												variant="ghost"
												size="sm"
												className="w-full justify-start font-normal text-sm"
											>
												<Package className="w-4 h-4 mr-2" />
												Quản lý sản phẩm
											</Button>
										</Link>

										{/* Logout Button */}
										<Button
											onClick={() => {
												logout();
												setIsMenuOpen(false);
											}}
											variant="ghost"
											size="sm"
											className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 font-normal text-sm"
										>
											<LogOut className="w-4 h-4 mr-2" />
											Đăng xuất
										</Button>
									</>
								) : (
									<Link
										href="/admin/login"
										onClick={() => setIsMenuOpen(false)}
									>
										<Button
											variant="outline"
											size="sm"
											className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-normal text-sm"
										>
											Admin
										</Button>
									</Link>
								)}
							</div>
						</nav>
					</div>
				</div>
			)}
		</header>
	);
}
