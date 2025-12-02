import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import { IUser } from "./User";
import Section from "./Sections";
import Lesson from "./Lesson";

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

//Middleware para eliminar secciones y lecciones asociadas cuando se elimina un curso
courseSchema.pre('deleteOne', { document: true }, async function () { //debe ser asi ya que en las arrow functions no se puede acceder al this
    const courseId = this._id; //this hace referencia al documento que se esta eliminando
    if (!courseId) return;

    const sections = await Section.find({course: courseId}) //traigo las secciones asociadas a este curso
    for(const section of sections){
        await Lesson.deleteMany({section: section._id}) //elimino las lecciones asociadas a esta sección
    }
    await Section.deleteMany({ course: courseId}) //borro las secciones asociadas a este curso
})




const Course = mongoose.model<Icourse>('Course', courseSchema)
export default Course;