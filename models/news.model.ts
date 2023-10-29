import mongoose, { Document, Model, Schema } from 'mongoose'

export interface News extends Document {
    title: string
    titleFa: string
    titleAr: string
    category: string
    categoryFa:string
    categoryAr:string
    create_at: number
    update_at?: number
    publicationStatus: string
    fullText: string
    fullTextFa: string
    fullTextAr: string
    mainPic: string
    isDelete: boolean
    pics: String[]
}

const newsSchema: Schema = new mongoose.Schema({
    title: { type: String, required: true },
    titleFa: { type: String, required: true },
    titleAr: { type: String, required: true },
    category: { type: String, required: true },
    categoryFa: { type: String, required: true },
    categoryAr: { type: String, required: true },
    create_at: { type: Number, required: true },
    update_at: { type: Number },
    publicationStatus: { type: String },
    fullText: { type: String, required: true },
    fullTextFa: { type: String, required: true },
    fullTextAr: { type: String, required: true },
    mainPic: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    pics: { type: [String] , required: true },
})

const NewsModel: Model<News> = mongoose.model<News>('News', newsSchema);

export default NewsModel