import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ICompany extends Document {
  name: string
  description?: string
  logo?: string
  website?: string
  visitors: number
  createdAt: Date
  updatedAt: Date
}

const CompanySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Company description cannot exceed 1000 characters']
  },
  logo: {
    type: String,
    default: null
  },
  website: {
    type: String,
    default: null
  },
  visitors: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema)

export default Company