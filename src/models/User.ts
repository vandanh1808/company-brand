import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'admin' | 'super_admin'
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
      type: String,
      enum: ['admin', 'super_admin'],
      default: 'admin'
    }
  },
  {
    timestamps: true
  }
)

UserSchema.index({ email: 1 })

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)