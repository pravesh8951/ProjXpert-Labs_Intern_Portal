import mongoose, { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: Number, required: true }, // Index of correct option
  category: { type: String, enum: ["aptitude", "ai", "cybersecurity"], required: true },
});

const Question = models.Question || model("Question", QuestionSchema);
export default Question;
