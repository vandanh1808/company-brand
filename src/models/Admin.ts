import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
	email: string;
	password: string;
	name: string;
	role: "super_admin" | "admin";
	createdAt: Date;
	updatedAt: Date;
	comparePassword(password: string): Promise<boolean>;
}

const AdminSchema: Schema = new Schema(
	{
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
		name: {
			type: String,
			required: [true, "Tên là bắt buộc"],
			trim: true,
			maxlength: [100, "Tên không được vượt quá 100 ký tự"],
		},
		role: {
			type: String,
			enum: ["super_admin", "admin"],
			default: "admin",
		},
	},
	{
		timestamps: true,
	}
);

AdminSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password as string, salt);
		next();
	} catch (error) {
		next(
			error instanceof Error
				? error
				: new Error("Đã xảy ra lỗi không xác định")
		);
	}
});

AdminSchema.methods.comparePassword = async function (
	password: string
): Promise<boolean> {
	return bcrypt.compare(password, this.password);
};

const Admin: Model<IAdmin> =
	mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
