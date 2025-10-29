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
        const lessonId = req.params.lessonId;
        const sectionIdFromParams = req.params.sectionId;
        const sectionIdFromBody = typeof req.body?.sectionId === "string" ? req.body.sectionId.trim() : undefined;
        const sectionId = sectionIdFromParams || sectionIdFromBody;

        console.log('[LessonMiddleware] Validating lesson', { lessonId, sectionId });

        if (!lessonId) {
            res.status(400).json({ error: "ID de leccion es requerido" });
            return;
        }

        if (!sectionId) {
            res.status(400).json({ error: "ID de seccion es requerido" });
            return;
        }

        const lesson = await Lesson.findOne({
            _id: lessonId,
            section: sectionId
        });

        if (!lesson) {
            console.log('[LessonMiddleware] Lesson not found', { lessonId, sectionId });
            res.status(404).json({ error: "Leccion no encontrada" });
            return;
        }

        req.lesson = lesson;
        next();
    } catch (error) {
        console.error("[LessonMiddleware] Error validating lesson", error);
        res.status(500).json({ error: "Hubo un error validando la leccion" });
    }
}
