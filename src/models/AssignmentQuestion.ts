import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAssignment {
  week: number;
  assignmentTitle: string;
  task: string;
}

export interface IAssignmentQuestion extends Document {
  domain: string;
  assignments: IAssignment[];
}

const AssignmentSchema = new Schema({
  week: { type: Number, required: true },
  assignmentTitle: { type: String, required: true },
  task: { type: String, required: true },
});

const AssignmentQuestionSchema: Schema = new Schema({
  domain: { type: String, required: true },
  assignments: { type: [AssignmentSchema], required: true },
});

const AssignmentQuestion: Model<IAssignmentQuestion> =
  mongoose.models.AssignmentQuestion ||
  mongoose.model<IAssignmentQuestion>("AssignmentQuestion", AssignmentQuestionSchema);

export default AssignmentQuestion;
