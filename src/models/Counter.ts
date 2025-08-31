import { Schema, model, models, InferSchemaType, Model } from "mongoose";

const CounterSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Kiểu document dựa trên schema
export type CounterDoc = InferSchemaType<typeof CounterSchema>;

// Model
const Counter =
  (models.Counter as Model<CounterDoc>) ||
  model<CounterDoc>("Counter", CounterSchema);

export default Counter;

// Kiểu cho dữ liệu lean (chỉ các field cần dùng)
export type CounterLean = Pick<CounterDoc, "key" | "count">;
