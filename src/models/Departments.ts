import mongoose, { Schema } from "mongoose"


export interface Idepartment {
    departmentName: string
}

const departmentSchema: Schema = new Schema({
    departmentName: {
        type: String,
        required: true,
        trim: true
    }

},{ timestamps: true })

const Deparment = mongoose.model<Idepartment>('Department', departmentSchema)
export default Deparment;