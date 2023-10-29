import mongoose, { Document, Model, Schema } from "mongoose";

export interface Product extends Document {
  _id: number;
  name: string;
  price?: string;
  amount?: string;
  create_at: number;
  update_at?: number;
  inventoryStatus: string;
  status: boolean;
  mainCategory: string;
  category: string;
  categoryType: string;
  industry: string;
  dataSheet?: string;
  shortDisc: string;
  overView?: string;
  overView_persian?: string;
  overView_arabic?: string;
  featureOne: string;
  featureTwo: string;
  featureThree: string;
  featureFour: string;
  featureFive: string;
  featureSix: string;
  isDelete: boolean;
}

const productSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String },
  amount: { type: String },
  create_at: { type: Number, required: true },
  update_at: { type: Number },
  inventoryStatus: { type: String, required: true },
  status: { type: Boolean, require: true, default: true },
  category: { type: String, require: true },
  categoryType: { type: String },
  mainCategory: { type: String, require: true },
  industry: { type: String, require: true },
  dataSheet: { type: String },
  shortDisc: { type: String, require: true },
  overView: { type: String },
  overView_persian: { type: String },
  overView_arabic: { type: String },
  featureOne: { type: String, require: true },
  featureTwo: { type: String, require: true },
  featureThree: { type: String, require: true },
  featureFour: { type: String, require: true },
  featureFive: { type: String, require: true },
  featureSix: { type: String, require: true },
  isDelete: { type: Boolean, default: false },
});

const ProductModel: Model<Product> = mongoose.model<Product>(
  "Product",
  productSchema
);

export default ProductModel;
