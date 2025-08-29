"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Nếu sau này mỗi banner có nhiều ảnh, bạn chỉ cần thay baseName */
type Banner = {
	alt: string;
	baseName: string; // ví dụ: "first_banner"
};

const banners: Banner[] = [
	{ baseName: "first_banner", alt: "Banner 1" },
	// { baseName: "second_banner", alt: "Banner 2" },
	// { baseName: "third_banner", alt: "Banner 3" },
];

/** Component render 1 slide với <picture> + object-contain (không crop) */
function SlidePicture({ baseName, alt }: { baseName: string; alt: string }) {
	// Các file bạn đã tạo trong /public/home/
	const src1920 = `/home/${baseName}_1920x1080.jpg`; // mobile / nhỏ
	const src2520 = `/home/${baseName}_2520x1080.jpg`; // md / lg
	const src3000 = `/home/${baseName}_3000x1200.jpg`; // xl trở lên

	return (
		<div className="relative w-full h-full">
			{/* Art-direction theo breakpoint, KHÔNG crop nội dung */}
			<picture>
				{/* Desktop lớn trước */}
				<source media="(min-width: 1280px)" srcSet={src3000} />
				{/* Tablet / desktop vừa */}
				<source media="(min-width: 768px)" srcSet={src2520} />
				{/* Mobile / nhỏ */}
				<img
					src={src1920}
					alt={alt}
					loading="lazy"
					className="w-full h-full object-contain"
				/>
			</picture>
		</div>
	);
}

export default function BannerSlideshow() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	// Auto-play
	useEffect(() => {
		if (!isAutoPlaying) return;
		const itv = setInterval(() => {
			setCurrentSlide((p) => (p + 1) % banners.length);
		}, 5000);
		return () => clearInterval(itv);
	}, [isAutoPlaying]);

	const pauseThenResume = () => {
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 10000);
	};

	const goToPrevious = () => {
		setCurrentSlide((p) => (p - 1 + banners.length) % banners.length);
		pauseThenResume();
	};

	const goToNext = () => {
		setCurrentSlide((p) => (p + 1) % banners.length);
		pauseThenResume();
	};

	const goToSlide = (i: number) => {
		setCurrentSlide(i);
		pauseThenResume();
	};

	return (
		/* Khung tỷ lệ thay vì đặt height cứng */
		<div className="relative w-full aspect-[16/9] md:aspect-[21/9] xl:aspect-[5/2] overflow-hidden bg-gray-100">
			{/* Slides */}
			<div
				className="flex transition-transform duration-700 ease-in-out h-full"
				style={{ transform: `translateX(-${currentSlide * 100}%)` }}
			>
				{banners.map((b, i) => (
					<div
						key={i}
						className="relative w-full h-full flex-shrink-0"
					>
						<SlidePicture baseName={b.baseName} alt={b.alt} />
					</div>
				))}
			</div>

			{/* Arrows */}
			<button
				onClick={goToPrevious}
				className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
				aria-label="Previous slide"
			>
				<ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
			</button>
			<button
				onClick={goToNext}
				className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
				aria-label="Next slide"
			>
				<ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
			</button>

			{/* Dots */}
			<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
				{banners.map((_, i) => (
					<button
						key={i}
						onClick={() => goToSlide(i)}
						className={`transition-all duration-300 ${
							currentSlide === i
								? "w-8 h-2 bg-white"
								: "w-2 h-2 bg-white/60 hover:bg-white/80"
						} rounded-full`}
						aria-label={`Go to slide ${i + 1}`}
					/>
				))}
			</div>
		</div>
	);
}
