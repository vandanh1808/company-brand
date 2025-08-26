import { cn } from "@/lib/utils";

interface SpinnerProps {
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-6 w-6",
		lg: "h-8 w-8",
		xl: "h-12 w-12",
	};

	return (
		<div className={cn("flex justify-center items-center", className)}>
			<div
				className={cn(
					"animate-spin rounded-full border-b-2 border-green-700",
					sizeClasses[size]
				)}
			/>
		</div>
	);
}

export function PageSpinner() {
	return (
		<div className="min-h-[400px] flex justify-center items-center">
			<Spinner size="lg" />
		</div>
	);
}
