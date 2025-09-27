import type { Request, Response, NextFunction } from "express";
import Lesson, { ILesson } from "../models/Lesson";

declare global {
    namespace Express {
        interface Request {
            lesson?: ILesson;
        }
    }
}

export async function validateLessonExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { lessonId, sectionId } = req.params;

        const lesson = await Lesson.findOne({
            _id: lessonId,
            section: sectionId
        });

        if (!lesson) {
            res.status(404).json({ error: "Lección no encontrada" });
            return
        }

        req.lesson = lesson;
        next();
    } catch (error) {
        res.status(500).json({ error: "Hubo un error validando la lección" });
    }
}
