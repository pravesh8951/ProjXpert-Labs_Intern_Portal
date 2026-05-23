import mongoose, { Schema, model, models } from "mongoose";

const PaymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: String, required: true },
  paymentId: { type: String },
  signature: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
  plan: { type: String, required: true },
}, { timestamps: true });

const Payment = models.Payment || model("Payment", PaymentSchema);
export default Payment;
