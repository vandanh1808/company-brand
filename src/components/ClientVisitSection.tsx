"use client";

import useSiteVisit from "@/hooks/useVisitTracker";
import VisitCounter from "@/components/VisitCounter"; // bản site-only
import { usePathname } from "next/navigation";

export default function ClientSiteCounter({
  variant = "chip",
  className = "",
}: {
  variant?: "chip" | "card" | "floating";
  className?: string;
}) {
  useSiteVisit(); // ghi nhận site-wide 1 lần/phiên

  const pathname = usePathname();

  // Ví dụ: ẩn ở /admin và /auth
  const hidden =
    pathname?.startsWith("/admin") || pathname?.startsWith("/auth");
  if (hidden) return null;

  return <VisitCounter variant={variant} className={className} />; // chỉ hiện siteTotal
}
