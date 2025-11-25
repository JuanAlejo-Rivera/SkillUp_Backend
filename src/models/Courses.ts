import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import { IUser } from "./User";

// export interface Ilesson extends Document {
//     title: string
//     type: string
//     url: string
// }


export interface Icourse extends Document {
    courseName: string,
    description: string,
    department: mongoose.Types.ObjectId;
    sections: Types.ObjectId[]
    manager: PopulatedDoc<IUser & Document>
    lastEditedBy?: PopulatedDoc<IUser & Document>
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
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },
    sections: [
        {
            type: Schema.Types.ObjectId,
            ref: "Section" // referencia al modelo Lesson
        }
    ],
    manager: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    lastEditedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
}, { timestamps: true })

const Course = mongoose.model<Icourse>('Course', courseSchema)
export default Course;