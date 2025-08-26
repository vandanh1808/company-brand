import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import JobOpening from "@/models/JobOpening";

export async function GET(request: NextRequest) {
	try {
		await connectToDatabase();

		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");
		const limit = searchParams.get("limit");

		const filter: Record<string, unknown> = {};
		if (status) {
			filter.status = status;
		}

		let query = JobOpening.find(filter).sort({ postedAt: -1 });

		if (limit) {
			query = query.limit(parseInt(limit));
		}

		const jobOpenings = await query.exec();
		return NextResponse.json({ success: true, data: jobOpenings });
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Đã xảy ra lỗi không xác định",
			},
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await connectToDatabase();
		const body = await request.json();

		// Convert deadline string to Date if needed
		if (body.deadline && typeof body.deadline === "string") {
			body.deadline = new Date(body.deadline);
		}

		const jobOpening = await JobOpening.create(body);
		return NextResponse.json(
			{ success: true, data: jobOpening },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Đã xảy ra lỗi không xác định",
			},
			{ status: 400 }
		);
	}
}
