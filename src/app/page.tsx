import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Building2,
	Users,
	Globe,
	Award,
	Target,
	Heart,
	Lightbulb,
	Shield,
} from "lucide-react";

export default function Page() {
	const companyStats = [
		{ icon: Building2, label: "Công ty đối tác", value: "50+" },
		{ icon: Users, label: "Nhân viên", value: "1000+" },
		{ icon: Globe, label: "Thị trường", value: "10+" },
		{ icon: Award, label: "Giải thưởng", value: "25+" },
	];

	const coreValues = [
		{
			icon: Target,
			title: "Tầm nhìn",
			description:
				"Trở thành nền tảng doanh nghiệp hàng đầu khu vực, kết nối các công ty và thúc đẩy sự phát triển bền vững.",
		},
		{
			icon: Heart,
			title: "Sứ mệnh",
			description:
				"Tạo ra một hệ sinh thái doanh nghiệp toàn diện, hỗ trợ các công ty phát triển và mang lại giá trị cho khách hàng.",
		},
		{
			icon: Lightbulb,
			title: "Đổi mới",
			description:
				"Luôn đi đầu trong việc áp dụng công nghệ mới và phương pháp kinh doanh hiện đại để tối ưu hiệu quả.",
		},
		{
			icon: Shield,
			title: "Uy tín",
			description:
				"Xây dựng niềm tin thông qua chất lượng dịch vụ vượt trội và cam kết tuân thủ các tiêu chuẩn cao nhất.",
		},
	];

	const milestones = [
		{
			year: "2020",
			title: "Thành lập",
			description:
				"Khởi đầu với tầm nhìn xây dựng nền tảng doanh nghiệp toàn diện",
		},
		{
			year: "2021",
			title: "Mở rộng",
			description:
				"Phát triển mạng lưới đối tác và ra mắt các dịch vụ cốt lõi",
		},
		{
			year: "2022",
			title: "Công nghệ",
			description: "Đầu tư mạnh vào công nghệ và chuyển đổi số",
		},
		{
			year: "2023",
			title: "Quốc tế hóa",
			description: "Mở rộng ra các thị trường khu vực",
		},
		{
			year: "2024",
			title: "Phát triển bền vững",
			description:
				"Tập trung vào các giải pháp xanh và phát triển bền vững",
		},
	];

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Hero Section */}
			<div className="text-center mb-16">
				<h1 className="text-5xl font-bold mb-4">
					Về Enterprise Platform
				</h1>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
					Chúng tôi là nền tảng doanh nghiệp hàng đầu, kết nối các
					công ty, thương hiệu và sản phẩm trong một hệ sinh thái toàn
					diện, tạo ra giá trị bền vững cho mọi đối tác.
				</p>
			</div>

			{/* Company Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
				{companyStats.map((stat, index) => (
					<Card key={index} className="text-center">
						<CardContent className="pt-6">
							<stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
							<div className="text-3xl font-bold text-primary mb-2">
								{stat.value}
							</div>
							<div className="text-sm text-muted-foreground">
								{stat.label}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Core Values */}
			<section className="mb-16">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">Giá trị cốt lõi</h2>
					<p className="text-lg text-muted-foreground">
						Những nguyên tắc định hướng mọi hoạt động của chúng tôi
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{coreValues.map((value, index) => (
						<Card key={index} className="h-full">
							<CardHeader>
								<CardTitle className="flex items-center">
									<value.icon className="w-6 h-6 text-primary mr-3" />
									{value.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-base">
									{value.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Company History */}
			<section className="mb-16">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">
						Lịch sử phát triển
					</h2>
					<p className="text-lg text-muted-foreground">
						Hành trình xây dựng và phát triển nền tảng doanh nghiệp
					</p>
				</div>

				<div className="relative">
					<div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-primary"></div>

					<div className="space-y-8">
						{milestones.map((milestone, index) => (
							<div
								key={index}
								className="relative flex items-center"
							>
								<div className="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
									<div className="w-3 h-3 bg-white rounded-full"></div>
								</div>

								<div
									className={`ml-12 md:ml-0 ${
										index % 2 === 0
											? "md:pr-8 md:text-right"
											: "md:pl-8 md:ml-1/2"
									} md:w-1/2`}
								>
									<Card>
										<CardHeader>
											<div className="flex items-center justify-between">
												<Badge variant="secondary">
													{milestone.year}
												</Badge>
											</div>
											<CardTitle className="text-xl">
												{milestone.title}
											</CardTitle>
										</CardHeader>
										<CardContent>
											<CardDescription className="text-base">
												{milestone.description}
											</CardDescription>
										</CardContent>
									</Card>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Leadership Message */}
			<section className="mb-16">
				<Card className="bg-gradient-to-r from-primary/5 to-primary/10">
					<CardContent className="pt-8">
						<div className="text-center">
							<h2 className="text-2xl font-bold mb-6">
								Thông điệp từ Ban lãnh đạo
							</h2>
							<blockquote className="text-lg text-muted-foreground italic max-w-4xl mx-auto leading-relaxed">
								&quot;Chúng tôi tin rằng sức mạnh của sự kết nối
								và hợp tác sẽ tạo ra những giá trị vượt xa tổng
								của các thành phần riêng lẻ. Enterprise Platform
								không chỉ là một nền tảng công nghệ, mà là cầu
								nối giúp các doanh nghiệp cùng phát triển và
								thành công trong thời đại số.&quot;
							</blockquote>
							<div className="mt-6">
								<div className="font-semibold text-lg">
									Nguyễn Văn A
								</div>
								<div className="text-muted-foreground">
									CEO & Founder
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</section>

			{/* Contact CTA */}
			<section className="text-center">
				<Card>
					<CardContent className="pt-8">
						<h3 className="text-2xl font-bold mb-4">
							Kết nối với chúng tôi
						</h3>
						<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
							Bạn muốn tìm hiểu thêm về cách chúng tôi có thể hỗ
							trợ doanh nghiệp của bạn? Hãy liên hệ với đội ngũ
							chuyên gia của chúng tôi.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Card className="p-4 text-center">
								<div className="text-sm text-muted-foreground mb-1">
									Email
								</div>
								<div className="font-semibold">
									contact@enterprise.com
								</div>
							</Card>
							<Card className="p-4 text-center">
								<div className="text-sm text-muted-foreground mb-1">
									Điện thoại
								</div>
								<div className="font-semibold">
									+84 (0)28 1234 5678
								</div>
							</Card>
							<Card className="p-4 text-center">
								<div className="text-sm text-muted-foreground mb-1">
									Địa chỉ
								</div>
								<div className="font-semibold">
									123 Đường Công Nghệ, Q.1, HCM
								</div>
							</Card>
						</div>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
