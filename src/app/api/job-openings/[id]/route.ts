import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import JobOpening from "@/models/JobOpening";
import mongoose from "mongoose";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await connectToDatabase();

		if (!mongoose.Types.ObjectId.isValid(params.id)) {
			return NextResponse.json(
				{ success: false, error: "Invalid job opening ID" },
				{ status: 400 }
			);
		}

		const jobOpening = await JobOpening.findById(params.id);

		if (!jobOpening) {
			return NextResponse.json(
				{ success: false, error: "Job opening not found" },
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
						: "An unknown error occurred",
			},
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await connectToDatabase();

		if (!mongoose.Types.ObjectId.isValid(params.id)) {
			return NextResponse.json(
				{ success: false, error: "Invalid job opening ID" },
				{ status: 400 }
			);
		}

		const body = await request.json();

		// Convert deadline string to Date if needed
		if (body.deadline && typeof body.deadline === "string") {
			body.deadline = new Date(body.deadline);
		}

		const jobOpening = await JobOpening.findByIdAndUpdate(params.id, body, {
			new: true,
			runValidators: true,
		});

		if (!jobOpening) {
			return NextResponse.json(
				{ success: false, error: "Job opening not found" },
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
						: "An unknown error occurred",
			},
			{ status: 400 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await connectToDatabase();

		if (!mongoose.Types.ObjectId.isValid(params.id)) {
			return NextResponse.json(
				{ success: false, error: "Invalid job opening ID" },
				{ status: 400 }
			);
		}

		const jobOpening = await JobOpening.findByIdAndDelete(params.id);

		if (!jobOpening) {
			return NextResponse.json(
				{ success: false, error: "Job opening not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Job opening deleted successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "An unknown error occurred",
			},
			{ status: 500 }
		);
	}
}
