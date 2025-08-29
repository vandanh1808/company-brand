import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Brand from "@/models/Brand";
import Product from "@/models/Product";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		const brand = await Brand.findById(id).populate("companyId", "name");

		if (!brand) {
			return NextResponse.json(
				{ success: false, error: "Brand not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: brand });
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
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;
		const body = await request.json();

		const brand = await Brand.findByIdAndUpdate(id, body, {
			new: true,
			runValidators: true,
		}).populate("companyId", "name");

		if (!brand) {
			return NextResponse.json(
				{ success: false, error: "Brand not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, data: brand });
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
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		await dbConnect();
		const { id } = await params;

		// First check if brand exists
		const brand = await Brand.findById(id);
		if (!brand) {
			return NextResponse.json(
				{ success: false, error: "Brand not found" },
				{ status: 404 }
			);
		}

		// Delete all products belonging to this brand
		const deleteResult = await Product.deleteMany({ brandId: id });

		// Delete the brand
		await Brand.findByIdAndDelete(id);

		return NextResponse.json({
			success: true,
			data: brand,
			message: `Deleted brand "${brand.name}" along with ${
				deleteResult.deletedCount || 0
			} products`,
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
