// Section.ts
import mongoose, { Schema, Document, Types } from "mongoose";
import Lesson from "./Lesson";

export interface ISection extends Document {
    title: string;
    description: string;
    course: Types.ObjectId; 
    lessons: Types.ObjectId[];
    order: number;
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
    ],
    order: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

//Middleware para eliminar lecciones asociadas cuando se elimina una sección
sectionSchema.pre('deleteOne', {document: true}, async function(){ 
    const lessonId = this._id; 
    if(!lessonId) return;
    await Lesson.deleteMany({section: lessonId}) //elimina las lecciones asociadas a esta sección
})


const Section = mongoose.model<ISection>("Section", sectionSchema);
export default Section;
