import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICompany extends Document {
	name: string;
	description?: string;
	logo?: string;
	website?: string;
	visitors: number;
	createdAt: Date;
	updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Tên công ty là bắt buộc"],
			trim: true,
			maxlength: [100, "Tên công ty không được vượt quá 100 ký tự"],
		},
		description: {
			type: String,
			maxlength: [1000, "Mô tả công ty không được vượt quá 1000 ký tự"],
		},
		logo: {
			type: String,
			default: null,
		},
		website: {
			type: String,
			default: null,
		},
		visitors: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

const Company: Model<ICompany> =
	mongoose.models.Company ||
	mongoose.model<ICompany>("Company", CompanySchema);

export default Company;
