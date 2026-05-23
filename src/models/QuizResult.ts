import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizResult extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  day: number;
  score: number;
  totalMarks: number;
  percentage: number;
  correctAnswers: number;
  answers: {
    questionIndex: number;
    selectedOption: number;
    isCorrect: boolean;
  }[];
  submittedAt: Date;
}

const QuizResultSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    day: { type: Number, required: true },
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    answers: {
      type: [
        {
          questionIndex: { type: Number, required: true },
          selectedOption: { type: Number, required: true },
          isCorrect: { type: Boolean, required: true },
        },
      ],
      default: [],
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const QuizResult: Model<IQuizResult> =
  mongoose.models.QuizResult || mongoose.model<IQuizResult>("QuizResult", QuizResultSchema);

export default QuizResult;
