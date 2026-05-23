import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  college: string;
  passwordHash: string;
  isVerified: boolean;
  role: "student" | "admin";
  domain: "ai" | "cybersecurity" | null;
  internshipPlan: string | null;
  paymentStatus: "pending" | "completed";
  dashboardActive: boolean;
  testStatus: "pending" | "passed" | "failed";
  scheduledTestDate: Date | null;
  resetPasswordToken: string | null;
  resetPasswordExpire: Date | null;
  // Gamification
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: Date | null;
  badges: string[];
  // Progress
  currentDay: number;
  assignmentsCompleted: number;
  quizAccuracy: number;
  dailyQuizScores: {
    day: number;
    score: number;
    total: number;
    passed: boolean;
    completedAt: Date;
  }[];
  unlockedDays: number[];
  completedDays: number[];
  completedReadings: number[];
  completedQuizzes: number[];
  quizHistory: mongoose.Types.ObjectId[];
  totalProgress: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    domain: { type: String, enum: ["ai", "cybersecurity", null], default: null },
    internshipPlan: { type: String, default: null },
    paymentStatus: { type: String, enum: ["pending", "completed"], default: "pending" },
    dashboardActive: { type: Boolean, default: false },
    testStatus: { type: String, enum: ["pending", "passed", "failed"], default: "pending" },
    scheduledTestDate: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
    // Gamification
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 1 },
    lastActiveDate: { type: Date, default: null },
    badges: { type: [String], default: [] },
    // Progress
    currentDay: { type: Number, default: 1 },
    assignmentsCompleted: { type: Number, default: 0 },
    quizAccuracy: { type: Number, default: 0 },
    dailyQuizScores: {
      type: [
        {
          day: Number,
          score: Number,
          total: Number,
          passed: Boolean,
          completedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    unlockedDays: { type: [Number], default: [1] },
    completedDays: { type: [Number], default: [] },
    completedReadings: { type: [Number], default: [] },
    completedQuizzes: { type: [Number], default: [] },
    quizHistory: { type: [Schema.Types.ObjectId], ref: "QuizResult", default: [] },
    totalProgress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
