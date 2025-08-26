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
			required: [true, "Tên sản phẩm là bắt buộc"],
			trim: true,
			maxlength: [200, "Tên sản phẩm không được vượt quá 200 ký tự"],
		},
		description: {
			type: String,
			maxlength: [2000, "Mô tả sản phẩm không được vượt quá 2000 ký tự"],
		},
		price: {
			type: Number,
			required: [true, "Giá sản phẩm là bắt buộc"],
			min: [0, "Giá sản phẩm không được âm"],
		},
		quantity: {
			type: Number,
			required: [true, "Số lượng sản phẩm là bắt buộc"],
			min: [0, "Số lượng sản phẩm không được âm"],
		},
		images: [
			{
				type: String,
			},
		],
		brandId: {
			type: Schema.Types.ObjectId,
			ref: "Brand",
			required: [true, "ID thương hiệu là bắt buộc"],
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
