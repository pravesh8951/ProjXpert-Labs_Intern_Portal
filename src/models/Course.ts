import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDayContent {
  day: number;
  weekday: string;
  title: string;
  topics: string[];
  content: {
    theory: string;
    keyPoints: string[];
    deepDive?: string;
    realWorldExample?: string;
    codeSnippet?: string;
  };
}

export interface IWeek {
  week: number;
  title: string;
  tools: string[];
  assignment: string;
  miniProject: string;
  days: IDayContent[];
}

export interface IMonth {
  month: number;
  title: string;
  goal: string;
  weeks: IWeek[];
}

export interface ICoursePlan {
  duration: number;
  level: string;
  price: number;
  certificateName: string;
  weeksIncluded: number[];
}

export interface ICourse extends Document {
  title: string;
  domain: string;
  description: string;
  plans: ICoursePlan[];
  months: IMonth[];
  createdAt: Date;
  updatedAt: Date;
}

const DayContentSchema = new Schema({
  day: { type: Number, required: true },
  weekday: { type: String, required: true },
  title: { type: String, required: true },
  topics: { type: [String], required: true },
  content: {
    theory: { type: String, required: true },
    keyPoints: { type: [String], required: true },
    deepDive: { type: String },
    realWorldExample: { type: String },
    codeSnippet: { type: String },
  },
});

const WeekSchema = new Schema({
  week: { type: Number, required: true },
  title: { type: String, required: true },
  tools: { type: [String], required: true },
  assignment: { type: String, required: true },
  miniProject: { type: String, required: true },
  days: { type: [DayContentSchema], required: true },
});

const MonthSchema = new Schema({
  month: { type: Number, required: true },
  title: { type: String, required: true },
  goal: { type: String, required: true },
  weeks: { type: [WeekSchema], required: true },
});

const CoursePlanSchema = new Schema({
  duration: { type: Number, required: true },
  level: { type: String, required: true },
  price: { type: Number, required: true },
  certificateName: { type: String, required: true },
  weeksIncluded: { type: [Number], required: true },
});

const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    domain: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    plans: { type: [CoursePlanSchema], required: true },
    months: { type: [MonthSchema], required: true },
  },
  { timestamps: true }
);

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
export default Course;
