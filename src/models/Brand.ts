import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IBrand extends Document {
  name: string
  description?: string
  logo?: string
  companyId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const BrandSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Brand description cannot exceed 500 characters']
  },
  logo: {
    type: String,
    default: null
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required']
  }
}, {
  timestamps: true
})

const Brand: Model<IBrand> = mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema)

export default Brand