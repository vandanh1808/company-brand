// =============================
// app/api/company-profile/route.ts (GET, PUT)
// =============================
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { CompanyProfile } from "@/models/CompanyProfile";

export async function GET() {
	await dbConnect();
	const doc = await CompanyProfile.findOne({ slug: "default" }).lean();
	return NextResponse.json({ success: true, data: doc });
}

export async function PUT(req: Request) {
	try {
		await dbConnect();
		const body = await req.json();
		const updated = await CompanyProfile.findOneAndUpdate(
			{ slug: "default" },
			{ ...body, slug: "default" },
			{ new: true, upsert: true }
		).lean();
		return NextResponse.json({ success: true, data: updated });
	} catch (e: unknown) {
		return NextResponse.json(
			{ success: false, error: (e as Error)?.message || "Update failed" },
			{ status: 500 }
		);
	}
}
