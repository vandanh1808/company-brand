"use client";

import useSWR from "swr";
import { Eye, BarChart3, Info } from "lucide-react";
import { useEffect } from "react";

type Variant = "chip" | "card" | "floating";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function VisitCounter({
  variant = "chip",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  // KHÔNG truyền path => chỉ lấy siteTotal
  const { data, isLoading, error, mutate } = useSWR("/api/visits", fetcher, {
    revalidateOnFocus: false,
  });

  // refresh nhẹ lần đầu để khớp POST
  useEffect(() => {
    const t = setTimeout(() => mutate(), 800);
    return () => clearTimeout(t);
  }, [mutate]);

  const siteTotal = data?.siteTotal ?? 0;

  if (error) {
    return (
      <div
        className={`text-xs rounded-md px-2 py-1 bg-red-50 text-red-700 border border-red-200 ${className}`}
      >
        Lỗi tải số liệu
      </div>
    );
  }

  if (variant === "chip")
    return (
      <Chip isLoading={isLoading} siteTotal={siteTotal} className={className} />
    );
  if (variant === "floating")
    return (
      <Floating
        isLoading={isLoading}
        siteTotal={siteTotal}
        className={className}
      />
    );
  return (
    <CardStat
      isLoading={isLoading}
      siteTotal={siteTotal}
      className={className}
    />
  );
}

function SkeletonLine({ w = "w-16" }: { w?: string }) {
  return (
    <span
      className={`inline-block h-4 ${w} animate-pulse rounded bg-gray-200 dark:bg-gray-700`}
    />
  );
}

/** Chip nhỏ gọn: chỉ tổng site */
function Chip({
  isLoading,
  siteTotal,
  className = "",
}: {
  isLoading: boolean;
  siteTotal: number;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs
      bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50
      dark:bg-neutral-900/50 dark:border-neutral-800 ${className}`}
      title="Tổng lượt truy cập toàn site"
    >
      <Eye className="h-3.5 w-3.5 opacity-80" />
      {isLoading ? (
        <SkeletonLine w="w-10" />
      ) : (
        <span className="font-medium">{formatNumber(siteTotal)}</span>
      )}
    </div>
  );
}

/** Thẻ thống kê: chỉ tổng site */
function CardStat({
  isLoading,
  siteTotal,
  className = "",
}: {
  isLoading: boolean;
  siteTotal: number;
  className?: string;
}) {
  return (
    <div
      className={`grid gap-3 rounded-2xl border p-4 md:p-5
      bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60
      dark:bg-neutral-900/50 dark:border-neutral-800 ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl border bg-white dark:bg-neutral-900 dark:border-neutral-800">
          <BarChart3 className="h-4.5 w-4.5" />
        </div>
        <div className="text-sm font-semibold">Lượt truy cập</div>
        <span className="ml-auto" title="Tổng lượt truy cập toàn site">
          <Info className="h-4 w-4 opacity-50" />
        </span>
      </div>

      <div className="rounded-xl border p-3 text-sm dark:border-neutral-800">
        <div className="opacity-60">Tổng site</div>
        <div className="mt-1 text-2xl font-semibold">
          {isLoading ? <SkeletonLine w="w-24" /> : formatNumber(siteTotal)}
        </div>
      </div>
    </div>
  );
}

/** Floating glass badge: chỉ tổng site */
function Floating({
  isLoading,
  siteTotal,
  className = "",
}: {
  isLoading: boolean;
  siteTotal: number;
  className?: string;
}) {
  return (
    <div
      className={`fixed bottom-5 right-5 z-50 rounded-2xl border px-4 py-3 shadow-lg
      bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50
      dark:bg-neutral-900/60 dark:border-neutral-800 ${className}`}
      title="Tổng lượt truy cập toàn site"
    >
      <div className="flex items-center gap-2 text-sm">
        <Eye className="h-4 w-4 opacity-80" />
        {isLoading ? (
          <SkeletonLine w="w-16" />
        ) : (
          <span className="font-medium">{formatNumber(siteTotal)}</span>
        )}
      </div>
    </div>
  );
}

function formatNumber(n: number) {
  try {
    return new Intl.NumberFormat("vi-VN").format(n);
  } catch {
    return String(n);
  }
}
