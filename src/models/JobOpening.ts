import mongoose, { Document, Model, Schema } from "mongoose";

export interface IJobOpening extends Document {
	title: string;
	description: string;
	requirements: string;
	salaryText: string;
	quantityText: string;
	location: string;
	experience: string;
	postedAt: Date;
	deadline: Date;
	status: "active" | "inactive" | "closed";
	createdAt: Date;
	updatedAt: Date;
}

const JobOpeningSchema: Schema = new Schema(
	{
		title: {
			type: String,
			required: [true, "Tiêu đề công việc là bắt buộc"],
			trim: true,
			maxlength: [200, "Tiêu đề công việc không được vượt quá 200 ký tự"],
		},
		description: {
			type: String,
			required: [true, "Mô tả công việc là bắt buộc"],
			maxlength: [2000, "Mô tả công việc không được vượt quá 2000 ký tự"],
		},
		requirements: {
			type: String,
			required: [true, "Yêu cầu công việc là bắt buộc"],
			maxlength: [
				3000,
				"Yêu cầu công việc không được vượt quá 3000 ký tự",
			],
		},
		salaryText: {
			type: String,
			required: [true, "Thông tin mức lương là bắt buộc"],
			trim: true,
			maxlength: [100, "Thông tin lương không được vượt quá 100 ký tự"],
		},
		quantityText: {
			type: String,
			required: [true, "Thông tin số lượng tuyển là bắt buộc"],
			trim: true,
			maxlength: [50, "Thông tin số lượng không được vượt quá 50 ký tự"],
		},
		location: {
			type: String,
			required: [true, "Địa điểm làm việc là bắt buộc"],
			trim: true,
			maxlength: [200, "Địa điểm không được vượt quá 200 ký tự"],
		},
		experience: {
			type: String,
			required: [true, "Yêu cầu kinh nghiệm là bắt buộc"],
			trim: true,
			maxlength: [
				100,
				"Thông tin kinh nghiệm không được vượt quá 100 ký tự",
			],
		},
		postedAt: {
			type: Date,
			default: Date.now,
		},
		deadline: {
			type: Date,
			required: [true, "Hạn nộp hồ sơ là bắt buộc"],
		},
		status: {
			type: String,
			enum: ["active", "inactive", "closed"],
			default: "active",
		},
	},
	{
		timestamps: true,
	}
);

// Indexes for better query performance
JobOpeningSchema.index({ status: 1, postedAt: -1 });
JobOpeningSchema.index({ deadline: 1 });

const JobOpening: Model<IJobOpening> =
	mongoose.models.JobOpening ||
	mongoose.model<IJobOpening>("JobOpening", JobOpeningSchema);

export default JobOpening;
