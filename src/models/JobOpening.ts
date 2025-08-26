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
			required: [true, "Job title is required"],
			trim: true,
			maxlength: [200, "Job title cannot exceed 200 characters"],
		},
		description: {
			type: String,
			required: [true, "Job description is required"],
			maxlength: [2000, "Job description cannot exceed 2000 characters"],
		},
		requirements: {
			type: String,
			required: [true, "Job requirements are required"],
			maxlength: [3000, "Job requirements cannot exceed 3000 characters"],
		},
		salaryText: {
			type: String,
			required: [true, "Salary information is required"],
			trim: true,
			maxlength: [100, "Salary text cannot exceed 100 characters"],
		},
		quantityText: {
			type: String,
			required: [true, "Quantity information is required"],
			trim: true,
			maxlength: [50, "Quantity text cannot exceed 50 characters"],
		},
		location: {
			type: String,
			required: [true, "Location is required"],
			trim: true,
			maxlength: [200, "Location cannot exceed 200 characters"],
		},
		experience: {
			type: String,
			required: [true, "Experience requirement is required"],
			trim: true,
			maxlength: [100, "Experience text cannot exceed 100 characters"],
		},
		postedAt: {
			type: Date,
			default: Date.now,
		},
		deadline: {
			type: Date,
			required: [true, "Application deadline is required"],
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
