import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizProgress {
  day: number;
  completed: boolean;
  score: number;
  totalMarks: number;
  percentage: number;
  submittedAt?: Date;
}

export interface IReadingProgress {
  day: number;
  completed: boolean;
}

export interface IUserCourseProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId | null;
  subscriptionPlan: string;
  totalDays: number;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate?: Date;
  completedDays: number[];
  unlockedDays: number[];
  quizProgress: IQuizProgress[];
  readingProgress: IReadingProgress[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizProgressSchema = new Schema<IQuizProgress>({
  day: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  submittedAt: { type: Date },
});

const ReadingProgressSchema = new Schema<IReadingProgress>({
  day: { type: Number, required: true },
  completed: { type: Boolean, default: false },
});

const UserCourseProgressSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", default: null }, // Nullable if domains act as courses
    subscriptionPlan: { type: String, required: true },
    totalDays: { type: Number, required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 1 },
    lastActiveDate: { type: Date },
    completedDays: { type: [Number], default: [] },
    unlockedDays: { type: [Number], default: [1] },
    quizProgress: { type: [QuizProgressSchema], default: [] },
    readingProgress: { type: [ReadingProgressSchema], default: [] },
  },
  { timestamps: true }
);

// Prevent duplicate progress documents for the same user (and course, if used later)
UserCourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const UserCourseProgress: Model<IUserCourseProgress> =
  mongoose.models.UserCourseProgress ||
  mongoose.model<IUserCourseProgress>("UserCourseProgress", UserCourseProgressSchema);

export default UserCourseProgress;
