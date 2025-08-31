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
import {
  COMPANY_INFO,
  COMPANY_INTRODUCTION,
  CONTACT_CTA,
  CORE_VALUE_HEADER,
  CORE_VALUES,
  LEADERSHIP_MESSAGE,
} from "./data/companyInfo";
import BannerSlideshow from "@/components/BannerSlideshow";
import VisitCounter from "@/components/VisitCounter";
import ClientVisitSection from "@/components/ClientVisitSection";

export default function Page() {
  return (
    <>
      {/* Full-width Banner Slideshow */}
      <BannerSlideshow />

      <div className="container mx-auto px-4 py-8">
        {/* Company Introduction Section */}
        <section className="mb-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
              {COMPANY_INTRODUCTION.title}
            </h1>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-700">
                {COMPANY_INTRODUCTION.description}
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                {COMPANY_INTRODUCTION.network}
              </p>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-900">
                  {COMPANY_INTRODUCTION.partnersTitle}
                </h3>
                <ul className="space-y-3">
                  {COMPANY_INTRODUCTION.partners.map((partner, index) => (
                    <li key={index} className="flex">
                      <span className="text-blue-600 mr-2">•</span>
                      <div>
                        <span className="font-semibold text-gray-800">
                          {partner.name}:
                        </span>{" "}
                        <span className="text-gray-700">
                          {partner.products}
                        </span>
                      </div>
                    </li>
                  ))}
                  <li className="flex">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">
                      {COMPANY_INTRODUCTION.additionalInfo}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {CORE_VALUE_HEADER.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {CORE_VALUE_HEADER.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CORE_VALUES.map((value, index) => (
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
        {/* <section className="mb-16">
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
			</section> */}

        {/* Leadership Message */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="pt-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-6">
                  {LEADERSHIP_MESSAGE.title}
                </h2>
                <blockquote className="text-lg text-muted-foreground italic max-w-4xl mx-auto leading-relaxed">
                  {LEADERSHIP_MESSAGE.message}
                </blockquote>
                <div className="mt-6">
                  <div className="font-semibold text-lg">
                    {LEADERSHIP_MESSAGE.representative}
                  </div>
                  <div className="text-muted-foreground">
                    {LEADERSHIP_MESSAGE.role}
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
              <h3 className="text-2xl font-bold mb-4">{CONTACT_CTA.title}</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {CONTACT_CTA.description}
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center">
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

                <Card className="p-4 text-center min-w-[220px] sm:min-w-[260px] break-words">
                  <div className="text-sm text-muted-foreground mb-1">
                    Địa chỉ
                  </div>
                  <div className="font-semibold whitespace-pre-line">
                    {COMPANY_INFO.address}
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
