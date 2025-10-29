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

        console.log('🔍 Validating lesson:', { lessonId, sectionId });

        const lesson = await Lesson.findOne({
            _id: lessonId,
            section: sectionId
        });

        if (!lesson) {
            console.log('❌ Lesson not found with:', { lessonId, sectionId });
            res.status(404).json({ error: "Lección no encontrada" });
            return
        }

        console.log('✅ Lesson found:', lesson._id);
        req.lesson = lesson;
        next();
    } catch (error) {
        console.error('💥 Error in validateLessonExists:', error);
        res.status(500).json({ error: "Hubo un error validando la lección" });
    }
}
