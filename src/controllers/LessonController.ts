import { json, Request, Response } from "express";
import Lesson from "../models/Lesson";



export class LeassonController {

    static createLesson = async (req: Request, res: Response) => {

        try {

            const { title, description, videoUrl, fileUrl } = req.body;

            const lesson = new Lesson({
                title,
                description,
                videoUrl,
                fileUrl,
                section: req.params.sectionId
            })

            req.section.lessons.push(lesson.id)
            await Promise.allSettled([lesson.save(), req.section.save()])

            res.send('Lección creada con éxito')



        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al crear la lección' })
        }
    }

    //TODO createLesson, getLessonsBySection, getLessonById, updateLesson , deleteLesson 
    
}