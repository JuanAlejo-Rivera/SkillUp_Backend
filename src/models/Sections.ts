// Section.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISection extends Document {
    title: string;
    description: string;
    course: Types.ObjectId; 
    lessons: Types.ObjectId[];
}

const sectionSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    course: {
        type: Types.ObjectId,
        ref: "Course",
        required: true
    },
    lessons: [
        {
            type: Schema.Types.ObjectId,
            ref: "Lesson" // referencia al modelo Lesson
        }
    ]

}, { timestamps: true });

const Section = mongoose.model<ISection>("Section", sectionSchema);
export default Section;
