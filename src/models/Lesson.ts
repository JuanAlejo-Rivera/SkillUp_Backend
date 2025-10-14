import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILesson extends Document {
    title: string;
    description?: string;
    videoUrl?: string[];
    fileUrl?: string[];
    imageUrl?: string[];
    section: Types.ObjectId;
}

const lessonSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        videoUrl: {
            type: [String],
            trim: true,
        },
        fileUrl: {
            type: [String],
            trim: true,
        },
        imageUrl: {
            type: [String],
            trim: true
        },
        section: {
            type: Schema.Types.ObjectId,
            ref: "Section",
            required: true,
        },
    },
    { timestamps: true }
);

const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);
export default Lesson;
