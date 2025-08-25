import mongoose, { Document, Model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IAdmin extends Document {
  email: string
  password: string
  name: string
  role: 'super_admin' | 'admin'
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

const AdminSchema: Schema = new Schema({
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
    minlength: [6, 'Password must be at least 6 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin'],
    default: 'admin'
  }
}, {
  timestamps: true
})

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password as string, salt)
    next()
  } catch (error) {
    next(error instanceof Error ? error : new Error('An unknown error occurred'))
  }
})

AdminSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password)
}

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)

export default Admin