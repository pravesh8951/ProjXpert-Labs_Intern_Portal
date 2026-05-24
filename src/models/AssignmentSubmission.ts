import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAssignmentSubmission extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  courseDomain: "ai" | "cybersecurity";
  assignmentWeek: number;
  assignmentTitle: string;
  driveFileId: string;
  driveLink: string;
  fileName: string;
  fileSize: number;
  submittedAt: Date;
  deadline: Date;
  status: "submitted" | "reviewed" | "approved" | "needs_changes";
  adminRemarks: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSubmissionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    courseDomain: { type: String, enum: ["ai", "cybersecurity"], required: true },
    assignmentWeek: { type: Number, required: true, min: 1, max: 12 },
    assignmentTitle: { type: String, required: true },
    driveFileId: { type: String, required: true },
    driveLink: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["submitted", "reviewed", "approved", "needs_changes"],
      default: "submitted",
    },
    adminRemarks: { type: String, default: "" },
  },
  { timestamps: true }
);

// One submission per user per assignment week — no resubmission
AssignmentSubmissionSchema.index({ userId: 1, assignmentWeek: 1 }, { unique: true });

const AssignmentSubmission: Model<IAssignmentSubmission> =
  mongoose.models.AssignmentSubmission ||
  mongoose.model<IAssignmentSubmission>("AssignmentSubmission", AssignmentSubmissionSchema);

export default AssignmentSubmission;
