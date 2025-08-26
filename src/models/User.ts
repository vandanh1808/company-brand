import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: "admin" | "super_admin";
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: [true, "Tên là bắt buộc"],
			trim: true,
			maxlength: [100, "Tên không được vượt quá 100 ký tự"],
		},
		email: {
			type: String,
			required: [true, "Email là bắt buộc"],
			unique: true,
			lowercase: true,
			trim: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				"Vui lòng nhập email hợp lệ",
			],
		},
		password: {
			type: String,
			required: [true, "Mật khẩu là bắt buộc"],
			minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
		},
		role: {
			type: String,
			enum: ["admin", "super_admin"],
			default: "admin",
		},
	},
	{
		timestamps: true,
	}
);

UserSchema.index({ email: 1 });

export const User: Model<IUser> =
	mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
