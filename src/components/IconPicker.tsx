// components/IconPicker.tsx
"use client";

import * as Icons from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Props = {
	value?: string;
	onChange: (val: string) => void;
	placeholder?: string;
	className?: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { icons } from "lucide"; // object { 'alarm-clock': IconNode, ... }
import { createLucideIcon } from "lucide-react";
import { Lightbulb } from "lucide-react";

const cache = new Map<string, any>();

/** 'alarm-clock' -> 'AlarmClock' */
function kebabToPascal(name: string) {
	return name
		.split("-")
		.filter(Boolean)
		.map((s) => s[0]?.toUpperCase() + s.slice(1))
		.join("");
}

/** Nhận icon React component từ tên (kebab-case). Fallback Lightbulb */
export function getLucideByKebab(name?: string) {
	if (!name) return Lightbulb;
	const key = name.toLowerCase();
	if (cache.has(key)) return cache.get(key);

	const node = (icons as any)[key];
	if (!node) return Lightbulb;

	const Comp = createLucideIcon(kebabToPascal(key), node);
	cache.set(key, Comp);
	return Comp;
}

/** Toàn bộ tên icon ở dạng kebab-case (ví dụ 'alarm-clock', 'shield', ...) */
export const ALL_ICON_NAMES: string[] = Object.keys(icons);

export default function IconPicker({
	value,
	onChange,
	placeholder,
	className,
}: Props) {
	const [open, setOpen] = useState(false);
	const [q, setQ] = useState("");

	const filtered = useMemo(() => {
		const key = q.trim().toLowerCase();
		if (!key) return ALL_ICON_NAMES.slice(0, 200); // limit để nhẹ UI
		return ALL_ICON_NAMES.filter((n) =>
			n.toLowerCase().includes(key)
		).slice(0, 200);
	}, [q]);

	const CurrentIcon =
		(value && (Icons as any)[value]) || (Icons as any)["Lightbulb"];

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div className="flex items-center gap-2 rounded-md border px-1 w-full">
				<CurrentIcon className="w-5 h-5 text-primary shrink-0" />
				<Input
					readOnly
					value={value || ""}
					placeholder={placeholder || "Chọn icon (Lucide)"}
					className="border-0 shadow-none px-0 focus-visible:ring-0"
				/>
			</div>

			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button type="button" variant="secondary">
						Chọn
					</Button>
				</PopoverTrigger>
				<PopoverContent align="end" className="w-96">
					<div className="space-y-2">
						<Input
							placeholder="Tìm icon… (vd: target, heart)"
							value={q}
							onChange={(e) => setQ(e.target.value)}
						/>
						<ScrollArea className="h-64 border rounded-md p-2">
							<div className="grid grid-cols-3 gap-2">
								{filtered.map((name) => {
									const Icon = (Icons as any)[name];
									const active = name === value;
									return (
										<button
											key={name}
											type="button"
											onClick={() => {
												onChange(name);
												setOpen(false);
											}}
											className={cn(
												"flex flex-col items-center justify-center gap-1 rounded-md border p-3 hover:bg-accent transition",
												active &&
													"border-primary bg-primary/5"
											)}
											title={name}
										>
											{Icon && (
												<Icon className="w-6 h-6" />
											)}
											<span className="text-xs truncate w-full">
												{name}
											</span>
										</button>
									);
								})}
							</div>
						</ScrollArea>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
