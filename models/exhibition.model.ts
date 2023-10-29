import mongoose, { Document, Model, Schema } from "mongoose";
export interface Exhibition extends Document {
  _id: string;
  name?: string;
  phone?: string;
  compName?: string;
  industry?: string;
  fieldOfActivity?: string;
  jobPosition?: string;
}

const exhibitionSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  compName: { type: String },
  industry: { type: String },
  fieldOfActivity: { type: String },
  jobPosition: { type: String },
});

const ExhibitionModel: Model<Exhibition> = mongoose.model<Exhibition>(
  "exhibition",
  exhibitionSchema
);

export default ExhibitionModel;
