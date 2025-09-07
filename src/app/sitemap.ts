// src/app/sitemap.ts
import type { MetadataRoute } from "next";

const base =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

type Item = { id?: string; slug?: string; updatedAt?: string | Date };

// ---- type guards ----
function isObjectRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isItemArray(v: unknown): v is Item[] {
  return Array.isArray(v);
}
function hasDataArray(v: unknown): v is { data: Item[] } {
  return isObjectRecord(v) && Array.isArray((v as Record<string, unknown>).data);
}

// Ép dữ liệu về mảng an toàn, không dùng 'any'
function ensureArray<T extends Item = Item>(input: unknown): T[] {
  if (isItemArray(input)) return input as T[];
  if (hasDataArray(input)) return (input as { data: T[] }).data;
  return [];
}

function safeDate(input: unknown, fallback: Date): Date {
  const d = new Date(String(input ?? ""));
  return isNaN(d.getTime()) ? fallback : d;
}

async function safeFetch<T extends Item = Item>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${base}${path}`, {
      next: { revalidate: 60 * 60 }, // 1h
    });
    if (!res.ok) return [];
    const json: unknown = await res.json();
    return ensureArray<T>(json);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/brands`, lastModified: now },
    { url: `${base}/companies`, lastModified: now },
    { url: `${base}/products`, lastModified: now },
    { url: `${base}/recruitment`, lastModified: now },
  ];

  const [brands, companies, products] = await Promise.all([
    safeFetch("/api/brands"),
    safeFetch("/api/companies"),
    safeFetch("/api/products"),
  ]);

  const brandPages: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${base}/brands/${b.slug ?? b.id}`,
    lastModified: safeDate(b.updatedAt, now),
  }));

  const companyPages: MetadataRoute.Sitemap = companies.map((c) => ({
    url: `${base}/companies/${c.slug ?? c.id}`,
    lastModified: safeDate(c.updatedAt, now),
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/products/${p.slug ?? p.id}`,
    lastModified: safeDate(p.updatedAt, now),
  }));

  return [...staticPages, ...brandPages, ...companyPages, ...productPages];
}
