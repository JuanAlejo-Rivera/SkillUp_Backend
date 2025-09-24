import mongoose, { Schema, Document } from "mongoose";

export interface ILesson extends Document {
    title: string;
    description: string;
    type: "video" | "pdf" | "doc";
    url: string;
    section: mongoose.Types.ObjectId;
}

const lessonSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["video", "pdf", "doc"],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    section: {
        type: Schema.Types.ObjectId,
        ref: "Section",
        required: true
    }
}, { timestamps: true });

const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);
export default Lesson;
