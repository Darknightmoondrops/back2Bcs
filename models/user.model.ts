import mongoose, { Document, Model, Schema } from 'mongoose'
export interface User extends Document {
    _id: string
    name: string
    lastName: string
    professionalTitle: string
    companyName: string
    email: string
    phoneNumber: string
    password: string
    create_at: number
    role: string
    uid: string
    address: string
    postalCode: string

    isDelete: boolean
}
const userSchema: Schema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    professionalTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    create_at: { type: Number, required: true },
    role: { type: String, required: true },
    uid: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    isDelete: { type: Boolean, default: false }
})

const UserModel: Model<User> = mongoose.model<User>('User', userSchema)

export default UserModel