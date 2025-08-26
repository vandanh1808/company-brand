"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Toaster } from "@/components/ui/sonner";

export function ToasterPortal() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	// Create a div with maximum z-index
	const toasterContainer = document.createElement("div");
	toasterContainer.style.position = "fixed";
	toasterContainer.style.top = "0";
	toasterContainer.style.left = "0";
	toasterContainer.style.right = "0";
	toasterContainer.style.zIndex = "2147483647";
	toasterContainer.style.pointerEvents = "none";

	document.body.appendChild(toasterContainer);

	return createPortal(<Toaster />, toasterContainer);
}
