import mongoose, { Schema, Document, Types } from "mongoose";

// export interface Ilesson extends Document {
//     title: string
//     type: string
//     url: string
// }


export interface Icourse extends Document {
    courseName: string,
    description: string,
    department: string,
}



const courseSchema: Schema = new Schema({
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        // type: Schema.Types.ObjectId,
        type: String,
        ref: "Department",
        required: true
    },
    // lessons: [
    //     {
    //         title: { type: String, required: true },
    //         type: { type: String, enum: ["video", "pdf", "doc"], required: true },
    //         url: { type: String, required: true }
    //     }
    // ],
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
})

const Course = mongoose.model<Icourse>('Course', courseSchema)
export default Course;