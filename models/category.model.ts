import mongoose, { Document, Model, Schema } from "mongoose";
export interface Industry extends Document {
  _id: string;
  name: string;
  name_persian: string;
  name_arabic: string;
  isDelete: boolean;
}

const industrySchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  name_persian: { type: String, required: true },
  name_arabic: { type: String, required: true },
  isDelete: { type: Boolean, default: false },
});

const IndustryModel: Model<Industry> = mongoose.model<Industry>(
  "industry",
  industrySchema
);

export default IndustryModel;
