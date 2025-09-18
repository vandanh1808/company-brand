// =============================
// models/CompanyProfile.ts
// =============================
import { Schema, model, models } from "mongoose";

const PartnerSchema = new Schema(
	{
		name: { type: String, required: true },
		products: { type: String, default: "" },
	},
	{ _id: false }
);

const CoreValueSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, default: "" },
		// store lucide icon name as string, e.g. "Target", "Heart"
		icon: { type: String, default: "Lightbulb" },
	},
	{ _id: false }
);

const CompanyProfileSchema = new Schema(
	{
		slug: { type: String, unique: true, default: "default" },

		companyInfo: {
			email: String,
			phone: String,
			address: String,
			website: String,
		},

		companyIntroduction: {
			title: { type: String, default: "Giới thiệu" },
			description: { type: String, default: "" },
			network: { type: String, default: "" },
			partnersTitle: { type: String, default: "Đối tác" },
			additionalInfo: { type: String, default: "" },
			partners: { type: [PartnerSchema], default: [] },
		},

		coreValueHeader: {
			title: { type: String, default: "Giá trị cốt lõi" },
			description: { type: String, default: "" },
		},
		coreValues: { type: [CoreValueSchema], default: [] },

		leadershipMessage: {
			title: { type: String, default: "Thông điệp lãnh đạo" },
			message: { type: String, default: "" },
			representative: { type: String, default: "" },
			role: { type: String, default: "" },
		},

		contactCTA: {
			title: { type: String, default: "Liên hệ" },
			description: { type: String, default: "" },
		},

		logo: { type: String, default: "" },
		name: { type: String, default: "" },
		updatedBy: { type: String, default: "" },
	},
	{ timestamps: true }
);

export type TCompanyProfile = typeof CompanyProfileSchema extends infer T
	? any
	: any;

export const CompanyProfile =
	models.CompanyProfile || model("CompanyProfile", CompanyProfileSchema);
