// src/app/sitemap.ts
import type { MetadataRoute } from "next";

/**
 * Base URL: ưu tiên biến môi trường, fallback theo Vercel/localhost.
 * Đặt NEXT_PUBLIC_SITE_URL="https://sale-company.vercel.app" trong .env.production
 */
const base =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

// Kiểu dữ liệu tối thiểu sitemap cần từ API
type Item = { id?: string; slug?: string; updatedAt?: string | Date };

async function safeFetch<T = Item[]>(
  path: string
): Promise<T | []> {
  try {
    const res = await fetch(`${base}${path}`, {
      // revalidate để search engine nhận mốc cập nhật
      next: { revalidate: 60 * 60 }, // 1h
    });
    if (!res.ok) return [];
    return (await res.json()) as T;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1) Trang tĩnh (public)
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/brands`, lastModified: now },
    { url: `${base}/companies`, lastModified: now },
    { url: `${base}/products`, lastModified: now },
    { url: `${base}/recruitment`, lastModified: now },
  ];

  // 2) Trang động: /brands/[id], /companies/[id], /products/[id]
  //    API kỳ vọng trả về mảng item có `slug` (ưu tiên) hoặc `id`.
  const [brands, companies, products] = await Promise.all([
    safeFetch<Item[]>("/api/brands"),
    safeFetch<Item[]>("/api/companies"),
    safeFetch<Item[]>("/api/products"),
  ]);

  const brandPages: MetadataRoute.Sitemap = (brands as Item[]).map((b) => ({
    url: `${base}/brands/${b.slug ?? b.id}`,
    lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
  }));

  const companyPages: MetadataRoute.Sitemap = (companies as Item[]).map((c) => ({
    url: `${base}/companies/${c.slug ?? c.id}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
  }));

  const productPages: MetadataRoute.Sitemap = (products as Item[]).map((p) => ({
    url: `${base}/products/${p.slug ?? p.id}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
  }));

  // 3) Gộp & trả về
  return [...staticPages, ...brandPages, ...companyPages, ...productPages];
}
