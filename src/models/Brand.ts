import mongoose, { Document, InferSchemaType, Model, Schema } from "mongoose";
// 👇 thêm dòng này để đảm bảo model Company được register
import "./Company";

export interface IBrand extends Document {
	name: string;
	description?: string;
	logo?: string;
	companyId: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const BrandSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Tên thương hiệu là bắt buộc"],
			trim: true,
			maxlength: [100, "Tên thương hiệu không được vượt quá 100 ký tự"],
		},
		description: {
			type: String,
			maxlength: [500, "Mô tả thương hiệu không được vượt quá 500 ký tự"],
		},
		logo: {
			type: String,
			default: null,
		},
		companyId: {
			type: Schema.Types.ObjectId,
			ref: "Company",
			required: [true, "ID công ty là bắt buộc"],
		},
	},
	{
		timestamps: true,
	}
);

export type BrandDoc = InferSchemaType<typeof BrandSchema>;
const Brand: Model<BrandDoc> =
	mongoose.models.Brand || mongoose.model<BrandDoc>("Brand", BrandSchema);

export default Brand;
