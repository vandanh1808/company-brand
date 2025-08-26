import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
	name: string;
	description?: string;
	price: number;
	quantity: number;
	images: string[];
	brandId: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Product name is required"],
			trim: true,
			maxlength: [200, "Product name cannot exceed 200 characters"],
		},
		description: {
			type: String,
			maxlength: [
				2000,
				"Product description cannot exceed 2000 characters",
			],
		},
		price: {
			type: Number,
			required: [true, "Product price is required"],
			min: [0, "Product price cannot be negative"],
		},
		quantity: {
			type: Number,
			required: [true, "Product quantity is required"],
			min: [0, "Product quantity cannot be negative"],
		},
		images: [
			{
				type: String,
			},
		],
		brandId: {
			type: Schema.Types.ObjectId,
			ref: "Brand",
			required: [true, "Brand ID is required"],
		},
	},
	{
		timestamps: true,
	}
);

const Product: Model<IProduct> =
	mongoose.models.Product ||
	mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
