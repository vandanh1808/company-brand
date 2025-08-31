import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; // hoặc dbConnect nếu bạn export default
import Counter from "@/models/Counter";

async function incSite(step = 1) {
  await Counter.updateOne({ key: "siteTotal" }, { $inc: { count: step } }, { upsert: true });
}

export async function GET(_req: NextRequest) {
  await dbConnect();
  const site = await Counter.findOne({ key: "siteTotal" }).select("count").lean<{ count: number } | null>();
  return NextResponse.json({ siteTotal: site?.count ?? 0 });
}

export async function POST(_req: NextRequest) {
  await dbConnect();
  await incSite(1);
  const site = await Counter.findOne({ key: "siteTotal" }).select("count").lean<{ count: number } | null>();
  return NextResponse.json({ ok: true, siteTotal: site?.count ?? 0 });
}
