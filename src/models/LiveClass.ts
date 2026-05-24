import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILiveClassDay {
  day: number;
  title: string;
  liveClassTopic: string;
  meetingLink: string;
  recordingLink: string;
}

export interface ILiveClassDoc extends Document {
  days: ILiveClassDay[];
}

const LiveClassDaySchema = new Schema({
  day: { type: Number, required: true },
  title: { type: String },
  liveClassTopic: { type: String },
  meetingLink: { type: String },
  recordingLink: { type: String }
});

const LiveClassSchema = new Schema(
  {
    days: [LiveClassDaySchema]
  },
  { collection: "liveclasses" }
);

const LiveClass: Model<ILiveClassDoc> = mongoose.models.LiveClass || mongoose.model<ILiveClassDoc>("LiveClass", LiveClassSchema);
export default LiveClass;
