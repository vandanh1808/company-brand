import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import JobOpening from "@/models/JobOpening";
import mongoose from "mongoose";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectToDatabase();
		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ success: false, error: "ID tin tuyển dụng không hợp lệ" },
				{ status: 400 }
			);
		}

		const jobOpening = await JobOpening.findById(id);

		if (!jobOpening) {
			return NextResponse.json(
				{ success: false, error: "Không tìm thấy tin tuyển dụng" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: jobOpening });
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

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectToDatabase();
		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ success: false, error: "ID tin tuyển dụng không hợp lệ" },
				{ status: 400 }
			);
		}

		const body = await request.json();

		// Convert deadline string to Date if needed
		if (body.deadline && typeof body.deadline === "string") {
			body.deadline = new Date(body.deadline);
		}

		const jobOpening = await JobOpening.findByIdAndUpdate(id, body, {
			new: true,
			runValidators: true,
		});

		if (!jobOpening) {
			return NextResponse.json(
				{ success: false, error: "Không tìm thấy tin tuyển dụng" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: jobOpening });
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

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await connectToDatabase();
		const { id } = await params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ success: false, error: "ID tin tuyển dụng không hợp lệ" },
				{ status: 400 }
			);
		}

		const jobOpening = await JobOpening.findByIdAndDelete(id);

		if (!jobOpening) {
			return NextResponse.json(
				{ success: false, error: "Không tìm thấy tin tuyển dụng" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Đã xóa tin tuyển dụng thành công",
		});
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
